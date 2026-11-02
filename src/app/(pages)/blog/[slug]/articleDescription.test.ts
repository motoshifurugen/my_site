// 記事の meta description / og:description / twitter:description に使う要約文を
// 組み立てる buildArticleDescription の契約を固定する単体テスト。
//
// 背景: 本文（content）の先頭 50 文字をそのまま使うと、Markdown の見出し記号や
// 先頭の空行、埋め込み HTML タグがそのまま og:description 等に出てしまい、
// リンクシェア時のプレビューが壊れて見える。プレーンテキストに整えてから切り出す。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildArticleDescription, toPlainText } from './articleDescription'

test('buildArticleDescription: 先頭の空行と見出し記号を取り除く', () => {
  // Given: gray-matter が返す本文（frontmatter 直後の空行 + Markdown 見出し）
  const content = '\n\n## はじめに\n\n「自分にとって新しい技術を」'
  // When
  const description = buildArticleDescription(content)
  // Then
  assert.equal(description, 'はじめに 「自分にとって新しい技術を」')
})

test('buildArticleDescription: 埋め込み HTML タグを取り除く', () => {
  // Given: MDX に埋め込まれた img タグ
  const content = '<img src="https://example.com/a.jpg" alt="x" />\n本文です。'
  // When
  const description = buildArticleDescription(content)
  // Then
  assert.equal(description, '本文です。')
})

test('buildArticleDescription: 50 文字で切り出す', () => {
  // Given: 50 文字を超える本文
  const content = 'あ'.repeat(60)
  // When
  const description = buildArticleDescription(content)
  // Then
  assert.equal(description.length, 50)
})

test('buildArticleDescription: Markdown リンクはリンクテキストだけ残す', () => {
  // Given: リンク記法（URL をそのまま残すと地の文とくっついて読めなくなる）
  const content = '[リンクテキスト](https://example.com/path) の説明文です'
  // When
  const description = buildArticleDescription(content)
  // Then: URL は残さず、リンクテキストと地の文の間にスペースを保つ
  assert.equal(description, 'リンクテキスト の説明文です')
})

test('buildArticleDescription: ハイフンを含む単語をそのまま保つ', () => {
  // Given: ハイフン入りの技術用語
  const content = 'React-dom を使った開発について書きます'
  // When
  const description = buildArticleDescription(content)
  // Then: ハイフンを削って単語を融合させない
  assert.equal(description, 'React-dom を使った開発について書きます')
})

// --- toPlainText（Issue #7: 検索インデックスの excerpt と整形処理を共有する） ---
//
// toPlainText(content) は buildArticleDescription の整形処理だけを切り出したもの。
// 長さで切らない。buildArticleDescription は toPlainText(content).slice(0, 50) と同じ結果を返す。

test('toPlainText: 先頭の空行と見出し記号を取り除く', () => {
  // Given
  const content = '\n\n## はじめに\n\n「自分にとって新しい技術を」'
  // When
  const text = toPlainText(content)
  // Then
  assert.equal(text, 'はじめに 「自分にとって新しい技術を」')
})

test('toPlainText: 埋め込み HTML タグを取り除く', () => {
  // Given
  const content = '<img src="https://example.com/a.jpg" alt="x" />\n本文です。'
  // When/Then
  assert.equal(toPlainText(content), '本文です。')
})

test('toPlainText: Markdown リンクはリンクテキストだけ残す', () => {
  // Given
  const content = '[リンクテキスト](https://example.com/path) の説明文です'
  // When/Then
  assert.equal(toPlainText(content), 'リンクテキスト の説明文です')
})

test('toPlainText: 長さで切らない', () => {
  // Given: 50 文字を超える本文
  const content = 'あ'.repeat(300)
  // When
  const text = toPlainText(content)
  // Then
  assert.equal(text.length, 300)
})

test('toPlainText: 空の本文なら空文字を返す', () => {
  // Given/When/Then: 境界値
  assert.equal(toPlainText(''), '')
  assert.equal(toPlainText('\n\n  \n'), '')
})

test('buildArticleDescription: toPlainText の先頭 50 文字と同じ結果を返す', () => {
  // Given: 見出し・HTML・リンク・強調を含む 50 文字超の本文
  const content =
    '\n## 見出し\n<div>囲み</div>\n**強調**と[リンク](https://example.com)と`code`。' +
    'い'.repeat(80)
  // When
  const description = buildArticleDescription(content)
  // Then: 整形処理を 2 か所に持たない
  assert.equal(description, toPlainText(content).slice(0, 50))
})
