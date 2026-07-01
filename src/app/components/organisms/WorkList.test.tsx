// WorkList → WorkCard → next/image の priority 伝搬をロックするインテグレーションテスト
//（Issue #161 / TDD 先行）。
//
// #161 では LCP 候補=works グリッド先頭カードのみ priority を有効化する。WorkList は
// works.map((work, index) => <WorkCard priority={index === 0} .../>) で先頭のみ true を
// 配線する。本テストは「先頭カードだけ fetchpriority="high"、残りは loading="lazy"、
// 全カードに sizes」という呼び出しチェーン末端（next/image）までの伝搬を固定する。
//
// WorkList は useWorks()→useI18n() に依存するため I18nProvider でラップして描画する。
// renderToStaticMarkup は effect を実行しないため defaultLocale の翻訳で安定描画される。
// works.tsx は画像を文字列パスで参照し、バイナリ import が無いため node:test で解決できる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は WorkCard が priority/sizes を <Image> へ渡さないため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// node:test + tsx の interop 差異で `import Image from 'next/image'` が実コンポーネントへ
// 解決されないため、default を正規化するテスト専用シムへ張り替える（WorkCard.test.tsx と同様）。
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

const countOccurrences = (haystack: string, needle: string): number =>
  haystack.split(needle).length - 1

let WorkList: React.FC
let I18nProvider: React.FC<{ children: React.ReactNode }>
before(async () => {
  WorkList = (await import('./WorkList')).default as unknown as React.FC
  I18nProvider = (await import('../../../i18n/context'))
    .I18nProvider as unknown as React.FC<{ children: React.ReactNode }>
})

const renderList = (): string =>
  renderToStaticMarkup(
    <I18nProvider>
      <WorkList />
    </I18nProvider>,
  )

test('WorkList: 先頭カードのみ fetchpriority="high"（LCP を 1 枚に限定）', () => {
  // Given: works 一覧
  // When: WorkList を描画する
  const html = renderList()
  // Then: preload 競合を避けるため priority は先頭 1 枚のみ
  assert.equal(countOccurrences(html, 'fetchpriority="high"'), 1)
})

test('WorkList: 先頭以外のカードは loading="lazy"（複数枚が遅延読み込み）', () => {
  // Given: works は複数件存在する
  // When: WorkList を描画する
  const html = renderList()
  // Then: 先頭を除く全カードが遅延読み込みになる（2 枚以上）
  assert.ok(countOccurrences(html, 'loading="lazy"') >= 2)
})

test('WorkList: 全カードの <Image> に sizes を明示する', () => {
  // Given: works 一覧
  // When: WorkList を描画する
  const html = renderList()
  // Then: sizes 出力数は画像数（priority + lazy）と一致する
  const sizesCount = countOccurrences(
    html,
    'sizes="(min-width: 768px) 33vw, 100vw"',
  )
  const imageCount =
    countOccurrences(html, 'fetchpriority="high"') +
    countOccurrences(html, 'loading="lazy"')
  assert.ok(imageCount >= 2)
  assert.equal(sizesCount, imageCount)
})
