import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ErrorView from './ErrorView'

// 一部のコンポーネントは React を import せず automatic JSX runtime を前提にしている。
// tsx は JSX を classic な React.createElement に変換するため、グローバルに React を渡す。
const globalScope = globalThis as Record<string, unknown>
globalScope.React = React

// ErrorView は context 非依存（props のみ）で設計される。
// global-error.tsx は I18nProvider/ThemeProvider/Router context が存在しない crash path で使うため、
// Provider を一切ラップせずに SSR 描画できることが設計契約。
function renderErrorView(props: {
  title: string
  message: string
  retryLabel: string
}): string {
  return renderToStaticMarkup(
    <ErrorView
      title={props.title}
      message={props.message}
      retryLabel={props.retryLabel}
      onRetry={() => {}}
    />,
  )
}

test('ErrorView: title が描画される', () => {
  // Given: 表示用の文言
  // When: ErrorView を描画する
  const html = renderErrorView({
    title: 'エラーが発生しました',
    message: 'メッセージ本文',
    retryLabel: '再試行',
  })
  // Then: title 文言がマークアップに出力される
  assert.match(html, /エラーが発生しました/)
})

test('ErrorView: message が描画される', () => {
  // Given: 表示用の文言
  // When: ErrorView を描画する
  const html = renderErrorView({
    title: 'タイトル',
    message: 'ページの表示中に問題が発生しました。',
    retryLabel: '再試行',
  })
  // Then: message 文言がマークアップに出力される
  assert.match(html, /ページの表示中に問題が発生しました。/)
})

test('ErrorView: retryLabel が再試行ボタン内に描画される', () => {
  // Given: 再試行ボタンのラベル
  // When: ErrorView を描画する
  const html = renderErrorView({
    title: 'タイトル',
    message: 'メッセージ本文',
    retryLabel: 'もう一度試す',
  })
  // Then: <button> 要素が存在し、その内側にラベル文言がある
  assert.match(html, /<button[^>]*>[\s\S]*もう一度試す[\s\S]*<\/button>/)
})

test('ErrorView: Provider 無しでも例外を投げず描画できる（context 非依存契約）', () => {
  // Given: I18nProvider / ThemeProvider を一切ラップしない crash path 相当の環境
  // When/Then: useI18n 等の context 依存があれば "must be used within a Provider" で throw する。
  //            ErrorView が props のみで完結していれば例外なく描画できる。
  assert.doesNotThrow(() => {
    renderErrorView({
      title: 'タイトル',
      message: 'メッセージ本文',
      retryLabel: '再試行',
    })
  })
})

test('ErrorView: 既存の猫画像アセットを表示する', () => {
  // Given: 表示用の文言
  // When: ErrorView を描画する
  const html = renderErrorView({
    title: 'タイトル',
    message: 'メッセージ本文',
    retryLabel: '再試行',
  })
  // Then: public/images/cats 配下の既存アセットを参照する
  //       （next/image による URL エンコードや素の <img> 切替のどちらでもファイル名は残る）
  assert.match(html, /(page_not_found|coming_soon)\.png/)
})
