// robots.txt を生成する metadata ルート（Issue #19 SEO 改善 / TDD 先行）の契約を固定する単体テスト。
//
// src/app/robots.ts は Next の規約どおり robots.txt を静的に生成する。
// 全クローラーに全体を許可し、既存 sitemap.ts が出す sitemap.xml の絶対 URL を知らせる。
// sitemap.ts は「既にあるものは変えない」指示により URL を文字列で持ち続けるため、
// robots.txt が指す URL と sitemap.ts の基底 URL が食い違わないことも静的に確かめる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は src/app/robots.ts が無いため import エラーで RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { SITE_URL } from '../config/site'
import robots from './robots'

test('robots: 全クローラーに全体のクロールを許可し、sitemap の絶対 URL を知らせる', () => {
  // Given/When: Next がビルド時に呼ぶ robots() の戻り値
  const result = robots()
  // Then: Disallow を持たず、sitemap は basePath 込みの絶対 URL
  assert.deepEqual(result, {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://furugen-island.com/my_site/sitemap.xml',
  })
})

test('robots: sitemap の URL は SITE_URL から組み立てる', () => {
  // Given/When
  const result = robots()
  // Then: サイト URL の定義を 1 か所に保つ
  assert.equal(result.sitemap, `${SITE_URL}/sitemap.xml`)
})

test('robots: 指す sitemap の基底 URL が sitemap.ts の baseUrl と一致する', () => {
  // Given: 既存 sitemap.ts（変更しない）が持つ基底 URL
  const sitemapSource = readFileSync(
    new URL('./sitemap.ts', import.meta.url),
    'utf8',
  )
  const match = sitemapSource.match(/const baseUrl = '([^']+)'/)
  assert.ok(match, 'sitemap.ts から baseUrl を抽出できる')
  // When/Then: robots.txt が知らせる sitemap と、sitemap 内の URL が同じサイトを指す
  assert.equal(match![1], SITE_URL)
})
