// tailwind.config.ts の future フラグ契約を固定する単体テスト
// （Issue #240 UI刷新 10 / 3点セット / 要件2 / TDD 先行）。
//
// 背景（CEOレビュー 2026-07-02 #2）:
//   スマホでメニュータップ後、次ページでもタップしたメニュー名の見た目が残る。
//   実体の一つは HeaderLinkButton の `hover:opacity-50` がタッチ端末の sticky hover で
//   タップ後も残ること。指示書の推奨手段は tailwind.config.ts へ
//   `future: { hoverOnlyWhenSupported: true }` を追加し、全 `hover:` を
//   `@media (hover: hover)` 化して hover 対応デバイス限定にすること。
//
// クラス名（HTML 文字列）は不変のため、契約は config が公開する「値」に対して固定する。
// CSS 生成結果（@media ラップ）は Tailwind のビルドを要し本テスト範囲外のため、
// フラグの真偽という single source of truth を検証する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は future キー未設定のため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import config from '../tailwind.config'

const future = (config as { future?: Record<string, unknown> }).future

test('tailwind config: future.hoverOnlyWhenSupported を有効化する', () => {
  // Given: config の future フラグ群
  assert.ok(future, 'config.future が定義されている')
  // When/Then: hover: が hover 対応デバイス限定になる
  assert.equal(
    future.hoverOnlyWhenSupported,
    true,
    'future.hoverOnlyWhenSupported === true',
  )
})

test('tailwind config: 既存の theme/darkMode 契約は壊さない（future 追加は非破壊）', () => {
  // Given/When: future 追加後の config
  // Then: 既存の darkMode='class' と theme.extend.colors は維持される
  assert.equal(config.darkMode, 'class', "darkMode は 'class' を維持する")
  const extend = (config.theme as { extend?: Record<string, unknown> }).extend
  assert.ok(extend, 'theme.extend が維持されている')
  assert.ok(extend.colors, 'theme.extend.colors が維持されている')
})
