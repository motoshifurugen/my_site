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
// Issue #173（Next 16 / React 19）では React が属性名を fetchPriority のまま出し、
// preload の <link> にも同じ属性を付ける。だから <img> タグだけを数え、
// 属性名の大文字小文字は区別しない（WorkCard.test.tsx と同じ）。
//
// Issue #319 で実績を src/data/works.json に移した。JSON → useWorks → useI18n → WorkCard と
// 流れる文が、選んだ言語で描画されることもここで確かめる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import worksData from '../../../data/works.json'
import { translations } from '../../../i18n/translations'
import { Locale } from '../../../i18n/types'

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

// preload の <link> に付く属性を数えないよう、描画結果から <img> タグだけを取り出す。
function renderedImgs(html: string): string[] {
  const tags = html.match(/<img\b[^>]*>/g)
  assert.ok(tags, '<img> を描画する')
  return tags!
}

const FETCH_PRIORITY_HIGH = /fetchpriority="high"/i
const LAZY = 'loading="lazy"'
const SIZES = 'sizes="(min-width: 768px) 33vw, 100vw"'

let WorkList: React.FC
let I18nProvider: React.FC<{
  children: React.ReactNode
  initialLocale?: Locale
}>
before(async () => {
  WorkList = (await import('./WorkList')).default as unknown as React.FC
  I18nProvider = (await import('../../../i18n/context'))
    .I18nProvider as unknown as React.FC<{
    children: React.ReactNode
    initialLocale?: Locale
  }>
})

const renderList = (): string =>
  renderToStaticMarkup(
    <I18nProvider>
      <WorkList />
    </I18nProvider>,
  )

const renderListIn = (locale: Locale): string =>
  renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <WorkList />
    </I18nProvider>,
  )

const escapeText = (text: string): string => renderToStaticMarkup(<>{text}</>)

test('WorkList: 先頭カードのみ fetchpriority="high"（LCP を 1 枚に限定）', () => {
  // Given: works 一覧
  // When: WorkList を描画する
  const imgs = renderedImgs(renderList())
  // Then: preload 競合を避けるため priority は先頭 1 枚のみ
  const highIndexes = imgs
    .map((img, index) => (FETCH_PRIORITY_HIGH.test(img) ? index : -1))
    .filter((index) => index >= 0)
  assert.deepEqual(highIndexes, [0])
})

test('WorkList: 先頭以外のカードは loading="lazy"（複数枚が遅延読み込み）', () => {
  // Given: works は複数件存在する
  // When: WorkList を描画する
  const imgs = renderedImgs(renderList())
  // Then: 先頭を除く全カードが遅延読み込みになる（2 枚以上）
  const rest = imgs.slice(1)
  assert.ok(rest.length >= 2)
  assert.ok(rest.every((img) => img.includes(LAZY)))
  assert.ok(!imgs[0].includes(LAZY))
})

test('WorkList: 全カードの <img> に sizes を明示する', () => {
  // Given: works 一覧
  // When: WorkList を描画する
  const imgs = renderedImgs(renderList())
  // Then: どの画像にもグリッド構成に対応した sizes が付く
  assert.ok(imgs.length >= 2)
  assert.ok(imgs.every((img) => img.includes(SIZES)))
})

for (const locale of ['ja', 'en'] as const) {
  test(`WorkList: should render every works.json title and description in ${locale}`, () => {
    // Given: works.json の全件
    // When: locale を指定して WorkList を描画する
    const html = renderListIn(locale)
    // Then: 各実績のその言語のタイトルと説明が出る
    worksData.forEach((entry) => {
      assert.ok(
        html.includes(escapeText(entry.title[locale])),
        `${entry.id} の ${locale} のタイトルが出ること`,
      )
      assert.ok(
        html.includes(escapeText(entry.description[locale])),
        `${entry.id} の ${locale} の説明が出ること`,
      )
    })
  })

  test(`WorkList: should render translated tags instead of tag: references in ${locale}`, () => {
    // Given: 翻訳キーを指すタグ（tag:personalDevelopment など）を含む works.json
    const { personalDevelopment, teamDevelopment } =
      translations[locale].skills.tags
    // When: locale を指定して WorkList を描画する
    const html = renderListIn(locale)
    // Then: タグはその言語の翻訳で出て、tag: の書き方は画面に出ない
    assert.ok(html.includes(escapeText(personalDevelopment)))
    assert.ok(html.includes(escapeText(teamDevelopment)))
    assert.ok(!html.includes('tag:'))
  })
}

test('WorkList: should render one external link per works.json entry with url', () => {
  // Given: url を持つ実績
  const urls = worksData.flatMap((entry) =>
    'url' in entry && typeof entry.url === 'string' ? [entry.url] : [],
  )
  // When: WorkList を描画する
  const html = renderListIn('ja')
  // Then: 移す前と同じ属性の <a> が url の数だけ出て、href が url と一致する
  const hrefs = [
    ...html.matchAll(
      /<a href="([^"]+)" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1">/g,
    ),
  ].map((match) => match[1])
  assert.deepEqual(hrefs.sort(), [...urls].sort())
})
