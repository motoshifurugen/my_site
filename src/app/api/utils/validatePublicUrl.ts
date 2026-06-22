import dns from 'dns'
import net from 'net'
import { Agent, buildConnector } from 'undici'

/**
 * SSRF 対策: 外部公開してよい URL かを検証するユーティリティ。
 *
 * 多層防御:
 * 1. assertPublicUrl … スキームを http/https に限定し、初回 URL の宛先を検証
 * 2. createSafeDispatcher … 実際に TCP 接続する直前に解決先 IP を検証する
 *    undici Agent。リダイレクト先・DNS リバインディングも接続層でブロックする
 *    （初回 URL だけ検証しても fetch がリダイレクトを追従するため）。
 */

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnsafeUrlError'
  }
}

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])

// IPv4 を 32bit 整数へ変換
function ipv4ToInt(ip: string): number {
  return (
    ip.split('.').reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0
  )
}

function isPrivateIpv4(ip: string): boolean {
  const n = ipv4ToInt(ip)
  const inRange = (base: string, bits: number) =>
    n >>> (32 - bits) === ipv4ToInt(base) >>> (32 - bits)

  return (
    inRange('0.0.0.0', 8) || // 現在のネットワーク / 未指定
    inRange('10.0.0.0', 8) || // プライベート
    inRange('100.64.0.0', 10) || // CGNAT
    inRange('127.0.0.0', 8) || // ループバック
    inRange('169.254.0.0', 16) || // リンクローカル（メタデータ 169.254.169.254 含む）
    inRange('172.16.0.0', 12) || // プライベート
    inRange('192.0.0.0', 24) || // IETF プロトコル割当
    inRange('192.168.0.0', 16) || // プライベート
    inRange('198.18.0.0', 15) || // ベンチマーク
    inRange('224.0.0.0', 4) || // マルチキャスト
    inRange('240.0.0.0', 4) // 予約
  )
}

function isPrivateIpv6(ip: string): boolean {
  const addr = ip.toLowerCase()

  // IPv4-mapped (::ffff:a.b.c.d) は埋め込み IPv4 として判定
  const mapped = addr.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) {
    return isPrivateIpv4(mapped[1])
  }

  return (
    addr === '::' || // 未指定
    addr === '::1' || // ループバック
    addr.startsWith('fc') || // ユニークローカル fc00::/7
    addr.startsWith('fd') ||
    addr.startsWith('fe8') || // リンクローカル fe80::/10
    addr.startsWith('fe9') ||
    addr.startsWith('fea') ||
    addr.startsWith('feb') ||
    addr.startsWith('fec') || // 廃止サイトローカル fec0::/10
    addr.startsWith('fed') ||
    addr.startsWith('fee') ||
    addr.startsWith('fef') ||
    addr.startsWith('ff') // マルチキャスト ff00::/8
  )
}

export function isPrivateIp(ip: string): boolean {
  const type = net.isIP(ip)
  if (type === 4) return isPrivateIpv4(ip)
  if (type === 6) return isPrivateIpv6(ip)
  // 判定不能な値は安全側に倒して拒否
  return true
}

/**
 * URL が外部取得して安全な公開ホストを指しているか検証する。
 * 問題があれば UnsafeUrlError を throw する。
 */
export async function assertPublicUrl(rawUrl: string): Promise<URL> {
  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new UnsafeUrlError('Invalid URL')
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new UnsafeUrlError('Only http and https URLs are allowed')
  }

  const hostname = parsed.hostname

  // ホスト名がそのまま IP リテラルの場合はそれを検証
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new UnsafeUrlError('URL resolves to a private address')
    }
    return parsed
  }

  // 名前解決し、すべての解決先がパブリックであることを確認
  let addresses: dns.LookupAddress[]
  try {
    addresses = await dns.promises.lookup(hostname, { all: true })
  } catch {
    throw new UnsafeUrlError('Failed to resolve hostname')
  }

  if (addresses.length === 0) {
    throw new UnsafeUrlError('Failed to resolve hostname')
  }

  for (const { address } of addresses) {
    if (isPrivateIp(address)) {
      throw new UnsafeUrlError('URL resolves to a private address')
    }
  }

  return parsed
}

/**
 * 名前解決の結果がプライベート宛先なら接続を失敗させる dns.lookup 互換関数。
 * undici の connector に渡され、ホスト名指定の接続（リダイレクト先含む）を守る。
 */
function safeLookup(
  hostname: string,
  options: dns.LookupOneOptions | dns.LookupAllOptions,
  callback: (
    err: NodeJS.ErrnoException | null,
    address: string | dns.LookupAddress[],
    family?: number,
  ) => void,
): void {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) {
      callback(err, '', undefined)
      return
    }
    for (const { address } of addresses) {
      if (isPrivateIp(address)) {
        callback(
          new UnsafeUrlError(`Blocked private address: ${address}`),
          '',
          undefined,
        )
        return
      }
    }
    if ((options as dns.LookupAllOptions).all) {
      callback(null, addresses)
    } else {
      callback(null, addresses[0].address, addresses[0].family)
    }
  })
}

/**
 * SSRF を接続層で防ぐ undici Agent を生成する。
 *
 * - ホスト名指定の接続は safeLookup で解決先 IP を検証
 * - IP リテラル指定の接続（リダイレクト先が生 IP の場合など、lookup を経由しない）
 *   は接続関数側で直接検証
 *
 * これにより初回 URL だけでなく、リダイレクト先や DNS リバインディングによる
 * プライベート宛先到達も接続が確立する前にブロックされる。
 */
export function createSafeDispatcher(): Agent {
  const baseConnector = buildConnector({ lookup: safeLookup })
  return new Agent({
    connect: (opts, cb) => {
      if (net.isIP(opts.hostname) && isPrivateIp(opts.hostname)) {
        cb(
          new UnsafeUrlError(`Blocked private address: ${opts.hostname}`),
          null,
        )
        return
      }
      baseConnector(opts, cb)
    },
  })
}
