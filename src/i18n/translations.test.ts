import assert from 'node:assert/strict'
import { test } from 'node:test'
import { translations } from './translations'
import type { Locale } from './types'

// error.tsx は t.errors.{title,message,retry} を参照し、ErrorView へ渡す。
// 型 Translations は ja/en 両方に同じ shape を要求するため、片側更新は型エラーになるが、
// 実行時に「両言語で同じキーが非空で揃っている」ことをここで明示的に固定する（片側更新の防止）。
const LOCALES: Locale[] = ['ja', 'en']
const ERROR_KEYS = ['title', 'message', 'retry'] as const

for (const locale of LOCALES) {
  test(`translations[${locale}]: errors ブロックが存在する`, () => {
    // Given: 当該ロケールの翻訳
    const t = translations[locale]
    // When/Then: errors ブロックが定義されている
    assert.ok(t.errors, `translations.${locale}.errors が未定義`)
  })

  for (const key of ERROR_KEYS) {
    test(`translations[${locale}]: errors.${key} が非空文字列`, () => {
      // Given: 当該ロケールの errors ブロック
      const value = translations[locale].errors[key]
      // Then: 非空の文字列である（プレースホルダや欠落を許さない）
      assert.equal(typeof value, 'string')
      assert.ok(value.length > 0, `errors.${key} が空文字`)
    })
  }
}

test('translations: errors のキー集合が ja/en で一致する', () => {
  // Given: 両ロケールの errors ブロック
  const jaKeys = Object.keys(translations.ja.errors).sort()
  const enKeys = Object.keys(translations.en.errors).sort()
  // Then: キー集合が完全一致する（片側だけにキーがある状態を検出）
  assert.deepEqual(jaKeys, enKeys)
})
