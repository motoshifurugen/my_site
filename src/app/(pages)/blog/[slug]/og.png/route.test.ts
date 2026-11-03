// 記事ごとの OG 画像を PNG で書き出す静的ルートハンドラ（/blog/{slug}/og.png / Issue #250 /
// TDD 先行）の契約を固定するテスト。
//
// - dynamic = 'force-static'、dynamicParams = false を公開する。output: export のビルドで
//   out/blog/{slug}/og.png として書き出す（拡張子 .png が付き、Pages が image/png で配信する）
// - generateStaticParams を ../page.server から再 export する。route handler は自分のファイルが
//   export したものしか使わないため、page.tsx の export だけでは足りない
// - GET は記事のタイトルから 1200×630 の PNG を返す
// - フォントは手元（node_modules）から読み、タイトルの絵文字は画像に入れない。
//   どちらかが欠けると next/og がビルド中に Google Fonts / jsdelivr へ fetch する
// - CI の Pages ビルドは src/app/api/**/route.ts(x) を消すため、src/app/api の外に置く
// - route ファイルは page やコンポーネントから import しない（CLAUDE.md の Deployment 節）
//
// next/og は node（node --import tsx）でも PNG を描けるので、search-index.json/route.test.ts と
// 同じく route を直接 import して呼ぶ。route → page.server → getPostData → ogImageRender の
// 流れを、実在する記事で通す結合テストを兼ねる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は route.tsx / ogImageRender.tsx / @fontsource/noto-sans-jp が無いため RED、実装後に GREEN。

import { getAllPostsMeta } from '@/app/api/utils/getPostData'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { before, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { generateStaticParams as pageServerStaticParams } from '../page.server'
import { GET, dynamic, dynamicParams, generateStaticParams } from './route'

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

// 絵文字を含むタイトルの実在記事（'Reactでポートフォリオサイトを作成する 🚀（1）'）
const EMOJI_TITLE_SLUG = 'create_my_site'

const callGet = (slug: string): Promise<Response> =>
  GET(new Request(`https://furugen-island.com/my_site/blog/${slug}/og.png`), {
    params: Promise.resolve({ slug }),
  })

// PNG の IHDR チャンクは 16〜23 バイト目に幅と高さを big endian で持つ
const pngSize = (bytes: Uint8Array): { width: number; height: number } => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return { width: view.getUint32(16), height: view.getUint32(20) }
}

// ImageResponse は body を読むときに描画するので、読み終えるまで fetch を見張る。
// next/og が同梱する yoga は、初回の描画で自分の wasm を data: URL として fetch する。
// data: URL はネットへ出ないので、記録せずに本物の fetch へ渡す。
const renderWithoutNetwork = async (
  slug: string,
): Promise<{ response: Response; bytes: Uint8Array; fetched: string[] }> => {
  const fetched: string[] = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : String(input)
    if (url.startsWith('data:')) return originalFetch(input, init)
    fetched.push(url)
    throw new Error(`OG 画像の描画中に fetch した: ${url}`)
  }) as typeof fetch
  try {
    const response = await callGet(slug)
    const bytes = new Uint8Array(await response.arrayBuffer())
    return { response, bytes, fetched }
  } finally {
    globalThis.fetch = originalFetch
  }
}

let emojiTitle: { response: Response; bytes: Uint8Array; fetched: string[] }
before(async () => {
  emojiTitle = await renderWithoutNetwork(EMOJI_TITLE_SLUG)
})

// --- route segment config ---

test('og.png: dynamic を force-static にして、ビルド時に書き出す', () => {
  // Given/When/Then
  assert.equal(dynamic, 'force-static')
})

test('og.png: dynamicParams を false にして、公開記事以外の画像を作らない', () => {
  // Given/When/Then
  assert.equal(dynamicParams, false)
})

test('og.png: generateStaticParams は記事ページと同じ slug の集合を返す', async () => {
  // Given
  const expected = await pageServerStaticParams()
  // When
  const actual = await generateStaticParams()
  // Then
  assert.ok(actual.length > 0, '公開記事の slug を返す')
  assert.deepEqual(actual, expected)
})

// --- GET の応答 ---

test('og.png: GET は 200 を返す', () => {
  // Given/When: before で描画した実在記事の応答
  // Then
  assert.equal(emojiTitle.response.status, 200)
})

test('og.png: GET の Content-Type は image/png', () => {
  // Given/When/Then
  assert.match(
    emojiTitle.response.headers.get('content-type') ?? '',
    /^image\/png/,
  )
})

test('og.png: GET の本文は PNG である', () => {
  // Given/When: 本文の先頭 8 バイト
  const head = Array.from(emojiTitle.bytes.slice(0, PNG_SIGNATURE.length))
  // Then
  assert.deepEqual(head, PNG_SIGNATURE)
})

test('og.png: PNG の大きさは 1200×630', () => {
  // Given/When/Then
  assert.deepEqual(pngSize(emojiTitle.bytes), { width: 1200, height: 630 })
})

test('og.png: 絵文字を含むタイトルでも描画中にネットへ出ない', () => {
  // Given/When: fetch を見張って描画した結果
  // Then: twemoji も Google Fonts も取りに行かない
  assert.deepEqual(emojiTitle.fetched, [])
})

test('og.png: 公開記事すべての画像を、ネットに出ずに 1200×630 で描ける', async () => {
  // Given: 書き出す対象の記事すべて。手元のフォントに無い字があると、
  //        next/og は Google Fonts へ取りに行く（＝豆腐になる恐れがある）
  const posts = await getAllPostsMeta()
  assert.ok(posts.length > 0, '公開記事がある')
  for (const post of posts) {
    // When
    const { response, bytes, fetched } = await renderWithoutNetwork(post.slug)
    // Then
    assert.equal(response.status, 200, `${post.slug}: 200`)
    assert.deepEqual(fetched, [], `${post.slug}: fetch しない`)
    assert.deepEqual(
      pngSize(bytes),
      { width: 1200, height: 630 },
      `${post.slug}: 1200×630`,
    )
  }
})

test('og.png: 存在しない slug では既定の画像に逃げず、失敗する', async () => {
  // Given/When/Then: getBlogArticle が投げたエラーをそのまま返す
  await assert.rejects(async () => {
    const response = await callGet('no_such_post_for_og_image')
    await response.arrayBuffer()
  })
})

// --- 置き場所と依存の向き ---

test('og.png: Pages ビルドで消されないよう src/app/api の外に置く', () => {
  // Given: このテストと同じフォルダにある route.tsx
  const routeDir = path.dirname(fileURLToPath(import.meta.url))
  const apiDir = path.resolve(process.cwd(), 'src', 'app', 'api')
  // Then
  assert.ok(
    !routeDir.startsWith(apiDir + path.sep),
    `${routeDir} は ${apiDir} の下にない`,
  )
})

const sourceFilesUnder = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return sourceFilesUnder(full)
    return /\.(ts|tsx|mjs)$/.test(name) ? [full] : []
  })

test('og.png: route ファイルをほかのソースから import しない', () => {
  // Given: src 配下のソース（このテスト自身は除く）
  const self = fileURLToPath(import.meta.url)
  const files = sourceFilesUnder(path.resolve(process.cwd(), 'src')).filter(
    (file) => file !== self,
  )
  // When: og.png/route を指す import
  const importers = files.filter((file) =>
    /from\s+['"][^'"]*og\.png\/route['"]/.test(readFileSync(file, 'utf8')),
  )
  // Then: Pages ビルドの route 削除や依存の向きを崩さない
  assert.deepEqual(importers, [])
})
