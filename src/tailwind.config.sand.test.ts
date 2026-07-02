// 砂色トークン追加（Issue #228 UI刷新 6 / TDD 先行）の契約を固定する単体テスト。
//
// #228 要件1 はライトモードのフッター背景を「砂浜」にするため、tailwind.config.ts の
// theme.extend.colors に砂色トークン sand を追加する（Issue 提示例 #F3E9D2）。
// クラス名（bg-sand）を eslint-plugin-tailwindcss の no-custom-classname 検査でも通すには
// config への定義が前提となるため、本テストは config が公開する sand トークンの存在と
// 値の形式（#RRGGBB）を固定する。具体的な hex は Issue 上「例」であり実装者裁量のため
// 一致ではなく「有効な hex であること」を検証する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は sand 未定義のため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import config from '../tailwind.config'

const extend = (config.theme as { extend?: Record<string, unknown> }).extend

const isHex = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)

test('colors.sand: 砂色トークンが定義されている', () => {
  // Given: theme.extend.colors
  assert.ok(extend, 'theme.extend が定義されている')
  const colors = extend.colors as Record<string, unknown> | undefined
  assert.ok(colors, 'theme.extend.colors が定義されている')
  // When/Then: sand トークンが有効な #RRGGBB で存在する
  assert.ok(isHex(colors.sand), 'colors.sand が #RRGGBB 形式で定義されている')
})
