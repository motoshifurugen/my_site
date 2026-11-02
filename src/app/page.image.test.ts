// トップページの島の画像（LCP 候補）を高優先度で読み込む配線を固定する静的検査テスト
// （Issue #173 / TDD 先行）。
//
// 14 系では next/image の priority で preload の <link> と fetchpriority="high" を出し、
// loading="lazy" を付けていなかった。Next 16 では priority が非推奨の preload の別名になり、
// fetchpriority="high" を出さなくなる。14 系と同じ出力を保つため、priority を
// preload と fetchPriority="high" に置き換える。
//
// page.tsx は CSS を import するコンポーネントを多く読み込むので node test から描画できない。
// page.seo.test.ts と同じく、ソースの静的検査で契約を固定する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は priority のままなので RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const page = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

function islandImageTag(source: string): string {
  const tags = source.match(/<Image\b[\s\S]*?\/>/g)
  assert.ok(tags, 'page.tsx が <Image /> を描画する')
  const island = tags!.filter((tag) => tag.includes('/images/island.png'))
  assert.equal(island.length, 1, '島の画像の <Image /> を 1 つだけ抽出できる')
  return island[0]
}

const islandImage = islandImageTag(page)

test('トップページ: 島の画像に preload を指定する', () => {
  // Given/When: 島の画像の <Image /> 要素
  // Then: 値なしの preload 属性（true）を持つ
  assert.match(islandImage, /\spreload(\s|\/>)/)
})

test('トップページ: 島の画像に fetchPriority="high" を指定する', () => {
  // Given/When: 島の画像の <Image /> 要素
  // Then: Next 16 では preload だけだと出なくなる fetchpriority="high" を明示する
  assert.ok(islandImage.includes('fetchPriority="high"'))
})

test('トップページ: 島の画像に非推奨の priority を使わない', () => {
  // Given/When: 島の画像の <Image /> 要素
  // Then: Next 16 で非推奨の priority 属性を残さない
  assert.doesNotMatch(islandImage, /\spriority(\s|=|\/>)/)
})
