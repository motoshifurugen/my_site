// Footer の細部刷新（絵文字国旗廃止・text-xxs → text-xs 可読性改善）の契約を
// 固定する単体テスト（Issue #225 UI刷新 3/3 / TDD 先行）。
//
// #225 はプラットフォームで表示が割れる絵文字国旗 🇯🇵 / 🇵🇭 を廃止し、都市区切りの
// faPlane アイコンのサイズを text-xxs → text-xs へ 1 段上げる。本テストは
// レンダリング結果の観測可能な契約（国旗絵文字が残っていない／Footer 内に text-xxs が
// 残っていない）を固定する。
//
// Footer は useI18n（@/i18n）に依存するため、既存 Header.stagger.test.tsx と同様に
// 実際の I18nProvider でラップする。renderToStaticMarkup は useEffect を実行しないため
// ロケールは defaultLocale（ja）のまま。next/link と、内部の AnimatedLine が使う
// next/navigation(usePathname) は resolve フックでモックへ張り替える。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は国旗絵文字・text-xxs のままのため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const linkMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default function Link(props){return React.createElement('a',{href:props.href,className:props.className,target:props.target,rel:props.rel},props.children)}",
  )

const navMock =
  'data:text/javascript,' +
  encodeURIComponent("export function usePathname(){return '/'}")

const resolveHook = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css')) {
    return { url: 'data:text/javascript,export default {}', shortCircuit: true }
  }
  if (specifier === 'next/link') {
    return { url: ${JSON.stringify(linkMock)}, shortCircuit: true }
  }
  if (specifier === 'next/navigation') {
    return { url: ${JSON.stringify(navMock)}, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}
`
register(
  'data:text/javascript,' + encodeURIComponent(resolveHook),
  import.meta.url,
)
;(globalThis as Record<string, unknown>).React = React

let Footer: React.FC
let I18nProvider: React.FC<{ children: React.ReactNode }>
before(async () => {
  Footer = (await import('./Footer')).default as unknown as React.FC
  I18nProvider = (await import('../../../i18n/context'))
    .I18nProvider as unknown as React.FC<{ children: React.ReactNode }>
})

const render = (): string =>
  renderToStaticMarkup(
    <I18nProvider>
      <Footer />
    </I18nProvider>,
  )

test('Footer: 例外なく描画される', () => {
  // Given/When/Then: 刷新後も SSR 描画で throw しない
  assert.doesNotThrow(() => render())
})

test('Footer: 日本国旗の絵文字 🇯🇵 を廃止する', () => {
  // Given/When: フッターを描画する
  const html = render()
  // Then: プラットフォーム依存の絵文字国旗が残っていない
  assert.ok(!html.includes('🇯🇵'), '🇯🇵 を含まない')
})

test('Footer: フィリピン国旗の絵文字 🇵🇭 を廃止する', () => {
  // Given/When: フッターを描画する
  const html = render()
  // Then: プラットフォーム依存の絵文字国旗が残っていない
  assert.ok(!html.includes('🇵🇭'), '🇵🇭 を含まない')
})

test('Footer: 極小フォント text-xxs を text-xs へ上げる', () => {
  // Given/When: フッターを描画する
  const html = render()
  // Then: 可読性改善のため text-xxs は残っていない
  assert.ok(!html.includes('text-xxs'), 'text-xxs を含まない')
})

test('Footer: 都市名（ja ロケール）が描画される', () => {
  // Given/When: defaultLocale(ja) でフッターを描画する
  const html = render()
  // Then: 都市の区切り表示は維持され、都市名が出力される
  assert.ok(html.includes('沖縄'), '沖縄 を含む')
  assert.ok(html.includes('バコロド'), 'バコロド を含む')
})
