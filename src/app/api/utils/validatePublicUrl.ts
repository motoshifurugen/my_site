import dns from 'dns'
import net from 'net'

/**
 * SSRF 対策: 外部公開してよい URL かを検証するユーティリティ。
 *
 * - スキームは http / https のみ許可
 * - ホスト名を名前解決し、プライベート / ループバック / リンクローカル /
 *   クラウドメタデータ（169.254.169.254 等）に解決される宛先を拒否
 *
 * 注意: DNS リバインディング（解決後に IP が変わる攻撃）までは完全に防げない。
 * 個人サイトの OG 取得用途として現実的な多層防御に留める。
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
    addr.startsWith('feb')
  )
}

function isPrivateIp(ip: string): boolean {
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
