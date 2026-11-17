// embedArticleUrls（EmbedArticle が /api/og-fetch の応答からリンク先・favicon・OG 画像の
// URL を決める関数）の単体テスト（Issue #375）。
// ogImage が空の配列でも例外を出さないことを、ここで固定する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  embedFaviconUrl,
  embedLinkUrl,
  embedOgImageUrl,
} from './embedArticleUrls'

test('embedLinkUrl: ogUrl があれば ogUrl を返す', () => {
  // Given
  const ogUrl = 'https://example.com/og'
  const requestUrl = 'https://example.com/request'
  // When
  const linkUrl = embedLinkUrl(ogUrl, requestUrl)
  // Then
  assert.equal(linkUrl, ogUrl)
})

test('embedLinkUrl: ogUrl が無ければ requestUrl を返す', () => {
  // Given
  const requestUrl = 'https://example.com/request'
  // When
  const linkUrl = embedLinkUrl(undefined, requestUrl)
  // Then
  assert.equal(linkUrl, requestUrl)
})

test('embedLinkUrl: ogUrl も requestUrl も無ければ undefined を返す', () => {
  // Given/When
  const linkUrl = embedLinkUrl(undefined, undefined)
  // Then
  assert.equal(linkUrl, undefined)
})

test('embedFaviconUrl: favicon が無ければ null を返す', () => {
  // Given/When
  const faviconUrl = embedFaviconUrl(undefined, 'https://example.com/a/b')
  // Then
  assert.equal(faviconUrl, null)
})

test('embedFaviconUrl: リンク先の URL が無ければ null を返す', () => {
  // Given/When
  const faviconUrl = embedFaviconUrl('/favicon.ico', undefined)
  // Then
  assert.equal(faviconUrl, null)
})

test('embedFaviconUrl: 相対パスの favicon をリンク先の URL から解決する', () => {
  // Given
  const favicon = '/favicon.ico'
  const linkUrl = 'https://example.com/a/b'
  // When
  const faviconUrl = embedFaviconUrl(favicon, linkUrl)
  // Then
  assert.equal(faviconUrl, 'https://example.com/favicon.ico')
})

test('embedFaviconUrl: リンク先が URL として読めなくても、favicon が絶対 URL ならそれを返す', () => {
  // Given
  const favicon = 'https://cdn.example.com/f.ico'
  const linkUrl = 'not a url'
  // When
  const faviconUrl = embedFaviconUrl(favicon, linkUrl)
  // Then
  assert.equal(faviconUrl, 'https://cdn.example.com/f.ico')
})

test('embedFaviconUrl: リンク先も favicon も URL として読めなければ null を返す', () => {
  // Given
  const favicon = '/favicon.ico'
  const linkUrl = 'not a url'
  // When
  const faviconUrl = embedFaviconUrl(favicon, linkUrl)
  // Then
  assert.equal(faviconUrl, null)
})

test('embedOgImageUrl: ogImage が { url } ならその url を返す', () => {
  // Given
  const ogImage = { url: 'https://example.com/og.png' }
  // When
  const ogImageUrl = embedOgImageUrl(ogImage)
  // Then
  assert.equal(ogImageUrl, 'https://example.com/og.png')
})

test('embedOgImageUrl: ogImage が配列なら先頭の要素の url を返す', () => {
  // Given
  const ogImage = [
    { url: 'https://example.com/first.png' },
    { url: 'https://example.com/second.png' },
  ]
  // When
  const ogImageUrl = embedOgImageUrl(ogImage)
  // Then
  assert.equal(ogImageUrl, 'https://example.com/first.png')
})

test('embedOgImageUrl: ogImage が空の配列なら例外を出さずに undefined を返す', () => {
  // Given: 先頭の要素が無いので、ogImage[0].url と読むと TypeError になる
  const ogImage: { url: string }[] = []
  // When
  const ogImageUrl = embedOgImageUrl(ogImage)
  // Then
  assert.equal(ogImageUrl, undefined)
})

test('embedOgImageUrl: ogImage が未指定なら undefined を返す', () => {
  // Given/When
  const ogImageUrl = embedOgImageUrl(undefined)
  // Then
  assert.equal(ogImageUrl, undefined)
})
