// コピーライト名義変更（Issue #228 UI刷新 6 / TDD 先行）の契約を固定する単体テスト。
//
// #228 要件3 は Footer のコピーライトを「furugen」名義から「Furugen Island」名義へ変更し、
// 年は Footer 側で new Date().getFullYear() により自動更新する。したがって
// translations の copyright は年やコピーライト記号を含まず、名義文字列のみを持つ設計とする。
// 本テストは ja / en 両ロケールの copyright 値を固定し、旧表記「© 2024 furugen」の残存と
// 片側ロケール取り残しを防ぐ。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は旧値「© 2024 furugen」のため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { translations } from './translations'

test('ja: copyright が Furugen Island 名義である', () => {
  // Given/When/Then: ja ロケールの copyright
  assert.equal(translations.ja.footer.copyright, 'Furugen Island')
})

test('en: copyright が Furugen Island 名義である', () => {
  // Given/When/Then: en ロケールの copyright（片側取り残し防止）
  assert.equal(translations.en.footer.copyright, 'Furugen Island')
})

test('copyright: 旧名義 furugen（小文字）を含まない', () => {
  // Given/When/Then: 旧表記が両ロケールから除去されている
  for (const locale of ['ja', 'en'] as const) {
    assert.ok(
      !translations[locale].footer.copyright.includes('furugen'),
      `${locale}: 旧名義 furugen を含まない`,
    )
  }
})

test('copyright: 年をハードコードしない（2024 を含まない）', () => {
  // Given/When/Then: 年は Footer 側で動的生成するため文字列に含めない
  for (const locale of ['ja', 'en'] as const) {
    assert.ok(
      !translations[locale].footer.copyright.includes('2024'),
      `${locale}: 年 2024 をハードコードしない`,
    )
  }
})
