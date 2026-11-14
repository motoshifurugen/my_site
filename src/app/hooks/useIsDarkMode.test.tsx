// <html> の dark クラスを読む hook useIsDarkMode（Issue #286）の単体テスト。
//
// DOM のテストライブラリが無いため、renderToStaticMarkup でサーバー側の値だけを確かめる。
// サーバー側の値を渡し忘れると、useSyncExternalStore はサーバー描画で例外を投げる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { useIsDarkMode } from './useIsDarkMode'

function ThemeProbe() {
  const isDarkMode = useIsDarkMode()
  return <p>{isDarkMode ? 'dark' : 'light'}</p>
}

test('useIsDarkMode: document が無いサーバーではライトモードとして描く', () => {
  // Given: サーバーには document が無い
  assert.equal('document' in globalThis, false)
  // When
  const html = renderToStaticMarkup(<ThemeProbe />)
  // Then
  assert.equal(html, '<p>light</p>')
})
