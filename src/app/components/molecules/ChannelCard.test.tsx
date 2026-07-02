// 発信チャンネルカード（molecule ChannelCard）の契約を固定する単体テスト
// （Issue #229 ブログのハブ化 / TDD 先行）。
//
// #229 はブログ index に Zenn / note への外部導線カードを常設する。ChannelCard は
// その 1 枚を描画する汎用 molecule で、props は次の shape を取る:
//   { href: string; icon: React.ReactNode; label: string }
// note には react-icons の該当アイコンが無いためテキスト "note" を、Zenn には <SiZenn/> を
// 呼び出し側が icon として渡す。したがって ChannelCard 自身はアイコン種別を知らず ReactNode で受ける。
//
// 観測可能な契約（本テストで固定するもの）:
//   - href を持つ <a> を 1 つ描画する
//   - 外部リンクとして target="_blank" rel="noopener noreferrer" を必ず付与する（完了条件・セキュリティ）
//   - 渡された label（一言）を描画する
//   - 渡された icon ノードを描画する
//   - ダーク対応（dark: プレフィックスの className を持つ）
//   - 記事一覧より主張しない＝ホバー浮き上がり（hover:-translate-y）を付けない（plan 明記）
//
// 既存 BlogCard.style.test.tsx / Footer.beach.test.tsx と同じく node:test と
// renderToStaticMarkup のみで構成し、CSS Module と next/link を resolve フックでモックする。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は ChannelCard 未作成のため import エラーで RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// 外部リンクは素の <a> が標準だが、実装が next/link を用いても href/target/rel が
// <a> へ写るようモックしておく（描画契約は実装手段に依存させない）。
const linkMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default function Link(props){return React.createElement('a',{href:props.href,className:props.className,target:props.target,rel:props.rel},props.children)}",
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
;(globalThis as Record<string, unknown>).React = React

interface ChannelCardProps {
  href: string
  icon: React.ReactNode
  label: string
}

let ChannelCard: React.FC<ChannelCardProps>
before(async () => {
  ChannelCard = (await import('./ChannelCard'))
    .default as unknown as React.FC<ChannelCardProps>
})

const HREF = 'https://example.com/channel'
const LABEL = 'テスト用の一言ラベル'
const ICON_MARK = 'ICON_MARK_TOKEN'

const icon = () => React.createElement('span', null, ICON_MARK)

const render = (props?: Partial<ChannelCardProps>): string =>
  renderToStaticMarkup(
    <ChannelCard href={HREF} icon={icon()} label={LABEL} {...props} />,
  )

// 指定 href を持つ <a> 開始タグ文字列を抽出する（属性をリンク単位で検証するため）
const anchorFor = (html: string, href: string): string | null => {
  const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = html.match(new RegExp(`<a[^>]*href="${escaped}"[^>]*>`))
  return match ? match[0] : null
}

test('ChannelCard: 例外なく描画される', () => {
  // Given/When/Then: props を渡して描画しても throw しない
  assert.doesNotThrow(() => render())
})

test('ChannelCard: href を持つ <a> を描画する', () => {
  // Given/When: カードを描画する
  const html = render()
  // Then: 渡した href の <a> が存在する
  assert.ok(anchorFor(html, HREF), '指定 href の <a> が存在する')
})

test('ChannelCard: 外部リンクとして target="_blank" を付与する', () => {
  // Given/When: カードを描画する
  const html = render()
  // Then: 新規タブで開く
  const anchor = anchorFor(html, HREF)
  assert.ok(anchor, 'リンクが存在する')
  assert.ok(anchor!.includes('target="_blank"'), 'target="_blank" を持つ')
})

test('ChannelCard: 外部リンクとして rel="noopener noreferrer" を付与する', () => {
  // Given/When: カードを描画する
  const html = render()
  // Then: セキュリティ上の rel が付与される（完了条件）
  const anchor = anchorFor(html, HREF)
  assert.ok(anchor, 'リンクが存在する')
  assert.ok(
    anchor!.includes('rel="noopener noreferrer"'),
    'rel="noopener noreferrer" を持つ',
  )
})

test('ChannelCard: 渡された label（一言）を描画する', () => {
  // Given/When: label を持つカードを描画する
  const html = render()
  // Then: ラベル文言が出力される
  assert.ok(html.includes(LABEL), 'label が描画される')
})

test('ChannelCard: 渡された icon ノードを描画する', () => {
  // Given/When: icon ノード（Zenn アイコンや "note" テキストに相当）を渡す
  const html = render()
  // Then: icon の内容が出力される（ReactNode をそのまま受けて描画する契約）
  assert.ok(html.includes(ICON_MARK), 'icon ノードが描画される')
})

test('ChannelCard: ダークモード対応の className を持つ', () => {
  // Given/When: カードを描画する
  const html = render()
  // Then: dark: プレフィックスの装飾がある（ライト/ダーク両対応の完了条件）
  assert.match(html, /dark:/, 'dark: プレフィックスの className を含む')
})

test('ChannelCard: 記事一覧より主張しないためホバー浮き上がりを付けない', () => {
  // Given/When: カードを描画する
  const html = render()
  // Then: BlogCard と異なり hover:-translate-y は付与しない（plan の控えめ装飾方針）
  assert.ok(
    !/hover:-translate-y-/.test(html),
    'hover:-translate-y- を含まない（控えめな装飾）',
  )
})
