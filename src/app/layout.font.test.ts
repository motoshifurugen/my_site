// フォント自己ホスト化（Google Fonts 非依存化）の契約を固定する単体テスト。
//
// 経緯:
//   - #223 で <link> 直書きを撤去し next/font/google へ一本化した
//   - その後、next/font/google がビルド/dev 時に Google Fonts へフェッチする性質により
//     ネットワークが遅い環境で大量の AbortError と起動遅延（コンパイル25秒超）が発生
//   - @fontsource-variable/* の自己ホストへ移行し、ビルド時のネットワーク依存を撤廃した
// 契約:
//   - layout.tsx は Google Fonts のホストにも next/font/google にも依存しない
//   - DM Sans / Noto Sans JP / Noto Serif JP を @fontsource-variable/* で読み込む
//   - globals.css が --font-dm-sans / --font-noto-sans-jp / --font-noto-serif-jp を
//     @fontsource の生成ファミリー名（'... Variable'）へ割り当てる
//
// レンダリングではなくソースの静的検査で契約を固定する（従来方針を踏襲）。
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const layout = readFileSync(new URL('./layout.tsx', import.meta.url), 'utf8')
const globals = readFileSync(new URL('./globals.css', import.meta.url), 'utf8')

test('layout: Google Fonts の <link>（fonts.googleapis.com）が消えている', () => {
  assert.ok(
    !layout.includes('fonts.googleapis.com'),
    'fonts.googleapis.com を含まない',
  )
})

test('layout: preconnect 先（fonts.gstatic.com）も消えている', () => {
  assert.ok(
    !layout.includes('fonts.gstatic.com'),
    'fonts.gstatic.com を含まない',
  )
})

test('layout: Inter を読み込まない', () => {
  assert.ok(!layout.includes('Inter'), 'Inter を含まない')
})

test('layout: next/font/google に依存しない（ビルド時フェッチの再混入防止）', () => {
  assert.ok(!layout.includes('next/font/google'), 'next/font/google を含まない')
})

test('layout: 3ファミリーを @fontsource-variable で自己ホストする', () => {
  assert.ok(
    layout.includes('@fontsource-variable/dm-sans'),
    'DM Sans を @fontsource で読み込む',
  )
  assert.ok(
    layout.includes('@fontsource-variable/noto-sans-jp'),
    'Noto Sans JP を @fontsource で読み込む',
  )
  assert.ok(
    layout.includes('@fontsource-variable/noto-serif-jp'),
    'Noto Serif JP を @fontsource で読み込む',
  )
})

test('globals.css: --font-* 変数を @fontsource の生成ファミリー名へ割り当てる', () => {
  assert.ok(
    globals.includes("--font-dm-sans: 'DM Sans Variable'"),
    '--font-dm-sans を定義する',
  )
  assert.ok(
    globals.includes("--font-noto-sans-jp: 'Noto Sans JP Variable'"),
    '--font-noto-sans-jp を定義する',
  )
  assert.ok(
    globals.includes("--font-noto-serif-jp: 'Noto Serif JP Variable'"),
    '--font-noto-serif-jp を定義する',
  )
})
