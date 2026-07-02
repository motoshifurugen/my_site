// Header（src/app/components/templates/Header.tsx）→ GithubLinkButton → next/link の
// onClick 伝搬（メニュー閉じ配線）を固定するインテグレーションテスト
// （Issue #240 UI刷新 10 / 3点セット / 要件5 / TDD 先行）。
//
// 背景（CEOレビュー 2026-07-02 #2）:
//   GitHub リンクは `target="_blank"` で pathname が変わらないため、タップしても
//   pathname-close effect が発火せずメニューが開いたまま残る。修正は Header が
//   GithubLinkButton へ onClick（`setMenuOpen(false)`）を渡し、GithubLinkButton が
//   それを <Link> へ配線して外部リンクタップ時もメニューを閉じること。
//   ＝ onClick が Header → GithubLinkButton → Link の3モジュールを末端まで伝搬する。
//
// renderToStaticMarkup は関数 prop を素の HTML へ出力しないため、Link モックが
// onClick の型（function/undefined）を data 属性へ写して伝搬を機械検証する。
// 実際に setMenuOpen(false) が走る挙動は effect 未実行のため範囲外（配線の存在で固定）。
// usePathname はトップページ相当の '/' を返す（初期 menuOpen=false のまま描画）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は Header が onClick を渡さない/GithubLinkButton が配線しないため RED、
// 実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// Link モックは href に加え onClick の型を data 属性へ写す。
const linkMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default function Link(props){return React.createElement('a',{href:props.href,className:props.className,style:props.style,target:props.target,rel:props.rel,'data-onclick':typeof props.onClick},props.children)}",
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

test('Header: GitHub リンクへ onClick（メニュー閉じ）を末端まで伝搬する', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: github.com の <a> が onClick 関数を受け取る（Header → GithubLinkButton → Link）
  assert.match(
    html,
    /<a\b[^>]*github\.com[^>]*data-onclick="function"/,
    'GitHub リンクの Link が onClick を function として受け取る',
  )
})

test('Header: onClick 配線は GitHub リンク限定（他メニュー項目には注入しない）', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: onClick を受け取る Link はちょうど1つ（＝GitHub のみ）。
  //       他項目は pathname-close effect で閉じるため onClick 注入は不要。
  const count = html.split('data-onclick="function"').length - 1
  assert.equal(count, 1, 'onClick を受け取る Link は GitHub の1つのみ')
})
