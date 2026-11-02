// WorkCard の LCP 画像最適化属性の契約を固定する単体テスト（Issue #161 / TDD 先行）。
//
// #161 は静的エクスポート（GitHub Pages）制約下で works 一覧の画像最適化を行う変更。
// WorkCard の <Image> に次の 2 点を付与する:
//   - sizes="(min-width: 768px) 33vw, 100vw"（グリッド grid-cols-1 md:grid-cols-3 対応）
//   - priority prop（LCP 候補=先頭カードのみ true）。WorkCard は priority=true のとき
//     next/image に preload と fetchPriority="high" を渡し、<img> に loading="lazy" を
//     付けない。priority 省略/false では既定の loading="lazy" になる。
// 本テストはその出力契約（producer=WorkList / consumer=WorkCard→next/image）を固定する。
//
// 既存の BlogCard.test.tsx と同様に、Node 組み込み node:test と react-dom/server の
// renderToStaticMarkup のみで構成する（新規パッケージ無し）。属性の有無で検証し、
// src/srcSet の完全一致は検証しない（next/image の既定ローダ出力はテスト環境で不安定なため）。
//
// Issue #173（Next 16 / React 19）での変化:
//   - Next 16 の next/image では priority が preload の別名になり、fetchpriority="high" を
//     出さない。WorkCard は preload と fetchPriority="high" を自分で渡して 14 系と同じ出力を保つ。
//   - React 19 は属性名を fetchPriority（大文字の P）のまま出し、preload の <link> にも
//     同じ属性を付ける。だから検査は <img> タグの中だけで行い、属性名の大文字小文字は区別しない。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

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

// preload の <link> に付く属性を数えないよう、描画結果から <img> タグだけを取り出す。
function renderedImg(html: string): string {
  const tags = html.match(/<img\b[^>]*>/g)
  assert.ok(tags, '<img> を描画する')
  assert.equal(tags!.length, 1, 'WorkCard は画像を 1 枚だけ描画する')
  return tags![0]
}

const FETCH_PRIORITY_HIGH = /fetchpriority="high"/i

let WorkCard: WorkCardComponent
before(async () => {
  WorkCard = (await import('./WorkCard'))
    .default as unknown as WorkCardComponent
})

test('WorkCard: sizes 属性を明示する', () => {
  // Given: 通常の作品データ
  // When: WorkCard を描画する
  const img = renderedImg(renderToStaticMarkup(<WorkCard {...baseProps} />))
  // Then: グリッド構成に対応した sizes が <img> に出力される
  assert.ok(img.includes('sizes="(min-width: 768px) 33vw, 100vw"'))
})

test('WorkCard: priority=true で <img> に fetchpriority="high" を出力する（LCP preload）', () => {
  // Given: LCP 候補として priority を有効化
  // When: WorkCard を描画する
  const img = renderedImg(
    renderToStaticMarkup(<WorkCard {...baseProps} priority={true} />),
  )
  // Then: <img> 自身が高優先度で取得される
  assert.match(img, FETCH_PRIORITY_HIGH)
})

test('WorkCard: priority=true のとき loading="lazy" を付けない', () => {
  // Given: priority を有効化
  // When: WorkCard を描画する
  const img = renderedImg(
    renderToStaticMarkup(<WorkCard {...baseProps} priority={true} />),
  )
  // Then: preload と競合する loading="lazy" は出力されない
  assert.ok(!img.includes('loading="lazy"'))
})

test('WorkCard: priority=false のとき loading="lazy" を出力する', () => {
  // Given: 非 LCP カードとして priority を無効化
  // When: WorkCard を描画する
  const img = renderedImg(
    renderToStaticMarkup(<WorkCard {...baseProps} priority={false} />),
  )
  // Then: next/image 既定の遅延読み込みになる
  assert.ok(img.includes('loading="lazy"'))
  assert.doesNotMatch(img, FETCH_PRIORITY_HIGH)
})

test('WorkCard: priority 省略時は既定で遅延読み込み（lazy）になる', () => {
  // Given: priority を渡さない（既定値 false 相当）
  // When: WorkCard を描画する
  const img = renderedImg(renderToStaticMarkup(<WorkCard {...baseProps} />))
  // Then: loading="lazy" になり fetchpriority は付かない
  assert.ok(img.includes('loading="lazy"'))
  assert.doesNotMatch(img, FETCH_PRIORITY_HIGH)
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
