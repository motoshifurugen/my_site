// 記事ごとの OG 画像（Issue #250 / TDD 先行）の純粋関数の契約を固定する単体テスト。
//
// ogImage.ts は描画（next/og）を持たず、次の値と関数だけを置く:
//   - ARTICLE_OG_IMAGE_SIZE: 1200×630（X の summary_large_image と OGP の推奨サイズ）
//   - articleOgImagePath(slug): '/blog/{slug}/og.png'（metadataBase と連結される相対パス）
//   - toOgTitle(title): 絵文字を除き、連続する空白を 1 つに詰め、前後の空白を落とす。
//     絵文字を残すと next/og が twemoji を取りにネットへ出るため、画像には入れない
//   - ogTitleFontSize(title): 文字数（コードポイント数）で 88 / 76 / 64px を選ぶ。
//     16 字以下は 88px、28 字以下は 76px、それより長いと 64px
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は ogImage.ts が無いため import エラーで RED、実装後に GREEN。

import { getAllPostsMeta } from '@/app/api/utils/getPostData'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  ARTICLE_OG_IMAGE_SIZE,
  articleOgImagePath,
  ogTitleFontSize,
  toOgTitle,
} from './ogImage'

const PICTOGRAPHIC = /\p{Extended_Pictographic}/u

// --- ARTICLE_OG_IMAGE_SIZE ---

test('ARTICLE_OG_IMAGE_SIZE: 横長の 1200×630 である', () => {
  // Given/When/Then
  assert.deepEqual(ARTICLE_OG_IMAGE_SIZE, { width: 1200, height: 630 })
})

// --- articleOgImagePath ---

test('articleOgImagePath: /blog/{slug}/og.png を返す', () => {
  // Given/When
  const result = articleOgImagePath('create_my_site')
  // Then: 拡張子 .png を持つ（GitHub Pages が image/png で配信する）
  assert.equal(result, '/blog/create_my_site/og.png')
})

test('articleOgImagePath: slug ごとに別のパスになる', () => {
  // Given/When
  const first = articleOgImagePath('first_post')
  const second = articleOgImagePath('second-post')
  // Then
  assert.equal(first, '/blog/first_post/og.png')
  assert.equal(second, '/blog/second-post/og.png')
})

test('articleOgImagePath: basePath（/my_site）を含めない（metadataBase が付ける）', () => {
  // Given/When
  const result = articleOgImagePath('create_my_site')
  // Then
  assert.ok(!result.includes('/my_site'), `${result} は /my_site を含まない`)
  assert.ok(result.startsWith('/blog/'), `${result} は /blog/ で始まる`)
})

// --- toOgTitle ---

test('toOgTitle: 絵文字のないタイトルはそのまま返す', () => {
  // Given
  const title = 'forEach内でasync awaitはなぜ使えないのか'
  // When/Then
  assert.equal(toOgTitle(title), title)
})

test('toOgTitle: タイトルの途中の絵文字を除き、空白を 1 つに詰める', () => {
  // Given: 実在の記事タイトル（create_my_site.mdx）
  const title = 'Reactでポートフォリオサイトを作成する 🚀（1）'
  // When
  const result = toOgTitle(title)
  // Then
  assert.equal(result, 'Reactでポートフォリオサイトを作成する （1）')
})

test('toOgTitle: 先頭の絵文字を除いても、前に空白を残さない', () => {
  // Given/When/Then
  assert.equal(toOgTitle('🚀 Launch day'), 'Launch day')
})

test('toOgTitle: 末尾の絵文字を除いても、後ろに空白を残さない', () => {
  // Given/When/Then
  assert.equal(toOgTitle('リリースしました 🎉'), 'リリースしました')
})

test('toOgTitle: ZWJ でつないだ絵文字と異体字セレクタも残さない', () => {
  // Given: 👨‍💻（U+1F468 U+200D U+1F4BB）と ❤️（U+2764 U+FE0F）
  const title = '👨‍💻 エンジニアの ❤️ 話'
  // When
  const result = toOgTitle(title)
  // Then
  assert.equal(result, 'エンジニアの 話')
  assert.ok(!result.includes('\u200D'), 'ZWJ を残さない')
  assert.ok(!result.includes('\uFE0F'), '異体字セレクタを残さない')
})

test('toOgTitle: 数字・記号・全角括弧は絵文字として扱わない', () => {
  // Given: \p{Emoji} は 0-9 / # / * も含むので、それで消してしまわないことを確かめる
  const title = 'フィリピン留学メモ（1 / 16 weeks）#3 *注*'
  // When/Then
  assert.equal(toOgTitle(title), title)
})

test('toOgTitle: 連続する空白・タブを 1 つの空白に詰める', () => {
  // Given/When/Then
  assert.equal(toOgTitle('A  B\t\tC'), 'A B C')
})

test('toOgTitle: 前後の空白を落とす', () => {
  // Given/When/Then
  assert.equal(toOgTitle('  タイトル  '), 'タイトル')
})

test('toOgTitle: 公開記事のタイトルはどれも絵文字を残さず、空にならない', async () => {
  // Given: 実際に OG 画像を作る記事（generateStaticParams と同じ集合）
  const posts = await getAllPostsMeta()
  assert.ok(posts.length > 0, '公開記事がある')
  // When/Then
  for (const post of posts) {
    const result = toOgTitle(post.title)
    assert.ok(!PICTOGRAPHIC.test(result), `${post.slug}: ${result}`)
    assert.ok(result.length > 0, `${post.slug}: タイトルが空にならない`)
  }
})

// --- ogTitleFontSize ---

test('ogTitleFontSize: 16 字以下は 88px', () => {
  // Given/When/Then
  assert.equal(ogTitleFontSize('あ'), 88)
  assert.equal(ogTitleFontSize('あ'.repeat(16)), 88)
})

test('ogTitleFontSize: 17 字から 28 字までは 76px', () => {
  // Given/When/Then: 境界の 17 字と 28 字
  assert.equal(ogTitleFontSize('あ'.repeat(17)), 76)
  assert.equal(ogTitleFontSize('あ'.repeat(28)), 76)
})

test('ogTitleFontSize: 29 字以上は 64px', () => {
  // Given/When/Then: 境界の 29 字と、十分に長いタイトル
  assert.equal(ogTitleFontSize('あ'.repeat(29)), 64)
  assert.equal(ogTitleFontSize('あ'.repeat(80)), 64)
})

test('ogTitleFontSize: 文字数は UTF-16 の長さではなくコードポイントで数える', () => {
  // Given: '𠮷' はサロゲートペア（length 2）。16 字なら length は 32 になる
  const title = '𠮷'.repeat(16)
  assert.equal(title.length, 32)
  // When/Then: 16 字として扱い、88px を選ぶ
  assert.equal(ogTitleFontSize(title), 88)
})

test('ogTitleFontSize: 半角英数も 1 字として数える', () => {
  // Given/When/Then
  assert.equal(ogTitleFontSize('a'.repeat(16)), 88)
  assert.equal(ogTitleFontSize('a'.repeat(17)), 76)
})
