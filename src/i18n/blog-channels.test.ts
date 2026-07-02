// ブログのハブ化で追加する i18n キー（Issue #229 / TDD 先行）の契約を固定する単体テスト。
//
// #229 は次の 2 つを翻訳へ追加する（文言そのものはプロダクト側で自然に調整可）:
//   - t.blog.lead        : ブログの立ち位置を一言添える文（PageFace に配置）
//   - t.blog.channels    : { heading, zenn, note } の外部チャンネル導線の文言
// 型 Translations は ja/en 双方に同一 shape を要求するため片側更新は型エラーになるが、
// 本テストは「両ロケールでキーが揃い、値が非空文字列である」ことを実行時に明示的に固定する
// （片側更新・空プレースホルダの防止）。既存 translations.test.ts と同じ流儀で書く。
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
  test(`translations[${locale}]: blog.lead が非空文字列である`, () => {
    // Given: 当該ロケールの blog ブロック
    const lead = translations[locale].blog.lead
    // Then: 立ち位置の一文が非空の文字列で定義されている
    assert.equal(typeof lead, 'string')
    assert.ok(lead.length > 0, `blog.lead が空文字（${locale}）`)
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
