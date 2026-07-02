// パネルの影トークン集約（Issue #223 UI刷新 1/3）の回帰防止テスト。
//
// #223 要件2 はカード・パネル類の shadow-sm/md/lg 乱立を boxShadow の
// card / card-hover 2 トークンへ集約する。BlogCard/ProfileCard と同一の
// 「白/night-gray 背景 + padding + shadow」パネルである ArticleContent 本文枠と
// Toc 目次枠が shadow-sm のまま取り残され、同一ページで新旧の影が混在していた
// のが architect レビューの指摘（family_tag: spec-nonconformance）。
// いずれも非リンクのため hover の浮き上がりは付与せず、基底トークン shadow-card
// へ集約する。本テストはその className 契約を固定し shadow-sm の再混入を防ぐ。
//
// レンダリングではなくソースの静的検査で契約を固定する（layout.font.test.ts と同方針）。
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const targets = [
  'components/templates/ArticleContent.tsx',
  'components/molecules/Toc.tsx',
]

for (const rel of targets) {
  const source = readFileSync(new URL(`./${rel}`, import.meta.url), 'utf8')

  test(`${rel}: パネルの影を shadow-card トークンへ集約する`, () => {
    assert.ok(source.includes('shadow-card'), 'shadow-card を含む')
  })

  test(`${rel}: 旧 shadow-sm を残さない`, () => {
    assert.ok(!source.includes('shadow-sm'), 'shadow-sm を含まない')
  })
}
