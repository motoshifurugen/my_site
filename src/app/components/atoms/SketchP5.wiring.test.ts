// トップページの p5 背景（SketchCloud / SketchNight）が @p5-wrapper/react 5 系の
// コンポーネントを読み込む配線を固定する静的検査テスト（Issue #173 / TDD 先行）。
//
// @p5-wrapper/react 4 系は配布ファイルに React 18 の jsx-runtime を同梱しており、React 19 では
// トップページが `ReactCurrentOwner` のエラーで止まる。5 系に上げると、描画コンポーネントの
// 名前が ReactP5Wrapper から P5Canvas に変わる。どちらの背景も next/dynamic の
// ssr: false で P5Canvas を読み込み、JSX でも P5Canvas を描画する。
// p5 2 系では touches の型が object[] になるので、座標の取り出しは p5Pointer.ts の
// pointerPosition にまとめ、両方の背景がそれを使う。入力があるかの判定も pointerPosition
// だけが持ち、背景は戻り値が null かどうかで分岐する。
//
// どちらのファイルも p5 と next/dynamic に依存し、node test では描画できない。
// page.seo.test.ts と同じく、ソースの静的検査で契約を固定する。空白・改行は Prettier の
// 整形で変わりうるので、比較前に空白を取り除く。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は ReactP5Wrapper を読み込むため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

function stripWhitespace(source: string): string {
  return source.replace(/\s+/g, '')
}

const sketches = ['SketchCloud.tsx', 'SketchNight.tsx'].map((file) => ({
  file,
  source: readFileSync(new URL(`./${file}`, import.meta.url), 'utf8'),
}))

for (const { file, source } of sketches) {
  const compact = stripWhitespace(source)

  test(`${file}: @p5-wrapper/react から P5Canvas を動的に読み込む`, () => {
    // Given/When: next/dynamic に渡す読み込み関数
    // Then: 5 系の P5Canvas を取り出す
    assert.ok(
      compact.includes("import('@p5-wrapper/react').then((mod)=>mod.P5Canvas)"),
    )
  })

  test(`${file}: P5Canvas を SSR なしで読み込む`, () => {
    // Given/When: next/dynamic のオプション
    // Then: p5 は import 時にブラウザの API を参照するので、サーバーでは読み込まない
    assert.ok(compact.includes('ssr:false'))
  })

  test(`${file}: JSX で P5Canvas を描画する`, () => {
    // Given/When: コンポーネントの戻り値
    // Then: 動的に読み込んだ P5Canvas を描画する
    assert.match(source, /<P5Canvas\b/)
  })

  test(`${file}: 4 系の ReactP5Wrapper を参照しない`, () => {
    // Given/When: ファイル全体
    // Then: 5 系に無い名前を残さない
    assert.ok(!source.includes('ReactP5Wrapper'))
  })

  test(`${file}: クリック・タップ位置は p5Pointer の pointerPosition から得る`, () => {
    // Given/When: ファイル全体
    // Then: 共通の操作を使い、touches の型の補正を自前で持たない
    assert.ok(compact.includes("import{pointerPosition}from'./p5Pointer'"))
    assert.match(source, /pointerPosition\(p\)/)
    assert.ok(!source.includes('p.touches[0]'))
  })

  test(`${file}: 入力があるかの判定を pointerPosition に任せる`, () => {
    // Given/When: ファイル全体
    // Then: マウス・タッチの有無を自前で判定せず、pointerPosition の戻り値で分岐する
    assert.ok(!source.includes('p.touches'))
    assert.ok(!source.includes('p.mouseIsPressed'))
    assert.ok(compact.includes('constpointer=pointerPosition(p)if(pointer){'))
  })
}

test('p5 は Node では import できない（ssr: false が要る理由）', async () => {
  // Given/When: サーバーと同じ Node 環境で p5 を読み込む
  // Then: ブラウザの API を参照して失敗する。成功するようになったら ssr: false の理由を見直す
  await assert.rejects(import('p5'), /is not defined/)
})
