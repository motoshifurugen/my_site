// 記事 URL をクリップボードにコピーするボタン（molecule CopyLinkButton / Issue #250 / TDD 先行）の
// 契約を固定する静的検査テスト。
//
// CopyLinkButton は記事末の共有欄（ArticleShare）の中で使う 'use client' コンポーネント。
// CopyButton.tsx と同じく useCopyToClipboard でコピーし、しばらく「コピーしました」を出す。
// ただしラベルは i18n（t.blog.share.copyLink / copied）から取り、日本語を直書きしない。
//
// 描画（ボタンが 1 つあり、初期表示がコピー前の文言であること）は ArticleShare.test.tsx で確かめる。
// クリック後の状態は renderToStaticMarkup では確かめられないので、ソースの静的検査で固定する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は CopyLinkButton.tsx が無いため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const readSource = (): string =>
  readFileSync(new URL('./CopyLinkButton.tsx', import.meta.url), 'utf8')

test("CopyLinkButton: state と clipboard を使うので 'use client' を付ける", () => {
  assert.match(readSource(), /^\s*['"]use client['"]/)
})

test('CopyLinkButton: コピーは CopyButton と同じ useCopyToClipboard に任せる', () => {
  // Given
  const source = readSource()
  // Then: コピー処理を写さず、フックを使う
  assert.ok(
    source.includes('useCopyToClipboard()'),
    'useCopyToClipboard を使う',
  )
  assert.ok(!source.includes('navigator.clipboard'), 'clipboard を直接呼ばない')
})

test('CopyLinkButton: ラベルは t.blog.share の copyLink / copied から取る', () => {
  // Given
  const source = readSource()
  // Then
  assert.ok(source.includes('useI18n'), 'useI18n を使う')
  assert.ok(source.includes('share.copyLink'), 'copyLink を使う')
  assert.ok(source.includes('share.copied'), 'copied を使う')
})

test('CopyLinkButton: 画面の文言（日本語）を直書きしない', () => {
  // Given: コメントを除いたソース
  const code = readSource()
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
  // Then: ひらがな・カタカナ・漢字を含まない
  assert.ok(!/[぀-ヿ一-鿿]/.test(code), '日本語の文言は translations.ts に置く')
})
