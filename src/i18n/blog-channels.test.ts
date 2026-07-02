// ブログの i18n キー契約を固定する単体テスト。
//
// 経緯:
//   - #229 で t.blog.lead（立ち位置の一文）と t.blog.channels（{ heading, zenn, note }）を追加。
//   - #243 で t.blog.lead を削除（ブログ説明文の非表示）。channels は維持する。
// 型 Translations は ja/en 双方に同一 shape を要求するため片側更新は型エラーになる。
// 本テストは「両ロケールで channels のキーが揃い非空である」ことに加え、
// 「blog.lead が両ロケールから削除済み（残存しない）」ことを実行時に明示的に固定する
// （片側取り残し・空プレースホルダ・lead 残存の防止）。既存 translations.test.ts と同じ流儀で書く。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は blog.lead / blog.channels 未追加のため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { translations } from './translations'
import type { Locale } from './types'

const LOCALES: Locale[] = ['ja', 'en']
const CHANNEL_KEYS = ['heading', 'zenn', 'note'] as const

for (const locale of LOCALES) {
  test(`translations[${locale}]: blog.lead キーを持たない（#243 で削除）`, () => {
    // Given: 当該ロケールの blog ブロック（型からも lead は除去済みのため cast して残存を検査）
    const blog = translations[locale].blog as Record<string, unknown>
    // Then: 説明文（lead）は翻訳キーごと削除され、残存しない
    assert.equal(blog.lead, undefined, `blog.lead が残存している（${locale}）`)
  })

  test(`translations[${locale}]: blog.channels ブロックが存在する`, () => {
    // Given/When/Then: 外部チャンネル導線の文言ブロックが定義されている
    assert.ok(
      translations[locale].blog.channels,
      `translations.${locale}.blog.channels が未定義`,
    )
  })

  for (const key of CHANNEL_KEYS) {
    test(`translations[${locale}]: blog.channels.${key} が非空文字列である`, () => {
      // Given: 当該ロケールの channels ブロック
      const value = translations[locale].blog.channels[key]
      // Then: 非空の文字列である（プレースホルダや欠落を許さない）
      assert.equal(typeof value, 'string')
      assert.ok(value.length > 0, `blog.channels.${key} が空文字（${locale}）`)
    })
  }
}

test('translations: blog.channels のキー集合が ja/en で一致する', () => {
  // Given: 両ロケールの channels ブロック
  const jaKeys = Object.keys(translations.ja.blog.channels).sort()
  const enKeys = Object.keys(translations.en.blog.channels).sort()
  // Then: キー集合が完全一致する（片側だけにキーがある状態を検出）
  assert.deepEqual(jaKeys, enKeys)
})

test('translations: 既存の blog.title / blog.all は維持される（回帰防止）', () => {
  // Given/When/Then: ハブ化の追加で既存キーを壊さない
  for (const locale of LOCALES) {
    assert.ok(
      translations[locale].blog.title.length > 0,
      `blog.title が空（${locale}）`,
    )
    assert.ok(
      translations[locale].blog.all.length > 0,
      `blog.all が空（${locale}）`,
    )
  }
})
