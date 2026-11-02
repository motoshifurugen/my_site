// ブログ一覧の検索欄とタグ一覧（Issue #7 / TDD 先行）の i18n キー契約を固定する単体テスト。
//
// blog.search.{label, placeholder, noResults} と blog.tagList を ja / en の両方に足す。
// 型 Translations は ja / en に同じ shape を求めるが、実行時にも
// 「両ロケールでキーが揃い、値が空でない」ことを確かめる（片側の更新漏れ・空のプレースホルダを防ぐ）。
// 文言そのものは固定しない。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は blog.search / blog.tagList が無いため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { translations } from './translations'
import type { Locale } from './types'

const LOCALES: Locale[] = ['ja', 'en']
const SEARCH_KEYS = ['label', 'placeholder', 'noResults'] as const

for (const locale of LOCALES) {
  test(`translations[${locale}]: blog.search ブロックがある`, () => {
    assert.ok(
      translations[locale].blog.search,
      `translations.${locale}.blog.search が未定義`,
    )
  })

  for (const key of SEARCH_KEYS) {
    test(`translations[${locale}]: blog.search.${key} が空でない文字列`, () => {
      // Given
      const value = translations[locale].blog.search[key]
      // Then
      assert.equal(typeof value, 'string')
      assert.ok(value.trim().length > 0, `blog.search.${key} が空`)
    })
  }

  test(`translations[${locale}]: blog.tagList が空でない文字列`, () => {
    // Given
    const value = translations[locale].blog.tagList
    // Then
    assert.equal(typeof value, 'string')
    assert.ok(value.trim().length > 0, 'blog.tagList が空')
  })
}

test('translations: blog.search のキー集合が ja / en で一致する', () => {
  // Given
  const jaKeys = Object.keys(translations.ja.blog.search).sort()
  const enKeys = Object.keys(translations.en.blog.search).sort()
  // Then
  assert.deepEqual(jaKeys, enKeys)
  assert.deepEqual(jaKeys, [...SEARCH_KEYS].sort())
})
