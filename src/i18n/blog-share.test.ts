// 記事末の共有欄（Issue #250 / TDD 先行）の i18n キー契約を固定する単体テスト。
//
// blog.share.{heading, message, x, hatena, copyLink, copied} を ja / en の両方に足す。
// 型 Translations は ja / en に同じ shape を求めるが、実行時にも
// 「両ロケールでキーが揃い、値が空でない」ことを確かめる（片側の更新漏れ・空のプレースホルダを防ぐ）。
// 文言そのものは固定しない。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は blog.share が無いため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { translations } from './translations'
import type { Locale } from './types'

const LOCALES: Locale[] = ['ja', 'en']
const SHARE_KEYS = [
  'heading',
  'message',
  'x',
  'hatena',
  'copyLink',
  'copied',
] as const

for (const locale of LOCALES) {
  test(`translations[${locale}]: blog.share ブロックがある`, () => {
    assert.ok(
      translations[locale].blog.share,
      `translations.${locale}.blog.share が未定義`,
    )
  })

  for (const key of SHARE_KEYS) {
    test(`translations[${locale}]: blog.share.${key} が空でない文字列`, () => {
      // Given
      const value = translations[locale].blog.share[key]
      // Then
      assert.equal(typeof value, 'string')
      assert.ok(value.trim().length > 0, `blog.share.${key} が空`)
    })
  }

  test(`translations[${locale}]: コピー前とコピー後の文言が違う`, () => {
    // Given
    const { copyLink, copied } = translations[locale].blog.share
    // Then: 押したことが文言の変化でわかる
    assert.notEqual(copyLink, copied)
  })
}

test('translations: blog.share のキー集合が ja / en で一致する', () => {
  // Given
  const jaKeys = Object.keys(translations.ja.blog.share).sort()
  const enKeys = Object.keys(translations.en.blog.share).sort()
  // Then
  assert.deepEqual(jaKeys, enKeys)
  assert.deepEqual(jaKeys, [...SHARE_KEYS].sort())
})
