// I18nProvider のサーバー描画のロケールを固定する単体テスト（Issue #286）。
//
// #286 で、保存済みのロケールを effect で読む形から useLocalStorageValue に替える。
// サーバー描画（と hydration の初回描画）は、localStorage に何があっても
// initialLocale、無ければ defaultLocale で描く。ArticleShare などのテストは
// initialLocale="en" のサーバー描画を前提にしている。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { defaultLocale } from './config'
import { I18nProvider, useI18n } from './context'

function LocaleProbe() {
  const { locale } = useI18n()
  return <p>{locale}</p>
}

const stubStoredLocale = (stored: string): { restore: () => void } => {
  const items = new Map([['locale', stored]])
  const storage: Storage = {
    get length() {
      return items.size
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => {
      items.delete(key)
    },
    setItem: (key, value) => {
      items.set(key, String(value))
    },
  }
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
  })
  return {
    restore: () => {
      Reflect.deleteProperty(globalThis, 'localStorage')
    },
  }
}

test('I18nProvider: initialLocale が無ければ defaultLocale で描く', () => {
  // Given/When
  const html = renderToStaticMarkup(
    <I18nProvider>
      <LocaleProbe />
    </I18nProvider>,
  )
  // Then
  assert.equal(html, `<p>${defaultLocale}</p>`)
})

test('I18nProvider: 保存済みのロケールがあっても initialLocale で描く', () => {
  // Given: initialLocale と違うロケールが保存されている
  const { restore } = stubStoredLocale('ja')
  try {
    // When
    const html = renderToStaticMarkup(
      <I18nProvider initialLocale="en">
        <LocaleProbe />
      </I18nProvider>,
    )
    // Then
    assert.equal(html, '<p>en</p>')
  } finally {
    restore()
  }
})

test('I18nProvider: 保存済みのロケールがあっても initialLocale が無ければ defaultLocale で描く', () => {
  // Given: defaultLocale と違うロケールが保存されている
  const otherLocale = defaultLocale === 'ja' ? 'en' : 'ja'
  const { restore } = stubStoredLocale(otherLocale)
  try {
    // When
    const html = renderToStaticMarkup(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>,
    )
    // Then
    assert.equal(html, `<p>${defaultLocale}</p>`)
  } finally {
    restore()
  }
})
