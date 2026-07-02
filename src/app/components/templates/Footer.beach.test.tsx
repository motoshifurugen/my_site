// フッター砂浜テーマ刷新（Issue #228 UI刷新 6 / TDD 先行）の契約を固定する単体テスト。
//
// #228 は Footer に以下を導入する:
//   - コピーライトを「© {年} Furugen Island」表示（年は new Date().getFullYear() で動的生成）
//   - SNS リンクに Zenn / note を追加（外部リンクは target="_blank" rel="noopener noreferrer"）
//   - フッター上端に飛び出すビーチ装飾（aria-hidden・クリック不可・ダーク非表示）
//   - モバイル固定高さ h-32 の解消（h-auto md:h-32 へ）
// 本テストはレンダリング結果（renderToStaticMarkup）の観測可能な契約を固定する。
//
// Footer は useI18n（@/i18n）に依存するため、既存 Footer.style.test.tsx と同様に実際の
// I18nProvider でラップする。renderToStaticMarkup は useEffect を実行しないためロケールは
// defaultLocale（ja）。next/link と、内部 AnimatedLine が使う next/navigation(usePathname) は
// resolve フックでモックへ張り替える。next/link モックは href/className/target/rel を <a> へ写す。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は旧コピーライト・Zenn/note 未追加・装飾未実装のため RED、実装後に GREEN。

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

// 指定 href を持つ <a> 開始タグ文字列を抽出する（属性の付与を個別リンク単位で検証するため）
const anchorFor = (html: string, href: string): string | null => {
  const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = html.match(new RegExp(`<a[^>]*href="${escaped}"[^>]*>`))
  return match ? match[0] : null
}

test('Footer: 例外なく描画される', () => {
  // Given/When/Then: 刷新後も SSR 描画で throw しない
  assert.doesNotThrow(() => render())
})

test('Footer: コピーライトが Furugen Island 名義で描画される', () => {
  // Given/When: フッターを描画する
  const html = render()
  // Then: 新名義が出力される
  assert.ok(html.includes('Furugen Island'), 'Furugen Island を含む')
})

test('Footer: コピーライトの年が new Date().getFullYear() で動的生成される', () => {
  // Given: 実行時の現在年
  const year = String(new Date().getFullYear())
  // When: フッターを描画する
  const html = render()
  // Then: 現在年が描画され、旧固定表記「© 2024 furugen」は残っていない
  assert.ok(html.includes(year), `現在年 ${year} を含む`)
  assert.ok(!html.includes('© 2024 furugen'), '旧コピーライト表記を含まない')
})

test('Footer: Zenn リンクが新規タブ属性付きで描画される', () => {
  // Given/When: フッターを描画する
  const html = render()
  // Then: 指定 URL の <a> に target/rel が付与されている
  const anchor = anchorFor(html, 'https://zenn.dev/motoshifurugen')
  assert.ok(anchor, 'Zenn リンクが存在する')
  assert.ok(anchor!.includes('target="_blank"'), 'target="_blank" を持つ')
  assert.ok(
    anchor!.includes('rel="noopener noreferrer"'),
    'rel="noopener noreferrer" を持つ',
  )
})

test('Footer: note リンクが新規タブ属性付きで描画される', () => {
  // Given/When: フッターを描画する
  const html = render()
  // Then: 指定 URL の <a> に target/rel が付与されている
  const anchor = anchorFor(html, 'https://note.com/cocoa_hearts21')
  assert.ok(anchor, 'note リンクが存在する')
  assert.ok(anchor!.includes('target="_blank"'), 'target="_blank" を持つ')
  assert.ok(
    anchor!.includes('rel="noopener noreferrer"'),
    'rel="noopener noreferrer" を持つ',
  )
})

test('Footer: 既存 GitHub / X リンクが維持される', () => {
  // Given/When: フッターを描画する
  const html = render()
  // Then: URL 定数化後も従来の 2 リンクが残る
  assert.ok(
    anchorFor(html, 'https://github.com/motoshifurugen'),
    'GitHub リンクが存在する',
  )
  assert.ok(
    anchorFor(html, 'https://x.com/cocoahearts21'),
    'X リンクが存在する',
  )
})

// NOTE: ビーチ装飾の aria-hidden / pointer-events-none / dark:hidden といった属性契約は
// BeachDecorations.test.tsx（コンポーネント単体）で固定する。Footer html には FontAwesome の
// faPlane が常に aria-hidden 付き svg を出力するため、Footer レベルで aria-hidden の有無を
// 見ても装飾の契約にはならない（既存アイコンで誤って pass する）ため、ここでは検査しない。

test('Footer: モバイル固定高さ h-32 単独を解消し h-auto を用いる', () => {
  // Given/When: フッターを描画する
  const html = render()
  // Then: モバイル縦積みであふれないよう h-auto を持つ
  assert.ok(html.includes('h-auto'), 'h-auto を含む')
})

test('Footer: ライトモードで砂浜背景トークン bg-sand を用いる', () => {
  // Given/When: フッターを描画する
  const html = render()
  // Then: light 背景が砂色トークン、dark は従来の night-black を維持する
  assert.ok(html.includes('bg-sand'), 'bg-sand を含む')
  assert.ok(
    html.includes('dark:bg-night-black'),
    'dark:bg-night-black を維持する',
  )
})

// family_tag: dry-violation の再発防止。SNS アイコンリンク（GitHub/X/Zenn）は共通の描画で
// target/rel を必ず付与する。個別コピペに戻すと属性の付け忘れが起こり得るため、全アイコン
// リンクが一様に外部リンク属性を持つことを固定し、DRY 逸脱の回帰を検知する。
test('Footer: SNS アイコンリンクは一様に target/rel を持つ', () => {
  // Given: 集約された SNS アイコンリンクの URL 群
  const iconHrefs = [
    'https://github.com/motoshifurugen',
    'https://x.com/cocoahearts21',
    'https://zenn.dev/motoshifurugen',
  ]
  // When: フッターを描画する
  const html = render()
  // Then: すべてのアイコンリンクが新規タブ属性を一様に備える
  for (const href of iconHrefs) {
    const anchor = anchorFor(html, href)
    assert.ok(anchor, `${href} のリンクが存在する`)
    assert.ok(
      anchor!.includes('target="_blank"'),
      `${href}: target="_blank" を持つ`,
    )
    assert.ok(
      anchor!.includes('rel="noopener noreferrer"'),
      `${href}: rel="noopener noreferrer" を持つ`,
    )
  }
})
