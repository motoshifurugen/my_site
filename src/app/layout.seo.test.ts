// ルートレイアウトの SEO メタ配線（Issue #19 SEO 改善 / TDD 先行）を固定する静的検査テスト。
//
// ページの多くは 'use client' で metadata を export できない。そのためルートレイアウトの
// metadata 1 か所で、全ページの canonical と OG / Twitter メタをまかなう:
//   - metadataBase に SITE_URL（basePath 込み）を置く
//   - alternates.canonical と openGraph.url（baseOpenGraph 内）を './' で書く。
//     Next 14.2.35 は './' を表示中ページの pathname で解決するので、ページごとの URL になる
//   - openGraph / twitter に title / description を書かない。Next がページの値を引き継ぐ
// 既存の title / description / icons は変えない。
//
// layout.tsx は CSS を import するので node test から import できない。
// layout.font.test.ts と同じく、ソースの静的検査で契約を固定する。空白・改行・末尾カンマは
// Prettier の整形で変わりうるので、比較前に空白を取り除く。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は metadataBase / alternates / openGraph / twitter が無いため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const layout = readFileSync(new URL('./layout.tsx', import.meta.url), 'utf8')

function metadataBlock(source: string): string {
  const match = source.match(
    /export const metadata: Metadata = \{([\s\S]*?)\n\}\n/,
  )
  assert.ok(match, 'layout.tsx から metadata のオブジェクトを抽出できる')
  return match![1]
}

function stripWhitespace(source: string): string {
  return source.replace(/\s+/g, '')
}

const metadata = metadataBlock(layout)
const compactMetadata = stripWhitespace(metadata)

test('layout: SITE_URL と baseOpenGraph をサイト共通モジュールから読み込む', () => {
  // Given: layout.tsx の import 文
  const match = layout.match(
    /import\s*\{([^}]*)\}\s*from\s*'(?:@\/config\/site|\.\.\/config\/site)'/,
  )
  // When/Then: サイト URL と OG の共通部分を自前で持たない
  assert.ok(match, 'src/config/site から名前付き import している')
  const names = match![1].split(',').map((name) => name.trim())
  assert.ok(names.includes('SITE_URL'), 'SITE_URL を import する')
  assert.ok(names.includes('baseOpenGraph'), 'baseOpenGraph を import する')
})

test('layout: metadataBase に SITE_URL を置く', () => {
  // Given/When/Then: 相対 URL（canonical / og:url / og:image）の解決基準を basePath 込みにする
  assert.ok(
    compactMetadata.includes('metadataBase:newURL(SITE_URL)'),
    'metadataBase: new URL(SITE_URL) を持つ',
  )
})

test("layout: canonical を './' で書き、ページごとの URL に解決させる", () => {
  // Given/When/Then: 絶対 URL にすると全ページが同じ canonical になる
  assert.match(compactMetadata, /alternates:\{canonical:'\.\/',?\}/)
})

test('layout: openGraph に baseOpenGraph をそのまま渡す', () => {
  // Given/When/Then: title / description を足さず、ページの値を引き継がせる
  assert.match(compactMetadata, /openGraph:baseOpenGraph,/)
})

test("layout: twitter は card: 'summary' だけを持つ", () => {
  // Given/When/Then: title / description / image は Next が openGraph から補う
  assert.match(compactMetadata, /twitter:\{card:'summary',?\}/)
})

test('layout: 既存の title を変えない', () => {
  assert.ok(
    metadata.includes(
      "'Furugen Island | 古堅基史（なんくるないさ系エンジニア）の開発ポートフォリオサイト'",
    ),
    '既存の title 文字列を保つ',
  )
})

test('layout: 既存の description を変えない', () => {
  assert.ok(
    metadata.includes(
      "'古堅基史（ふるげんもとし）のポートフォリオサイト。Furugen Motoshi, フロントエンドエンジニアの開発実績やブログを掲載。情熱と遊び心を持って日々挑戦しています。'",
    ),
    '既存の description 文字列を保つ',
  )
})

test('layout: 既存の icons を変えない', () => {
  // Given/When/Then: favicon の 5 種を保つ
  for (const url of [
    '/my_site/favicon/icon-16x16.png',
    '/my_site/favicon/icon-32x32.png',
    '/my_site/favicon/apple-icon.png',
    '/my_site/favicon/favicon.ico',
    '/my_site/favicon/site.webmanifest',
  ]) {
    assert.ok(metadata.includes(`url: '${url}'`), `${url} を保つ`)
  }
})
