// Noto Sans JP フェイス配線（Issue #223 UI刷新 1/3）の回帰防止テスト。
//
// #223 で Google Fonts の <link> を撤去し next/font/google へ一本化した。
// next/font は CSS 変数 --font-noto-sans-jp に生成フェイス名を割り当てるため、
// 正式名リテラル "Noto Sans JP" を font-family に直書きすると自前フェイスへ
// 解決されず、未インストール環境で汎用 sans へフォールバックする（回帰）。
// serif 側は var(--font-noto-serif-jp) へ変換済みなのに sans 側が取り残された
// のが architect/coding 両レビューの指摘（family_tag: contract-wiring-gap）。
// 本テストは対象ファイル群が変数参照へ統一され、リテラルが再混入しないことを固定する。
//
// レンダリングではなくソースの静的検査で契約を固定する（layout.font.test.ts と同方針）。
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

// <link> 撤去で自前フェイスへ解決させる必要がある font-family 宣言を持つファイル群
const targets = [
  '(pages)/book/page.tsx',
  'components/templates/ArticleContent.module.css',
  'components/atoms/Chip.module.css',
]

for (const rel of targets) {
  const source = readFileSync(new URL(`./${rel}`, import.meta.url), 'utf8')

  test(`${rel}: 正式名リテラル "Noto Sans JP" を font-family に直書きしない`, () => {
    assert.ok(
      !source.includes('"Noto Sans JP"'),
      'リテラル "Noto Sans JP" を含まない',
    )
  })

  test(`${rel}: CSS 変数 var(--font-noto-sans-jp) でフェイスを参照する`, () => {
    assert.ok(
      source.includes('var(--font-noto-sans-jp)'),
      'var(--font-noto-sans-jp) を含む',
    )
  })
}
