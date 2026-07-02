// Header → 各ボタンへの stagger index 伝搬をロックするインテグレーションテスト
// （Issue #224 UI刷新 2/3 / TDD 先行）。
//
// #224 はヘッダーの nav 内ボタン（HeaderLinkButton × links / HeaderDropdownButton /
// GithubLinkButton）を左から順に段階表示する。特に GithubLinkButton は現状 index が
// 未配線で単独発火しているため、Header 側で index={links.length + 1} を渡すよう
// 配線を追加する必要がある。本テストは Header → GithubLinkButton までの index 伝搬
// （呼び出しチェーン末端の animation-delay 出力）を固定する。
//
// links は 4 件（profile / blog / skills / contact）。よって:
//   - HeaderLinkButton: index 0..3 → 0,80,160,240ms
//   - HeaderDropdownButton(遊び): index = links.length = 4 → 320ms
//   - GithubLinkButton(Repository): index = links.length + 1 = 5 → 400ms
//
// Header は next/navigation(usePathname) と next/link に依存するため resolve フックで
// モックへ張り替える。usePathname はトップページ相当の '/' を返す。
// ThemeSwitch / LanguageSwitcher（react-icons）や FontAwesome は SSR で問題なく描画される。
// renderToStaticMarkup は effect を実行しないため useEffect(scrollTo 等) は動かない。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は GithubLinkButton へ index 未配線のため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const linkMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default function Link(props){return React.createElement('a',{href:props.href,className:props.className,style:props.style,target:props.target,rel:props.rel},props.children)}",
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

// tsx は classic JSX runtime へ変換するため React をグローバルに渡す。
;(globalThis as Record<string, unknown>).React = React

let Header: React.FC
let I18nProvider: React.FC<{ children: React.ReactNode }>
before(async () => {
  Header = (await import('./Header')).default as unknown as React.FC
  I18nProvider = (await import('../../../i18n/context'))
    .I18nProvider as unknown as React.FC<{ children: React.ReactNode }>
})

const render = (): string =>
  renderToStaticMarkup(
    <I18nProvider>
      <Header />
    </I18nProvider>,
  )

test('Header: 例外なく描画される', () => {
  // Given/When/Then: stagger 配線後も SSR 描画で throw しない
  assert.doesNotThrow(() => render())
})

test('Header: 先頭リンクは遅延なし（0ms）で出現する', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: nav 先頭リンク（index=0）は遅延ゼロ
  assert.match(html, /animation-delay:0ms/, '先頭リンクが 0ms')
})

test('Header: ドロップダウンは links の直後（320ms）で出現する', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: index = links.length = 4 → 320ms
  assert.match(html, /animation-delay:320ms/, 'ドロップダウンが 320ms')
})

test('Header: GithubLinkButton へ index を伝搬し最後尾（400ms）で出現させる', () => {
  // GithubLinkButton は従来 index 未配線で単独発火していた。Header が
  // index={links.length + 1}=5 を渡すことで最後尾の遅延（400ms）が付く。
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: Repository リンク（GithubLinkButton）に 400ms の遅延が伝搬している
  assert.match(
    html,
    /<a[^>]*animation-delay:400ms[^>]*>[\s\S]*?Repository/,
    'Repository リンクに animation-delay:400ms が伝搬している',
  )
})
