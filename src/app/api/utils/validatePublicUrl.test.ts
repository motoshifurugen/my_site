import assert from 'node:assert/strict'
import http from 'node:http'
import { test } from 'node:test'
import { fetch } from 'undici'
import {
  assertPublicUrl,
  createSafeDispatcher,
  isPrivateIp,
  UnsafeUrlError,
} from './validatePublicUrl'

test('isPrivateIp: プライベート/予約 IPv4 をブロック', () => {
  for (const ip of [
    '127.0.0.1',
    '10.0.0.5',
    '169.254.169.254', // クラウドメタデータ
    '172.16.0.1',
    '192.168.1.1',
    '100.64.0.1', // CGNAT
    '0.0.0.0',
  ]) {
    assert.equal(isPrivateIp(ip), true, `${ip} は private 判定されるべき`)
  }
})

test('isPrivateIp: パブリック IPv4 は許可', () => {
  for (const ip of ['8.8.8.8', '1.1.1.1', '93.184.216.34']) {
    assert.equal(isPrivateIp(ip), false, `${ip} は public 判定されるべき`)
  }
})

test('isPrivateIp: IPv6 のループバック/ULA/リンクローカル/マルチキャスト/サイトローカルをブロック', () => {
  for (const ip of [
    '::1',
    'fc00::1',
    'fd12::1',
    'fe80::1',
    'ff02::1', // マルチキャスト
    'fec0::1', // 廃止サイトローカル
    '::ffff:127.0.0.1', // IPv4-mapped
  ]) {
    assert.equal(isPrivateIp(ip), true, `${ip} は private 判定されるべき`)
  }
})

test('assertPublicUrl: http/https 以外のスキームを拒否', async () => {
  await assert.rejects(
    () => assertPublicUrl('file:///etc/passwd'),
    UnsafeUrlError,
  )
  await assert.rejects(
    () => assertPublicUrl('ftp://example.com/'),
    UnsafeUrlError,
  )
})

test('assertPublicUrl: IP リテラルのプライベート宛先を拒否', async () => {
  await assert.rejects(
    () => assertPublicUrl('http://169.254.169.254/latest/meta-data/'),
    UnsafeUrlError,
  )
  await assert.rejects(() => assertPublicUrl('http://[::1]/'), UnsafeUrlError)
})

test('safe dispatcher: IP リテラルのループバック宛先を接続時にブロック（リダイレクト先対策）', async () => {
  const dispatcher = createSafeDispatcher()
  const server = http.createServer((_q, s) => s.end('SECRET'))
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()))
  const port = (server.address() as { port: number }).port
  try {
    await assert.rejects(
      fetch(`http://127.0.0.1:${port}/`, { dispatcher }),
      'ループバック宛先は拒否されるべき',
    )
  } finally {
    server.close()
  }
})

test('safe dispatcher: プライベートに名前解決されるホストを接続時にブロック（リダイレクト先対策）', async () => {
  const dispatcher = createSafeDispatcher()
  const server = http.createServer((_q, s) => s.end('SECRET'))
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()))
  const port = (server.address() as { port: number }).port
  try {
    // localhost は 127.0.0.1 に解決される → safeLookup がブロックするはず
    await assert.rejects(
      fetch(`http://localhost:${port}/`, { dispatcher }),
      'localhost は private に解決されるため拒否されるべき',
    )
  } finally {
    server.close()
  }
})
