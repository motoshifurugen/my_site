// orange カラースケール新設（Issue #233 UI刷新 9 / TDD 先行）の契約を固定する単体テスト。
//
// News（お知らせ）の notification チップは、ライトモード・空色背景（sky-mobile）上で
// 半透明 bg-orange/10 が透けて文字コントラストが約 1.1:1 まで潰れていた。
// 修正は teal と同型に orange をスケール化し、不透明淡色地 orange-50 ＋濃色文字
// orange-800 でチップを塗る（DEFAULT は既存 bg-orange/text-orange のため維持）。
//
// 本テストは config が公開する「値」に対して契約を固定する:
//   - orange.DEFAULT を維持（別テスト tailwind.config.test.ts で検証）
//   - orange.50 / orange.800 が有効な hex で存在する
//   - orange.50（淡色地）と orange.800（濃色文字）の WCAG コントラスト比が
//     AA 基準 4.5:1 以上（= 完了条件「ライト空色背景で 4.5:1 以上」の本質）
// 具体的な淡色/濃色 hex は実装者の裁量に委ねるため、個別値ではなく
// 「存在」「明暗関係」「コントラスト比」で契約を固定する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は orange がスカラー値のため RED、実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import config from '../tailwind.config'

const extend = (config.theme as { extend?: Record<string, unknown> }).extend

const getOrange = (): Record<string, string> => {
  assert.ok(extend, 'theme.extend が定義されている')
  const colors = extend.colors as Record<string, unknown> | undefined
  assert.ok(colors, 'theme.extend.colors が定義されている')
  const orange = colors.orange as Record<string, string> | undefined
  assert.ok(orange, 'orange が定義されている')
  return orange
}

const isHex = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)

// --- WCAG 2.x コントラスト計算ヘルパ ---
// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
function channelLuminance(channel8bit: number): number {
  const c = channel8bit / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  )
}

function contrastRatio(hexA: string, hexB: string): number {
  const la = relativeLuminance(hexA)
  const lb = relativeLuminance(hexB)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

test('orange スケール: 不透明淡色地(50)と濃色文字(800)が hex で存在する', () => {
  // Given/When: スケール化された orange
  const orange = getOrange()
  // Then: notification チップの淡地(50)と濃文字(800)が有効な hex で存在する
  assert.ok(isHex(orange['50']), 'orange.50 が #RRGGBB 形式である')
  assert.ok(isHex(orange['800']), 'orange.800 が #RRGGBB 形式である')
})

test('orange: 淡色地(50)は濃色文字(800)より明るい', () => {
  // Given: 淡地×濃文字のバッジ配色
  const orange = getOrange()
  // When/Then: 50 の相対輝度が 800 より高い（淡地×濃文字の関係が成立）
  assert.ok(
    relativeLuminance(orange['50']) > relativeLuminance(orange['800']),
    'orange.50 は orange.800 より明るい',
  )
})

test('orange: 文字(800) on 地(50) の WCAG コントラスト比が AA 4.5:1 以上', () => {
  // Given: 不透明淡色地(50) ＋ 濃色文字(800) のチップ
  const orange = getOrange()
  // When: 800 と 50 のコントラスト比を求める
  const ratio = contrastRatio(orange['800'], orange['50'])
  // Then: WCAG AA（通常テキスト 4.5:1）を満たす（完了条件そのもの）
  assert.ok(
    ratio >= 4.5,
    `コントラスト比 ${ratio.toFixed(2)}:1 が AA 基準 4.5:1 以上である`,
  )
})
