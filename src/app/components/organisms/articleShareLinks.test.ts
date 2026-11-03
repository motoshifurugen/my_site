// 記事末の共有欄（Issue #250 / TDD 先行）が使う共有リンクを組み立てる純粋関数の契約を固定する単体テスト。
//
// buildShareLinks({ title, url }) は X とはてなブックマークの共有 URL を返す:
//   - x:      https://x.com/intent/tweet?text={title}&url={url}
//   - hatena: https://b.hatena.ne.jp/add?mode=confirm&url={url}&title={title}
// title と url は encodeURIComponent で符号化する。タイトルに '&' や '=' があっても
// 別のパラメータとして読まれないことを、URL として読み戻して確かめる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は articleShareLinks.ts が無いため import エラーで RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildShareLinks } from './articleShareLinks'

const ARTICLE_URL = 'https://furugen-island.com/my_site/blog/create_my_site'
const SIMPLE_TITLE = 'Hello'

const endpointOf = (href: string): string => {
  const parsed = new URL(href)
  return `${parsed.origin}${parsed.pathname}`
}

const paramsOf = (href: string): URLSearchParams => new URL(href).searchParams

test('buildShareLinks: x と hatena の 2 つだけを返す', () => {
  // Given/When
  const links = buildShareLinks({ title: SIMPLE_TITLE, url: ARTICLE_URL })
  // Then
  assert.deepEqual(Object.keys(links).sort(), ['hatena', 'x'])
})

// --- X ---

test('buildShareLinks: x は X の投稿画面の URL を返す', () => {
  // Given/When
  const { x } = buildShareLinks({ title: SIMPLE_TITLE, url: ARTICLE_URL })
  // Then
  assert.equal(
    x,
    `https://x.com/intent/tweet?text=Hello&url=${encodeURIComponent(ARTICLE_URL)}`,
  )
})

test('buildShareLinks: x の text と url を読み戻すと渡した値になる', () => {
  // Given
  const title = 'Reactでポートフォリオサイトを作成する 🚀（1）'
  // When
  const params = paramsOf(buildShareLinks({ title, url: ARTICLE_URL }).x)
  // Then
  assert.equal(params.get('text'), title)
  assert.equal(params.get('url'), ARTICLE_URL)
})

test('buildShareLinks: x はタイトルの & や = を別のパラメータにしない', () => {
  // Given: パラメータを差し込もうとするタイトル
  const title = 'A & B&url=https://evil.example/'
  // When
  const { x } = buildShareLinks({ title, url: ARTICLE_URL })
  const params = paramsOf(x)
  // Then
  assert.equal(endpointOf(x), 'https://x.com/intent/tweet')
  assert.deepEqual([...params.keys()].sort(), ['text', 'url'])
  assert.equal(params.get('text'), title)
  assert.deepEqual(params.getAll('url'), [ARTICLE_URL])
})

// --- はてなブックマーク ---

test('buildShareLinks: hatena ははてなブックマークの追加画面の URL を返す', () => {
  // Given/When
  const { hatena } = buildShareLinks({ title: SIMPLE_TITLE, url: ARTICLE_URL })
  // Then
  assert.equal(
    hatena,
    `https://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(ARTICLE_URL)}&title=Hello`,
  )
})

test('buildShareLinks: hatena の url と title を読み戻すと渡した値になる', () => {
  // Given
  const title = '個人的な2024年の振り返りと2025年の抱負'
  // When
  const params = paramsOf(buildShareLinks({ title, url: ARTICLE_URL }).hatena)
  // Then
  assert.equal(params.get('mode'), 'confirm')
  assert.equal(params.get('url'), ARTICLE_URL)
  assert.equal(params.get('title'), title)
})

test('buildShareLinks: hatena はタイトルの & や = を別のパラメータにしない', () => {
  // Given
  const title = 'A & B&mode=x&url=https://evil.example/'
  // When
  const { hatena } = buildShareLinks({ title, url: ARTICLE_URL })
  const params = paramsOf(hatena)
  // Then
  assert.equal(endpointOf(hatena), 'https://b.hatena.ne.jp/add')
  assert.deepEqual([...params.keys()].sort(), ['mode', 'title', 'url'])
  assert.deepEqual(params.getAll('mode'), ['confirm'])
  assert.deepEqual(params.getAll('url'), [ARTICLE_URL])
  assert.equal(params.get('title'), title)
})

// --- 共通 ---

test('buildShareLinks: 記事 URL に ? や # があっても 1 つの値として渡す', () => {
  // Given
  const url = `${ARTICLE_URL}?ref=share#heading`
  // When
  const links = buildShareLinks({ title: SIMPLE_TITLE, url })
  // Then
  assert.equal(paramsOf(links.x).get('url'), url)
  assert.equal(paramsOf(links.hatena).get('url'), url)
  assert.equal(new URL(links.x).hash, '', 'x の URL に # の断片が出ない')
  assert.equal(
    new URL(links.hatena).hash,
    '',
    'hatena の URL に # の断片が出ない',
  )
})
