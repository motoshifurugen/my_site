// サイト共通メタ情報モジュール（Issue #19 SEO 改善 / TDD 先行）の契約を固定する単体テスト。
//
// src/config/site.ts は canonical・OG/Twitter メタ・robots.txt・BlogPosting JSON-LD が
// 共有するサイト URL、サイト名、著者名、OG 画像、OG の共通部分を 1 か所で持つ。
// SITE_URL は既存 sitemap.ts の baseUrl と同じ値で、末尾スラッシュを持たない
// （`${SITE_URL}/blog/${slug}` と連結しても二重スラッシュにならないようにする）。
// baseOpenGraph は title / description を持たない。持つと Next がページごとの値を
// 引き継がず、client ページも含めて全ページの og:title が同じ値に固定される。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は src/config/site.ts が無いため import エラーで RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'
import {
  AUTHOR_NAME,
  OG_IMAGE,
  SITE_URL,
  articleUrl,
  baseOpenGraph,
} from './site'

test('SITE_URL: 公開サイトの basePath 込みの URL である', () => {
  // Given/When/Then: GitHub Pages の公開先（basePath /my_site）を指す
  assert.equal(SITE_URL, 'https://furugen-island.com/my_site')
})

test('SITE_URL: 末尾スラッシュを持たない', () => {
  // Given/When: パスと連結する前提の基底 URL
  // Then: 連結時に二重スラッシュを作らない
  assert.ok(!SITE_URL.endsWith('/'), `${SITE_URL} は / で終わらない`)
})

test('AUTHOR_NAME: 著者名は古堅基史である', () => {
  assert.equal(AUTHOR_NAME, '古堅基史')
})

test('OG_IMAGE: トップの島画像（500×500）を basePath 相対で指す', () => {
  // Given/When/Then: metadataBase（SITE_URL）に連結される相対パスで持つ
  assert.deepEqual(OG_IMAGE, {
    url: '/images/island.png',
    width: 500,
    height: 500,
  })
})

test('OG_IMAGE: 参照先の画像が public/ に実在する', () => {
  // Given: OG_IMAGE.url は public/ 配下のパス
  const file = new URL(`../../public${OG_IMAGE.url}`, import.meta.url)
  // When/Then: 存在しない画像を og:image に出さない
  assert.ok(existsSync(file), `public${OG_IMAGE.url} が存在する`)
})

test('baseOpenGraph: ページごとに解決される url と、サイト共通の値だけを持つ', () => {
  // Given/When/Then:
  //   - url は './'（Next が表示中ページの pathname で解決する。絶対 URL だと全ページ同じになる）
  //   - title / description を持たない（ページの title / description を引き継がせる）
  assert.deepEqual(baseOpenGraph, {
    url: './',
    siteName: 'Furugen Island',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: '/images/island.png', width: 500, height: 500 }],
  })
})

// --- articleUrl（Issue #250）---
// 記事の正規 URL。BlogPosting の JSON-LD と記事末の共有欄が同じ値を使う。

test('articleUrl: 記事の slug から basePath 込みの絶対 URL を作る', () => {
  // Given/When/Then
  assert.equal(
    articleUrl('create_my_site'),
    'https://furugen-island.com/my_site/blog/create_my_site',
  )
})

test('articleUrl: SITE_URL と /blog/{slug} を二重スラッシュなしでつなぐ', () => {
  // Given/When
  const url = articleUrl('second-post')
  // Then
  assert.equal(url, `${SITE_URL}/blog/second-post`)
  assert.ok(!url.slice('https://'.length).includes('//'), `${url} に // がない`)
})
