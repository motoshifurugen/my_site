// articleLikesStorage（localStorage の article_likes を読み書きする関数）の単体テスト（Issue #365）。
// LikeButton は読み込み・押したとき・失敗時の書き戻しの 3 か所で同じ読み書きをしていたので、
// 文字列を変換する部分だけを React に依存しない関数にまとめ、ここで振る舞いを固定する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  ARTICLE_LIKES_STORAGE_KEY,
  isArticleLiked,
  nextArticleLikes,
} from './articleLikesStorage'

const SRC_DIR = fileURLToPath(new URL('../../../', import.meta.url))
const STORAGE_MODULE = join(
  'app',
  'components',
  'molecules',
  'articleLikesStorage.ts',
)
const LIKE_BUTTON = join('app', 'components', 'molecules', 'LikeButton.tsx')

test('ARTICLE_LIKES_STORAGE_KEY: 保存するキーの名前は article_likes のまま', () => {
  // Given/When/Then
  assert.equal(ARTICLE_LIKES_STORAGE_KEY, 'article_likes')
})

test('isArticleLiked: 値が null のときはいいねしていない', () => {
  // Given: まだ何も保存していない
  const stored = null
  // When
  const liked = isArticleLiked(stored, 'a')
  // Then
  assert.equal(liked, false)
})

test('isArticleLiked: 空文字のときも null と同じくいいねしていない', () => {
  // Given/When/Then
  assert.equal(isArticleLiked('', 'a'), false)
})

test('isArticleLiked: 別の記事だけが入っているときはいいねしていない', () => {
  // Given
  const stored = '{"b":true}'
  // When
  const liked = isArticleLiked(stored, 'a')
  // Then
  assert.equal(liked, false)
})

test('isArticleLiked: 記事のキーが入っていればいいね済み', () => {
  // Given
  const stored = '{"b":true}'
  // When
  const liked = isArticleLiked(stored, 'b')
  // Then
  assert.equal(liked, true)
})

test('nextArticleLikes: null からいいねを足すとその記事だけが true で入る', () => {
  // Given
  const stored = null
  // When
  const next = nextArticleLikes(stored, 'a', true)
  // Then
  assert.equal(next, '{"a":true}')
})

test('nextArticleLikes: いいねを足しても別の記事のキーは残る', () => {
  // Given
  const stored = '{"b":true}'
  // When
  const next = nextArticleLikes(stored, 'a', true)
  // Then
  assert.deepEqual(JSON.parse(next), { b: true, a: true })
})

test('nextArticleLikes: 取り消すとその記事のキーを消す', () => {
  // Given
  const stored = '{"a":true}'
  // When
  const next = nextArticleLikes(stored, 'a', false)
  // Then
  assert.equal(next, '{}')
})

test('nextArticleLikes: 取り消しても別の記事のキーは残る', () => {
  // Given
  const stored = '{"a":true,"b":true}'
  // When
  const next = nextArticleLikes(stored, 'a', false)
  // Then
  assert.deepEqual(JSON.parse(next), { b: true })
})

test('nextArticleLikes: 入っていない記事を取り消しても中身は変わらない', () => {
  // Given
  const stored = '{"b":true}'
  // When
  const next = nextArticleLikes(stored, 'a', false)
  // Then
  assert.deepEqual(JSON.parse(next), { b: true })
})

test('nextArticleLikes: 返した文字列は isArticleLiked でそのまま読める', () => {
  // Given: いいねを足して、そのあと取り消す
  const liked = nextArticleLikes(null, 'a', true)
  const unliked = nextArticleLikes(liked, 'a', false)
  // When/Then
  assert.equal(isArticleLiked(liked, 'a'), true)
  assert.equal(isArticleLiked(unliked, 'a'), false)
})

test('isArticleLiked: JSON として読めない文字列では SyntaxError を投げる', () => {
  // Given/When/Then
  assert.throws(() => isArticleLiked('{not json', 'a'), SyntaxError)
})

test('nextArticleLikes: JSON として読めない文字列では SyntaxError を投げる', () => {
  // Given/When/Then
  assert.throws(() => nextArticleLikes('{not json', 'a', true), SyntaxError)
  assert.throws(() => nextArticleLikes('{not json', 'a', false), SyntaxError)
})

test('LikeButton: article_likes を自分で JSON.parse せず、切り出した関数を使う', () => {
  // Given
  const source = readFileSync(join(SRC_DIR, LIKE_BUTTON), 'utf8')
  // When/Then
  assert.equal(source.includes('JSON.parse'), false)
  assert.match(source, /from '\.\/articleLikesStorage'/)
  assert.match(source, /\bisArticleLiked\(/)
  assert.match(source, /\bnextArticleLikes\(/)
})

test('ほかのソースは article_likes のキー名を直接書かない', () => {
  // Given: テストを除く src 以下の .ts / .tsx
  const sources = readdirSync(SRC_DIR, { recursive: true, encoding: 'utf8' })
    .filter((path) => /\.tsx?$/.test(path) && !/\.test\.tsx?$/.test(path))
    .filter((path) => path !== STORAGE_MODULE)
  // When
  const offenders = sources.filter((path) =>
    readFileSync(join(SRC_DIR, path), 'utf8').includes('article_likes'),
  )
  // Then
  assert.deepEqual(offenders, [])
})
