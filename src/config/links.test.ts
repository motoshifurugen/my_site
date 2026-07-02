// 外部リンクURL集約モジュール（Issue #228 UI刷新 6 / TDD 先行）の契約を固定する単体テスト。
//
// #228 要件4 は Footer 内に散在していた GitHub / X の URL に加え、新規の Zenn / note を
// 1 箇所（src/config/links.ts）へ集約し、ブログページ側（別イシュー）からも参照可能な
// 名前付きエクスポートとして公開することを求める。本テストはその公開 API（externalLinks）
// が公開する「キー」と「URL 値」を固定し、Footer 側のハードコード回帰・URL 誤りを防ぐ。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は src/config/links.ts が未作成のため import エラーで RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { externalLinks } from './links'

test('externalLinks: github は本人の GitHub プロフィール URL である', () => {
  // Given/When/Then: 既存 Footer のハードコード URL を定数へ移設する
  assert.equal(externalLinks.github, 'https://github.com/motoshifurugen')
})

test('externalLinks: x は本人の X プロフィール URL である', () => {
  // Given/When/Then: 既存 Footer のハードコード URL を定数へ移設する
  assert.equal(externalLinks.x, 'https://x.com/cocoahearts21')
})

test('externalLinks: zenn は指定された Zenn プロフィール URL である', () => {
  // Given/When/Then: #228 で新規追加する SNS リンク
  assert.equal(externalLinks.zenn, 'https://zenn.dev/motoshifurugen')
})

test('externalLinks: note は指定された note プロフィール URL である', () => {
  // Given/When/Then: #228 で新規追加する SNS リンク
  assert.equal(externalLinks.note, 'https://note.com/cocoa_hearts21')
})

test('externalLinks: すべての値が https の外部 URL である', () => {
  // Given: 集約された全リンク
  const urls = Object.values(externalLinks)
  // When/Then: 外部リンクとして https から始まる（新規タブ・rel 付与の前提）
  assert.ok(urls.length >= 4, 'github/x/zenn/note の 4 つ以上を公開する')
  for (const url of urls) {
    assert.match(url, /^https:\/\//, `${url} が https 始まりである`)
  }
})
