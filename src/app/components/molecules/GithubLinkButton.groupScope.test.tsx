// GitHub リンクボタン（src/app/components/molecules/GithubLinkButton.tsx）の
// group スコープ分離と onClick 配線契約を固定する単体テスト
// （Issue #240 UI刷新 10 / 3点セット / TDD 先行）。
//
// 背景（CEOレビュー 2026-07-02）:
//   1. 誤反転: 自 div の無名 `group` が Header.tsx の nav 無名 `group` と衝突し、
//      アイコン/ラベルの `group-hover:text-main-white dark:group-hover:text-main-black` が
//      nav 内どこかの hover で反転する。→ 自 div を名前付き `group/github` にし、
//      hover variant を `group-hover/github:` へスコープ分離する。
//      無名 `group-hover:text-main-white`(+dark) を残さないことが誤反転回帰防止の核心。
//   5. 外部リンク: `target="_blank"` で pathname 不変のため close effect が発火しない。
//      → onClick prop（`setMenuOpen(false)`）を <Link> へ配線し、タップでメニューを閉じる。
//
// renderToStaticMarkup は effect 未実行・関数 prop は素の HTML へ出力しないため、
// onClick の「実際にメニューを閉じる」挙動は検証不能。ここでは Link へ onClick 関数が
// 渡る配線契約を、Link モックが typeof を data 属性へ写して固定する（＝プロダクション側で
// <Link onClick={onClick}> と繋がっているかを機械検証する）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は無名 group のまま・onClick 未配線のため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// Link モックは className に加えて onClick の型（function/undefined）を data 属性へ写す。
// これにより「GithubLinkButton が <Link> へ onClick を渡しているか」を SSR HTML で判定できる。
const linkMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default function Link(props){return React.createElement('a',{href:props.href,className:props.className,style:props.style,target:props.target,rel:props.rel,'data-onclick':typeof props.onClick},props.children)}",
  )

const resolveHook = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css')) {
    return { url: 'data:text/javascript,export default {}', shortCircuit: true }
  }
  if (specifier === 'next/link') {
    return { url: ${JSON.stringify(linkMock)}, shortCircuit: true }
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

type GithubLinkButtonComponent = React.FC<{
  index: number
  onClick?: () => void
}>

let GithubLinkButton: GithubLinkButtonComponent
before(async () => {
  GithubLinkButton = (await import('./GithubLinkButton'))
    .default as unknown as GithubLinkButtonComponent
})

const render = (props: { index: number; onClick?: () => void }): string =>
  renderToStaticMarkup(<GithubLinkButton {...props} />)

// --- 要件1: group スコープ分離（誤反転の解消） ---

test('GithubLinkButton: 自ボタンを名前付き group/github にする（nav の無名 group と分離）', () => {
  // Given/When: 描画する
  const html = render({ index: 5 })
  // Then: 祖先 nav の無名 group と衝突しない専用スコープを持つ
  assert.ok(html.includes('group/github'), 'group/github を含む')
})

test('GithubLinkButton: アイコン/ラベルの hover 反転は group-hover/github: へスコープする（ライト）', () => {
  // Given/When: 描画する
  const html = render({ index: 5 })
  // Then: 自ボタン hover 時のみ白へ反転する
  assert.ok(
    html.includes('group-hover/github:text-main-white'),
    'group-hover/github:text-main-white を含む',
  )
})

test('GithubLinkButton: アイコン/ラベルの hover 反転は group-hover/github: へスコープする（ダーク）', () => {
  // Given/When: 描画する
  const html = render({ index: 5 })
  // Then: ダークでも自ボタン hover 限定でスコープする
  assert.ok(
    html.includes('dark:group-hover/github:text-main-black'),
    'dark:group-hover/github:text-main-black を含む',
  )
})

test('GithubLinkButton: 無名 group-hover: を残さない（他メニュー hover での誤反転を防ぐ）', () => {
  // Given/When: 描画する
  const html = render({ index: 5 })
  // Then: 祖先の任意 .group:hover にマッチする無名 group-hover: が存在しない
  //       （`group-hover/github:` は `group-hover:` を部分文字列に含まないため誤検知しない）
  assert.doesNotMatch(
    html,
    /group-hover:text-main-white/,
    '無名 group-hover:text-main-white を含まない',
  )
  assert.doesNotMatch(
    html,
    /group-hover:text-main-black/,
    '無名 group-hover:text-main-black を含まない',
  )
})

test('GithubLinkButton: 自ボタン hover の背景/文字反転（hover:bg-main-black 等）は維持する', () => {
  // Given/When: 描画する
  const html = render({ index: 5 })
  // Then: group スコープ分離後も、自ボタン hover の見た目は変えない
  assert.ok(html.includes('hover:bg-main-black'), 'hover:bg-main-black を含む')
  assert.ok(
    html.includes('dark:hover:bg-main-white'),
    'dark:hover:bg-main-white を含む',
  )
})

// --- 要件5: onClick 配線（GitHub タップでメニューを閉じる） ---

test('GithubLinkButton: onClick を渡すと <Link> へ関数として配線される', () => {
  // Given: メニューを閉じるコールバックを渡す
  // When: 描画する
  const html = render({ index: 5, onClick: () => {} })
  // Then: Link は onClick 関数を受け取る（外部リンクタップ時に setMenuOpen(false) を発火できる）
  assert.ok(
    html.includes('data-onclick="function"'),
    'Link へ onClick が function として渡る',
  )
})

test('GithubLinkButton: onClick は optional（未指定でも例外なく描画される）', () => {
  // Given/When/Then: 既存呼び出し（onClick なし）を後方非互換にしない
  assert.doesNotThrow(() => render({ index: 5 }))
  const html = render({ index: 5 })
  assert.ok(
    html.includes('data-onclick="undefined"'),
    'onClick 未指定時は Link へ関数が渡らない',
  )
})

test('GithubLinkButton: 外部リンク属性（target=_blank / rel）は維持する', () => {
  // Given/When: 描画する
  const html = render({ index: 5 })
  // Then: 別タブ遷移の契約は変えない（onClick 追加は close 用の副次配線）
  assert.match(html, /target="_blank"/, 'target="_blank" を維持する')
  assert.match(
    html,
    /rel="noopener noreferrer"/,
    'rel="noopener noreferrer" を維持する',
  )
})
