// sitemap.xml を生成する metadata ルートの route segment config を固定する単体テスト
// （Issue #173 / TDD 先行）。
//
// Next 16 の output: export（CI の GitHub Pages ビルド）では、sitemap.ts が
// dynamic = 'force-static' を公開していないとページデータの収集で止まる。
// robots.ts と blog/search-index.json/route.ts も同じ書き方をとる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は dynamic を公開していないため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import * as sitemapRoute from './sitemap'

test('sitemap: dynamic を force-static にして、output: export のビルドで書き出す', () => {
  // Given/When: sitemap.ts が公開する route segment config
  // Then: ビルド時に静的な sitemap.xml として書き出される
  assert.equal(sitemapRoute.dynamic, 'force-static')
})
