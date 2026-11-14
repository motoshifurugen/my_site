// Yomoyo のアカウント削除ページ（Google Play が求める Web の削除窓口）の表示契約を固定する。
// page.test.tsx と同じく next/link を素の <a> に差し替え、I18nProvider 配下で描画する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nProvider } from '../../../i18n'

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
;(globalThis as Record<string, unknown>).React = React

let AccountDeletionPage: React.FC

before(async () => {
  const mod = await import('./page')
  AccountDeletionPage = mod.default as unknown as React.FC
})

function renderPage(): string {
  return renderToStaticMarkup(
    <I18nProvider>
      <AccountDeletionPage />
    </I18nProvider>,
  )
}

test('yomoyo/account-deletion: 見出しにアプリ名とページ名を出す', () => {
  const html = renderPage()
  assert.match(html, /<h1[^>]*>Yomoyo \| アカウント削除について<\/h1>/)
})

test('yomoyo/account-deletion: アプリ内の削除手順を出す', () => {
  const html = renderPage()
  assert.ok(html.includes('「アカウントを削除」をタップします。'))
})

test('yomoyo/account-deletion: 削除依頼の宛先は運営者の問い合わせ先にする', () => {
  const html = renderPage()
  assert.ok(html.includes('mailto:furugenmotoshig@gmail.com'))
  assert.ok(!html.includes('icloud.com'))
})

test('yomoyo/account-deletion: プライバシーポリシーへの内部リンクを出す', () => {
  const html = renderPage()
  assert.match(html, /href="[^"]*\/yomoyo\/privacy"/)
})

test('yomoyo/account-deletion: 未生成の gray-<数値> ユーティリティを使わない', () => {
  const html = renderPage()
  assert.doesNotMatch(html, /\bgray-\d/)
})
