// Header（src/app/components/templates/Header.tsx）のモバイルメニュー刷新の
// 構造・open 状態配線を固定するインテグレーションテスト（Issue #227 UI刷新 5 / TDD 先行）。
//
// #227 はモバイルメニューを「不透明パネルへの全画面置換＋横スライド」から
// 「半透明＋backdrop-blur の背景＋opacity フェード」に刷新する。要件を SSR 静的 HTML で
// 検証可能なクラス/属性契約として固定する:
//   1. 背景の刷新: 専用 backdrop 子が backdrop-blur-md ＋半透明（bg-white/70・dark も）を持ち、
//      backdrop-filter 非対応向けに @supports フォールバック
//      （supports-[backdrop-filter]: 側で半透明、非対応時は不透明度を上げる）を持つ
//   2. 遷移統一: nav は transition-all / translate-x-full（横スライド）を使わず、opacity フェードへ
//   3. open 状態の配線: nav が group ＋ data-open 属性を持ち、閉時（初期状態）は data-open="false"。
//      各項目は group-data-[open=true]:opacity-100 で nav の open に反応する（横断データフロー）
//
// renderToStaticMarkup は effect 未実行・状態トグル不可のため、
// body スクロールロック等の副作用挙動は本テストの対象外（クラス/構造の存在で契約をロック）。
// usePathname はトップページ相当の '/' を返す（初期 menuOpen=false のまま描画）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は該当クラス/属性が無いため RED、実装後に GREEN を期待する。

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
  // Given/When/Then: メニュー刷新後も SSR 描画で throw しない
  assert.doesNotThrow(() => render())
})

// --- 1. 背景の刷新（半透明 + backdrop-blur + @supports フォールバック） ---

test('Header: 背景に backdrop-blur を用いる', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: 後ろが透けてぼける専用 backdrop を持つ
  assert.ok(html.includes('backdrop-blur-md'), 'backdrop-blur-md を含む')
})

// 注（Issue #240 UI刷新 10 / 要件4）: 背景をさらに透過させる。
// backdrop-filter 対応時: ライト bg-white/50・ダーク bg-night-black/50。
// 非対応フォールバック: ライト bg-white/60・ダーク bg-night-black/60（旧 /90・/70 から引き下げ）。
// backdrop-blur-md は維持し、可読性を確保する。

test('Header: backdrop-filter 対応時はライト背景がより透過する（bg-white/50）', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: @supports 側で半透明を強め後ろを透けさせる
  assert.ok(
    html.includes('supports-[backdrop-filter]:bg-white/50'),
    'supports-[backdrop-filter]:bg-white/50 を含む',
  )
})

test('Header: backdrop-filter 対応時はダーク背景がより透過する（dark:bg-night-black/50）', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: ダークでも @supports 側で半透明を強める
  assert.ok(
    html.includes('dark:supports-[backdrop-filter]:bg-night-black/50'),
    'dark:supports-[backdrop-filter]:bg-night-black/50 を含む',
  )
})

test('Header: backdrop-filter 非対応向けフォールバックもより透過する（ライト bg-white/60）', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: blur 非対応環境でも従来より透過（/90 → /60）しつつ可読性を確保する
  assert.ok(html.includes('bg-white/60'), 'bg-white/60 を含む')
})

test('Header: backdrop-filter 非対応向けフォールバックもより透過する（ダーク dark:bg-night-black/60）', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: ダークでも非対応フォールバックを透過（/90 → /60）させる
  assert.ok(
    html.includes('dark:bg-night-black/60'),
    'dark:bg-night-black/60 を含む',
  )
})

test('Header: 旧・重い背景不透明度（/90・/70）は残さない（透過アップの回帰防止）', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: 要件4「もっと透明に」を満たすため、旧値へは戻っていない
  assert.ok(!html.includes('bg-white/90'), 'bg-white/90 を含まない')
  assert.ok(
    !html.includes('dark:bg-night-black/90'),
    'dark:bg-night-black/90 を含まない',
  )
  assert.ok(
    !html.includes('supports-[backdrop-filter]:bg-white/70'),
    'supports-[backdrop-filter]:bg-white/70 を含まない',
  )
  assert.ok(
    !html.includes('dark:supports-[backdrop-filter]:bg-night-black/70'),
    'dark:supports-[backdrop-filter]:bg-night-black/70 を含まない',
  )
})

test('Header: backdrop-blur-md は維持する（透過を上げても文字可読性を確保）', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: blur は残す（要件4の「文字が読める範囲」担保）
  assert.ok(html.includes('backdrop-blur-md'), 'backdrop-blur-md を含む')
})

// --- 2. 遷移タイミングの統一（transition-all / 横スライドの廃止） ---

test('Header: 横スライド（translate-x-full）を使わない', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: スライドインは廃止され opacity フェードに統一される
  assert.ok(!html.includes('translate-x-full'), 'translate-x-full を含まない')
})

test('Header: transition-all を使わない（opacity フェードへ統一）', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: slide+背景色の一括遷移をやめ opacity 一本に統一する
  assert.ok(!html.includes('transition-all'), 'transition-all を含まない')
})

// 注: 開時の solid 全画面背景（bg-white dark:bg-night-black）の廃止は要件だが、
// SSR 静的 HTML は初期 menuOpen=false の閉状態のみを描画し open 分岐が出力されないため、
// 「solid を使わない」ことは静的マークアップでは判定できない。上記 backdrop 半透明契約と
// translate-x-full/transition-all の廃止で背景・遷移の刷新を担保する。

// --- 3. open 状態の配線（group + data-open → 各項目の group-data variant） ---

test('Header: nav が open 状態を子へ伝える group を持つ', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: 各項目が反応できるよう group クラスを持つ
  assert.match(html, /<nav[^>]*\bgroup\b/, 'nav に group クラスがある')
})

test('Header: nav が data-open 属性を持ち、初期（閉）は false', () => {
  // Given/When: 初期状態（menuOpen=false）で描画する
  const html = render()
  // Then: open 状態を data-open 属性で子へ公開し、初期は閉じている
  assert.match(
    html,
    /<nav[^>]*data-open="false"/,
    'nav に data-open="false" がある',
  )
})

test('Header: 各項目が nav の open に反応する（group-data-[open=true] を横断配線）', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: nav → 各項目まで open 状態が届き、開時に表示される
  assert.ok(
    html.includes('group-data-[open=true]:opacity-100'),
    'group-data-[open=true]:opacity-100 を含む',
  )
})

test('Header: 項目のフェードは reduced-motion で無効化される（motion-reduce:transition-none）', () => {
  // Given/When: ヘッダーを描画する
  const html = render()
  // Then: prefers-reduced-motion で即表示/即非表示
  assert.ok(
    html.includes('motion-reduce:transition-none'),
    'motion-reduce:transition-none を含む',
  )
})
