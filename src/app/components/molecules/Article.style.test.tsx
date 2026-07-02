// Article（profile 専用 molecule）の説明文サイズ・行間統一の契約を固定する
// 単体テスト（Issue #242 UI刷新 12 / TDD 先行）。
//
// #242 は profile の4セクション（career/interest/passion/MBTI）の説明文サイズを
// 揃える。career/interest/MBTI は <p> で globals.css の p ルール
// （text-sm md:text-base leading-relaxed md:leading-loose）が適用済みだが、
// passion だけ <ul><li> のため p ルール非適用でブラウザ既定 1rem・レスポンシブなしに
// なっていた。globals.css へ li/ul の素タグルールを足すと blog 本文・TOC に回帰するため、
// profile 専用の Article content ラッパ（Article.tsx:23）へ p ルールと同値の
// text-sm md:text-base leading-relaxed md:leading-loose を付与し、ul/li に継承させる方針。
// 本テストはその content ラッパのサイズ・行間契約を固定する。
//
// 既存の WorkCard.style.test.tsx と同じく node:test と renderToStaticMarkup で構成し、
// next/image は共有シムへ、.css は空モジュールへ resolve フックで張り替える。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は content ラッパにサイズ・行間クラスが無いため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

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
;(globalThis as Record<string, unknown>).React = React

type ArticleProps = {
  title: string
  content: React.ReactNode
  imageSrc: string
  imageAlt: string
}
type ArticleComponent = React.FC<ArticleProps>

const baseProps: ArticleProps = {
  title: '好きなこと',
  content: (
    <ul>
      {['海', '写真'].map((v) => (
        <li key={v}>{v}</li>
      ))}
    </ul>
  ),
  imageSrc: '/images/profile/passion.png',
  imageAlt: 'passion',
}

let Article: ArticleComponent
before(async () => {
  Article = (await import('./Article')).default as unknown as ArticleComponent
})

// className 属性内で接頭辞なし（素の＝モバイル）ユーティリティとして出現するかを見る。
// `md:text-base` の中の `text-base` のような接頭辞付き一致を弾き、素の指定だけを検出する。
const hasBareClass = (html: string, cls: string): boolean =>
  new RegExp(`[\\s"']${cls.replace(/[-[\]]/g, '\\$&')}[\\s"']`).test(html)

test('Article: content ラッパのモバイル文字サイズを p ルールと同値の text-sm にする', () => {
  // Given/When: passion の ul/li を content に渡して Article を描画する
  const html = renderToStaticMarkup(<Article {...baseProps} />)
  // Then: content ラッパで素の text-sm（モバイル）を継承させる
  assert.ok(hasBareClass(html, 'text-sm'), '素の text-sm を含む')
})

test('Article: content ラッパのデスクトップ文字サイズを p ルールと同値の md:text-base にする', () => {
  // Given/When: Article を描画する
  const html = renderToStaticMarkup(<Article {...baseProps} />)
  // Then: md 以上で text-base へ揃える
  assert.ok(html.includes('md:text-base'), 'md:text-base を含む')
})

test('Article: content ラッパのモバイル行間を p ルールと同値の leading-relaxed にする', () => {
  // Given/When: Article を描画する
  const html = renderToStaticMarkup(<Article {...baseProps} />)
  // Then: content ラッパで素の leading-relaxed（モバイル）を継承させる
  assert.ok(
    hasBareClass(html, 'leading-relaxed'),
    '素の leading-relaxed を含む',
  )
})

test('Article: content ラッパのデスクトップ行間を p ルールと同値の md:leading-loose にする', () => {
  // Given/When: Article を描画する
  const html = renderToStaticMarkup(<Article {...baseProps} />)
  // Then: md 以上で leading-loose へ揃える
  assert.ok(html.includes('md:leading-loose'), 'md:leading-loose を含む')
})

test('Article: サイズ指定は arbitrary 値 text-[…] を使わずトークンに揃える', () => {
  // Given/When: Article を描画する
  const html = renderToStaticMarkup(<Article {...baseProps} />)
  // Then: p ルールと同じスケールトークンのみを使い arbitrary 値を残さない
  assert.ok(!html.includes('text-['), 'text-[ を含まない')
})
