// トップページの p5 背景がモバイルでメインスレッドを止めない配線を固定する静的検査テスト。
//
// 以前は BackgroundWrapper が SketchCloud と SketchNight を display:none の親の下で
// 常に 2 枚起動していた。p5 の draw ループは非表示の canvas でも回り、SketchCloud は
// 毎フレーム p5 の filter(BLUR) で全画面のピクセルを処理していた。モバイル Lighthouse の
// TBT が 170 秒になった原因はこの 2 点。
//
// p5 と next/dynamic は node test で描画できないので、SketchP5.wiring.test.ts と同じく
// ソースの静的検査で契約を固定する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), 'utf8')

const wrapper = read('./BackgroundWrapper.tsx')
const cloud = read('../atoms/SketchCloud.tsx')

test('BackgroundWrapper: p5 背景は PC 幅のときだけ起動する', () => {
  assert.ok(wrapper.includes("'(min-width: 768px)'"))
  assert.ok(wrapper.includes('window.matchMedia(DESKTOP_QUERY)'))
})

test('BackgroundWrapper: reduced-motion のときは p5 背景を起動しない', () => {
  assert.ok(wrapper.includes("'(prefers-reduced-motion: reduce)'"))
})

test('BackgroundWrapper: 昼と夜の背景を同時に起動しない', () => {
  // テーマに合う 1 枚だけを条件付きで描画する
  assert.match(wrapper, /desktopSketch === 'cloud' && <SketchCloud/)
  assert.match(wrapper, /desktopSketch === 'night' && <SketchNight/)
})

test('SketchCloud: 毎フレームの p.filter を使わず CSS の blur でぼかす', () => {
  assert.ok(!/p\.filter\(/.test(cloud), 'p.filter( を呼ばない')
  assert.match(cloud, /blur-\[\d+px\]/)
})
