// フォント読み込み一本化（Issue #223 UI刷新 1/3 / TDD 先行）の契約を固定する単体テスト。
//
// #223 は next/font(Inter) と <link> 直書きの Google Fonts の二重ロードを解消し、
// next/font/google の DM Sans + Noto Sans JP へ一本化する:
//   - Inter を削除する
//   - Google Fonts の <link>（fonts.googleapis.com / fonts.gstatic.com）を全削除する
//   - next/font/google から DM_Sans / Noto_Sans_JP を読み込む
// 完了条件「layout.tsx から Google Fonts の <link> タグが消えている」を固定する。
//
// RootLayout を node で描画すると next/font/google の実行に失敗するため、
// レンダリングではなくソースの静的検査で契約を固定する（plan のテスト観点に従う）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は Inter / <link> が残っているため RED、実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const source = readFileSync(new URL('./layout.tsx', import.meta.url), 'utf8')

test('layout: Google Fonts の <link>（fonts.googleapis.com）が消えている', () => {
  // Given/When: layout.tsx のソース
  // Then: Google Fonts stylesheet のホストが残っていない
  assert.ok(
    !source.includes('fonts.googleapis.com'),
    'fonts.googleapis.com を含まない',
  )
})

test('layout: preconnect 先（fonts.gstatic.com）も消えている', () => {
  // Given/When: layout.tsx のソース
  // Then: Google Fonts の preconnect も残っていない
  assert.ok(
    !source.includes('fonts.gstatic.com'),
    'fonts.gstatic.com を含まない',
  )
})

test('layout: Inter を読み込まない（next/font から削除されている）', () => {
  // Given/When: layout.tsx のソース
  // Then: Inter への参照が残っていない
  assert.ok(!source.includes('Inter'), 'Inter を含まない')
})

test('layout: next/font/google に一本化されている', () => {
  // Given/When: layout.tsx のソース
  // Then: next/font/google を利用している
  assert.ok(
    source.includes('next/font/google'),
    'next/font/google を利用している',
  )
})

test('layout: DM Sans と Noto Sans JP を next/font で読み込む', () => {
  // Given/When: layout.tsx のソース
  // Then: DM_Sans / Noto_Sans_JP を import している
  assert.ok(source.includes('DM_Sans'), 'DM_Sans を読み込む')
  assert.ok(source.includes('Noto_Sans_JP'), 'Noto_Sans_JP を読み込む')
})
