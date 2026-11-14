// ロケールの判定 isLocale と、それを使う getLocaleFromPath の単体テスト（Issue #286）。
//
// 「文字列が Locale か」の判定は isLocale の 1 か所に置く。保存済みの値（context.tsx）と
// URL パス（getLocaleFromPath）が同じ判定を使うことを、両方の入口から確かめる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { defaultLocale, getLocaleFromPath, isLocale, locales } from './config'

test('isLocale: locales に含まれる値はすべて true', () => {
  // Given/When
  const results = locales.map((locale) => isLocale(locale))
  // Then
  assert.deepEqual(
    results,
    locales.map(() => true),
  )
})

test('isLocale: locales に無い文字列・null・undefined は false', () => {
  // Given
  const invalidValues = ['fr', 'JA', '', null, undefined]
  // When
  const results = invalidValues.map((value) => isLocale(value))
  // Then
  assert.deepEqual(
    results,
    invalidValues.map(() => false),
  )
})

test('getLocaleFromPath: 先頭のセグメントが Locale ならそれを返す', () => {
  // Given/When
  const locale = getLocaleFromPath('/en/blog')
  // Then
  assert.equal(locale, 'en')
})

test('getLocaleFromPath: 先頭のセグメントが Locale でなければ defaultLocale を返す', () => {
  // Given/When
  const results = [getLocaleFromPath('/blog'), getLocaleFromPath('/')]
  // Then
  assert.deepEqual(results, [defaultLocale, defaultLocale])
})
