// WorkCard の角丸統一（rounded → rounded-lg）の契約を固定する単体テスト
// （Issue #223 UI刷新 1/3 / TDD 先行）。
//
// #223 はカード類の角丸を rounded-lg に統一する。WorkCard は影を持たず、
// また WorkList で <Link> に包まれない非リンクカードのため、hover 浮き上がりや
// shadow トークンは付与しない（角丸統一のみが対象）。本テストはその範囲を固定する。
//
// 既存の WorkCard.test.tsx と同じく、node:test と renderToStaticMarkup で構成し、
// next/image は共有シムへ、.css は空モジュールへ resolve フックで張り替える。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は bare `rounded` のままのため rounded-lg のアサートは RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const shimUrl = new URL('../__testShims__/nextImage.mjs', import.meta.url).href
const resolveHook = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css')) {
    return { url: 'data:text/javascript,export default {}', shortCircuit: true }
  }
  if (specifier === 'next/image' && !(context.parentURL || '').includes('__testShims__')) {
    return { url: ${JSON.stringify(shimUrl)}, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}
`
register(
  'data:text/javascript,' + encodeURIComponent(resolveHook),
  import.meta.url,
)
;(globalThis as Record<string, unknown>).React = React

type WorkCardProps = {
  src: string
  alt: string
  title: string | React.ReactElement
  description: string
  tags: string[]
  date: string
  priority?: boolean
}
type WorkCardComponent = React.FC<WorkCardProps>

const baseProps: WorkCardProps = {
  src: '/images/works/work_01.png',
  alt: 'work01',
  title: 'サンプル作品',
  description: '作品の説明文',
  tags: ['Vue.js', 'Laravel'],
  date: '2022-12',
}

let WorkCard: WorkCardComponent
before(async () => {
  WorkCard = (await import('./WorkCard'))
    .default as unknown as WorkCardComponent
})

test('WorkCard: 角丸を rounded-lg に統一する', () => {
  // Given/When: WorkCard を描画する
  const html = renderToStaticMarkup(<WorkCard {...baseProps} />)
  // Then: カードの角丸が rounded-lg に統一されている
  assert.ok(html.includes('rounded-lg'), 'rounded-lg を含む')
})

// --- Issue #226 UI刷新 4/4: カード内側 padding の下限（p-5〜p-6） ---
// 文字が枠に接近する窮屈な padding（p-3）を解消し、カード内側 padding は
// p-5（20px）〜p-6（24px）を下限目安とする（p-3 md:p-5 → p-5 md:p-6）。

// className 属性内で接頭辞なし（素の）ユーティリティとして出現するかを見る。
// `md:p-5` の中の `p-5` を素の `p-5` と誤認しないため、前後を空白/引用符に限定する。
const hasBareClass = (html: string, cls: string): boolean =>
  new RegExp(`[\\s"']${cls.replace(/-/g, '\\-')}[\\s"']`).test(html)

test('WorkCard: カード内側 padding の下限をモバイル p-5 に引き上げる', () => {
  // Given/When: WorkCard を描画する
  const html = renderToStaticMarkup(<WorkCard {...baseProps} />)
  // Then: モバイルでも素の p-5（20px）以上を確保する
  assert.ok(hasBareClass(html, 'p-5'), '素の p-5 を含む')
})

test('WorkCard: md 以上の padding を p-6 へ1段広げる', () => {
  // Given/When: WorkCard を描画する
  const html = renderToStaticMarkup(<WorkCard {...baseProps} />)
  // Then: md 以上で p-6（24px）まで広げてゆったり化する
  assert.ok(html.includes('md:p-6'), 'md:p-6 を含む')
})

test('WorkCard: 窮屈な padding p-3 を残さない', () => {
  // Given/When: WorkCard を描画する
  const html = renderToStaticMarkup(<WorkCard {...baseProps} />)
  // Then: 文字が枠に接近する p-3（12px）は使わない
  assert.ok(!html.includes('p-3'), 'p-3 を含まない')
})
