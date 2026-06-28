// Yomoyo 紹介・サポート用 LP（src/app/yomoyo/page.tsx）の表示契約を固定する単体テスト
// （Issue #198 / TDD 先行）。
//
// 計画（reports/plan.md）で確定した LP の振る舞いを検証する:
//   - Server Component を renderToStaticMarkup で例外なく描画できる
//   - metadata（title/description）を export する
//   - 概要 / スクショ / 問い合わせ / 規約・ポリシーリンクの 4 セクションを含む
//   - 内部リンク href は basePath 有無に依存しないよう部分一致で検証する
//   - スクショ <img> の src には手動 BASE_PATH（/my_site）を付与する（next/link と異なる契約）
//   - tailwind が未生成にする gray-<数値> を使わない（不可視化回帰の防止）
//
// 既存の BlogCard.test.tsx と同様、Node 組み込み node:test と
// react-dom/server の renderToStaticMarkup のみで構成する（新規パッケージ無し）。
// page は next/link に依存するため、resolve フックで素の <a> を返すモックへ
// 張り替えてから動的 import する（AppRouter コンテキスト外での描画を安定させる）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は page.tsx が未存在のため RED、実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// next/link は AppRouter コンテキストに依存するため、href と children のみを
// 反映する素の <a> へ差し替える。これにより内部リンクの href を SSR markup で検証できる。
// data: URL モジュールは bare specifier 'react' を解決できないため import せず、
// テストが設定する globalThis.React（classic JSX runtime 用）を参照する
// （BlogCard.test.tsx の navMock と同じ無 import パターン）。
const linkMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default function Link(props){return React.createElement('a', {href: props.href}, props.children)}",
  )

const resolveHook = `
export async function resolve(specifier, context, nextResolve) {
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

type YomoyoPageComponent = React.FC
let YomoyoPage: YomoyoPageComponent
let metadata: { title?: unknown; description?: unknown }

before(async () => {
  const mod = await import('./page')
  YomoyoPage = mod.default as unknown as YomoyoPageComponent
  metadata = mod.metadata as { title?: unknown; description?: unknown }
})

test('yomoyo/page: LP が例外なく描画される', () => {
  // Given/When/Then: Server Component の LP が SSR 描画で throw しない
  assert.doesNotThrow(() => renderToStaticMarkup(<YomoyoPage />))
})

test('yomoyo/page: metadata に title と description を設定する', () => {
  // Given: ランディング先として metadata を export する
  // When/Then: title は文字列で「Yomoyo」を含み、description は非空文字列
  assert.equal(typeof metadata.title, 'string')
  assert.match(metadata.title as string, /Yomoyo/)
  assert.equal(typeof metadata.description, 'string')
  assert.ok((metadata.description as string).length > 0)
})

test('yomoyo/page: 概要セクションでアプリ名「Yomoyo」を見出しに表示する', () => {
  // Given/When: LP を描画する
  const html = renderToStaticMarkup(<YomoyoPage />)
  // Then: アプリ名 Yomoyo が <h1> 見出しとして含まれる
  assert.match(html, /<h1[^>]*>[^<]*Yomoyo/)
})

test('yomoyo/page: 概要セクションで読書記録アプリである旨を説明する', () => {
  // Given/When: LP を描画する
  const html = renderToStaticMarkup(<YomoyoPage />)
  // Then: 事実ソース（terms/privacy）に基づき「読書記録」を含む
  assert.ok(html.includes('読書記録'))
})

test('yomoyo/page: スクショ <img> の src に手動 BASE_PATH(/my_site) を付与する', () => {
  // next/link は basePath を自動付与するが <img> は付与しないため、手動で
  // BASE_PATH を前置する必要がある（計画の重要な設計判断）。
  // Given/When: LP を描画する
  const html = renderToStaticMarkup(<YomoyoPage />)
  // Then: スクショ画像が basePath 配下の images/yomoyo を指す
  assert.match(html, /<img[^>]+src="\/my_site\/images\/yomoyo\//)
})

test('yomoyo/page: スクショ <img> に alt 属性を付与する', () => {
  // Given/When: LP を描画する
  const html = renderToStaticMarkup(<YomoyoPage />)
  // Then: 各スクショ画像に代替テキストが付く
  assert.match(html, /<img[^>]+alt="[^"]+"/)
})

test('yomoyo/page: 問い合わせセクションで mailto 連絡先を表示する', () => {
  // Given/When: LP を描画する
  const html = renderToStaticMarkup(<YomoyoPage />)
  // Then: 問い合わせ先メールへの mailto リンクを含む
  assert.ok(html.includes('mailto:furugenmotoshig@gmail.com'))
})

test('yomoyo/page: 問い合わせセクションで運営者 Furugen Island を表示する', () => {
  // Given/When: LP を描画する
  const html = renderToStaticMarkup(<YomoyoPage />)
  // Then: 運営者名を表示する
  assert.ok(html.includes('Furugen Island'))
})

test('yomoyo/page: 利用規約 /yomoyo/terms への内部リンクを表示する', () => {
  // basePath 付与の有無に依存しないよう href を部分一致で検証する。
  // Given/When: LP を描画する
  const html = renderToStaticMarkup(<YomoyoPage />)
  // Then: 利用規約ページへのリンクを含む
  assert.match(html, /href="[^"]*\/yomoyo\/terms"/)
})

test('yomoyo/page: プライバシーポリシー /yomoyo/privacy への内部リンクを表示する', () => {
  // Given/When: LP を描画する
  const html = renderToStaticMarkup(<YomoyoPage />)
  // Then: プライバシーポリシーページへのリンクを含む
  assert.match(html, /href="[^"]*\/yomoyo\/privacy"/)
})

test('yomoyo/page: 未生成の gray-<数値> ユーティリティを使わない', () => {
  // tailwind.config.ts が gray を単一文字列で上書きし gray-<数値> は CSS 未生成のため、
  // それらを使うと不可視化する。計画方針どおり gray-<数値> を含めないことを固定する。
  const html = renderToStaticMarkup(<YomoyoPage />)
  assert.doesNotMatch(html, /\bgray-\d/)
})
