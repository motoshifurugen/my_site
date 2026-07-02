// 発信チャンネル導線（organism ChannelLinks）の契約を固定する単体テスト
// （Issue #229 ブログのハブ化 / TDD 先行）。
//
// #229 はブログ index の記事一覧の上に「他の場所でも書いています」枠として
// Zenn / note の 2 カードを常設する。ChannelLinks は見出し＋2 カードを束ねる organism で、
// URL は src/config/links.ts の externalLinks を、文言は i18n（t.blog.channels）を参照する。
//
// 本テストは観測可能な描画契約を固定する:
//   - 例外なく描画される
//   - Zenn / note それぞれの externalLinks URL の <a> が存在し、target/rel を持つ
//   - 全チャンネルリンクが一様に外部リンク属性（target/rel）を持つ（DRY 逸脱の回帰検知）
//   - URL は externalLinks を出所とする（ハードコード回帰の防止）
//   - 見出し（t.blog.channels.heading の値）が描画される（文言の配線）
//   - ブログカードは Zenn / note のみで、GitHub / X などフッター専用リンクは含めない（スコープ固定）
//   - 記事一覧より主張しないためホバー浮き上がり（hover:-translate-y）を付けない
//
// 文言そのもの（プロダクト側で自然に調整可）は固定しない。翻訳キーの存在・非空は
// i18n 契約テスト（src/i18n/blog-channels.test.ts）で別途固定する。ここでは翻訳「値」が
// 実際に描画へ配線されていることのみ、translations から値を引いて確認する。
//
// Footer.beach.test.tsx と同じく I18nProvider でラップし（renderToStaticMarkup は useEffect を
// 実行しないためロケールは defaultLocale=ja）、next/link・next/navigation・.css を resolve フックで
// モックへ張り替える。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は ChannelLinks / t.blog.channels 未作成のため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { externalLinks } from '../../../config/links'
import { translations } from '../../../i18n/translations'

const linkMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default function Link(props){return React.createElement('a',{href:props.href,className:props.className,target:props.target,rel:props.rel},props.children)}",
  )

const navMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export function usePathname(){return '/'}\nexport function useRouter(){return {push(){},replace(){},prefetch(){},back(){},forward(){},refresh(){}}}\nexport function useSearchParams(){return {get(){return null}}}",
  )

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

let ChannelLinks: React.FC
let I18nProvider: React.FC<{ children: React.ReactNode }>
before(async () => {
  ChannelLinks = (await import('./ChannelLinks')).default as unknown as React.FC
  I18nProvider = (await import('../../../i18n/context'))
    .I18nProvider as unknown as React.FC<{ children: React.ReactNode }>
})

const render = (): string =>
  renderToStaticMarkup(
    <I18nProvider>
      <ChannelLinks />
    </I18nProvider>,
  )

// 指定 href を持つ <a> 開始タグ文字列を抽出する（属性をリンク単位で検証するため）
const anchorFor = (html: string, href: string): string | null => {
  const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = html.match(new RegExp(`<a[^>]*href="${escaped}"[^>]*>`))
  return match ? match[0] : null
}

test('ChannelLinks: 例外なく描画される', () => {
  // Given/When/Then: SSR 描画で throw しない
  assert.doesNotThrow(() => render())
})

test('ChannelLinks: Zenn カードが externalLinks の URL で新規タブ属性付きに描画される', () => {
  // Given/When: 導線を描画する
  const html = render()
  // Then: externalLinks.zenn の <a> が target/rel 付きで存在する
  const anchor = anchorFor(html, externalLinks.zenn)
  assert.ok(anchor, 'Zenn リンクが存在する')
  assert.ok(anchor!.includes('target="_blank"'), 'target="_blank" を持つ')
  assert.ok(
    anchor!.includes('rel="noopener noreferrer"'),
    'rel="noopener noreferrer" を持つ',
  )
})

test('ChannelLinks: note カードが externalLinks の URL で新規タブ属性付きに描画される', () => {
  // Given/When: 導線を描画する
  const html = render()
  // Then: externalLinks.note の <a> が target/rel 付きで存在する
  const anchor = anchorFor(html, externalLinks.note)
  assert.ok(anchor, 'note リンクが存在する')
  assert.ok(anchor!.includes('target="_blank"'), 'target="_blank" を持つ')
  assert.ok(
    anchor!.includes('rel="noopener noreferrer"'),
    'rel="noopener noreferrer" を持つ',
  )
})

test('ChannelLinks: 全チャンネルリンクが一様に target/rel を持つ（DRY 逸脱の回帰検知）', () => {
  // Given: 常設する 2 チャンネルの URL
  const hrefs = [externalLinks.zenn, externalLinks.note]
  // When: 導線を描画する
  const html = render()
  // Then: すべてのカードリンクが一様に外部リンク属性を備える
  for (const href of hrefs) {
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

test('ChannelLinks: 見出し文言（t.blog.channels.heading の値）が描画される', () => {
  // Given: 既定ロケール(ja)の見出し翻訳値
  const heading = translations.ja.blog.channels.heading
  // When: 導線を描画する
  const html = render()
  // Then: 翻訳値が実際に配線・描画されている（文言リテラルは固定しない）
  assert.ok(heading.length > 0, '見出し翻訳が非空である')
  assert.ok(html.includes(heading), '見出し翻訳値が描画される')
})

test('ChannelLinks: ブログカードは Zenn / note のみで GitHub / X を含めない（スコープ固定）', () => {
  // Given/When: 導線を描画する
  const html = render()
  // Then: フッター専用の GitHub / X はブログのチャンネルカードには出さない
  assert.ok(!anchorFor(html, externalLinks.github), 'GitHub リンクを含まない')
  assert.ok(!anchorFor(html, externalLinks.x), 'X リンクを含まない')
})

test('ChannelLinks: 記事一覧より主張しないためホバー浮き上がりを付けない', () => {
  // Given/When: 導線を描画する
  const html = render()
  // Then: BlogCard と異なり hover:-translate-y は使わない（plan の控えめ装飾方針）
  assert.ok(
    !/hover:-translate-y-/.test(html),
    'hover:-translate-y- を含まない（控えめな装飾）',
  )
})
