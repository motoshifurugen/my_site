// WorkCard の LCP 画像最適化属性の契約を固定する単体テスト（Issue #161 / TDD 先行）。
//
// #161 は静的エクスポート（GitHub Pages）制約下で works 一覧の画像最適化を行う変更。
// WorkCard の <Image> に次の 2 点を付与する:
//   - sizes="(min-width: 768px) 33vw, 100vw"（グリッド grid-cols-1 md:grid-cols-3 対応）
//   - priority prop（LCP 候補=先頭カードのみ true）。next/image は priority=true で
//     fetchpriority="high" を出力し loading="lazy" を付けない。priority 省略/false では
//     既定の loading="lazy" になる。
// 本テストはその出力契約（producer=WorkList / consumer=WorkCard→next/image）を固定する。
//
// 既存の BlogCard.test.tsx と同様に、Node 組み込み node:test と react-dom/server の
// renderToStaticMarkup のみで構成する（新規パッケージ無し）。属性の有無で検証し、
// src/srcSet の完全一致は検証しない（next/image の既定ローダ出力はテスト環境で不安定なため）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は sizes/priority を <Image> へ渡さないため sizes / fetchpriority のアサートは RED、
// 実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// node:test + tsx の ESM/CJS interop 差異で `import Image from 'next/image'` が実体の
// forwardRef コンポーネントではなく module.exports オブジェクトへ二重ラップされ、
// renderToStaticMarkup が "Element type is invalid" で失敗する。default を require で
// 正規化するテスト専用シムへ next/image を張り替える（webpack ビルドには影響しない）。
// あわせて .css は空モジュールへ落とす（将来の依存追加で壊れないため）。
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

// tsx は classic JSX runtime へ変換するため React をグローバルに渡す。
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

test('WorkCard: sizes 属性を明示する', () => {
  // Given: 通常の作品データ
  // When: WorkCard を描画する
  const html = renderToStaticMarkup(<WorkCard {...baseProps} />)
  // Then: グリッド構成に対応した sizes が <Image> に出力される
  assert.ok(html.includes('sizes="(min-width: 768px) 33vw, 100vw"'))
})

test('WorkCard: priority=true で fetchpriority="high" を出力する（LCP preload）', () => {
  // Given: LCP 候補として priority を有効化
  // When: WorkCard を描画する
  const html = renderToStaticMarkup(<WorkCard {...baseProps} priority={true} />)
  // Then: next/image が fetchpriority="high" を出力する
  assert.ok(html.includes('fetchpriority="high"'))
})

test('WorkCard: priority=true のとき loading="lazy" を付けない', () => {
  // Given: priority を有効化
  // When: WorkCard を描画する
  const html = renderToStaticMarkup(<WorkCard {...baseProps} priority={true} />)
  // Then: preload と競合する loading="lazy" は出力されない
  assert.ok(!html.includes('loading="lazy"'))
})

test('WorkCard: priority=false のとき loading="lazy" を出力する', () => {
  // Given: 非 LCP カードとして priority を無効化
  // When: WorkCard を描画する
  const html = renderToStaticMarkup(
    <WorkCard {...baseProps} priority={false} />,
  )
  // Then: next/image 既定の遅延読み込みになる
  assert.ok(html.includes('loading="lazy"'))
  assert.ok(!html.includes('fetchpriority="high"'))
})

test('WorkCard: priority 省略時は既定で遅延読み込み（lazy）になる', () => {
  // Given: priority を渡さない（既定値 false 相当）
  // When: WorkCard を描画する
  const html = renderToStaticMarkup(<WorkCard {...baseProps} />)
  // Then: loading="lazy" になり fetchpriority は付かない
  assert.ok(html.includes('loading="lazy"'))
  assert.ok(!html.includes('fetchpriority="high"'))
})

test('WorkCard: 作品情報（タイトル・説明・日付・タグ）を描画する', () => {
  // Given: 作品データ
  // When: WorkCard を描画する
  const html = renderToStaticMarkup(<WorkCard {...baseProps} />)
  // Then: 既存表示は priority 追加後も維持される
  assert.ok(html.includes('サンプル作品'))
  assert.ok(html.includes('作品の説明文'))
  assert.ok(html.includes('2022-12'))
  assert.ok(html.includes('Vue.js'))
  assert.ok(html.includes('Laravel'))
})
