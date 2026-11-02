// ProfileCard のプロフィール画像が高優先度で読み込まれることを固定する単体テスト
// （Issue #173 / TDD 先行）。
//
// プロフィール画像は /profile の LCP 候補なので、14 系では next/image の priority で
// fetchpriority="high" を出し、loading="lazy" を付けていなかった。Next 16 では priority が
// preload の別名になり fetchpriority="high" を出さなくなる。ProfileCard は preload と
// fetchPriority="high" を渡して 14 系と同じ出力を保つ。本テストはその出力を固定する。
//
// React 19 は属性名を fetchPriority のまま出し、preload の <link> にも同じ属性を付ける。
// だから検査は <img> タグの中だけで行い、属性名の大文字小文字は区別しない
// （WorkCard.test.tsx と同じ）。
//
// next/image は WorkCard.test.tsx と同じシムへ、next/link は素の <a> へ張り替える
// （yomoyo/page.test.tsx と同じ）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const shimUrl = new URL('../__testShims__/nextImage.mjs', import.meta.url).href
// data: URL モジュールは bare specifier 'react' を解決できないため、
// テストが設定する globalThis.React を参照する。
const linkMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default function Link(props){return React.createElement('a', {href: props.href}, props.children)}",
  )
const resolveHook = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css')) {
    return { url: 'data:text/javascript,export default {}', shortCircuit: true }
  }
  if (specifier === 'next/image' && !(context.parentURL || '').includes('__testShims__')) {
    return { url: ${JSON.stringify(shimUrl)}, shortCircuit: true }
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

// next/link の data: モックが React.createElement を呼ぶため React をグローバルに渡す。
;(globalThis as Record<string, unknown>).React = React

let ProfileCard: React.FC
let I18nProvider: React.FC<{ children: React.ReactNode }>
before(async () => {
  ProfileCard = (await import('./ProfileCard')).default as unknown as React.FC
  I18nProvider = (await import('../../../i18n/context'))
    .I18nProvider as unknown as React.FC<{ children: React.ReactNode }>
})

// preload の <link> に付く属性を数えないよう、描画結果から <img> タグだけを取り出す。
function renderProfileImg(): string {
  const html = renderToStaticMarkup(
    <I18nProvider>
      <ProfileCard />
    </I18nProvider>,
  )
  const tags = html.match(/<img\b[^>]*>/g)
  assert.ok(tags, '<img> を描画する')
  const profile = tags!.filter((tag) => tag.includes('alt="Profile"'))
  assert.equal(profile.length, 1, 'プロフィール画像を 1 枚だけ描画する')
  return profile[0]
}

test('ProfileCard: プロフィール画像の <img> に fetchpriority="high" を出力する', () => {
  // Given/When: ProfileCard を描画する
  const img = renderProfileImg()
  // Then: LCP 候補のプロフィール画像が高優先度で取得される
  assert.match(img, /fetchpriority="high"/i)
})

test('ProfileCard: プロフィール画像に loading="lazy" を付けない', () => {
  // Given/When: ProfileCard を描画する
  const img = renderProfileImg()
  // Then: preload と競合する遅延読み込みにしない
  assert.ok(!img.includes('loading="lazy"'))
})
