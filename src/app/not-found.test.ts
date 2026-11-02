// 404 ページ（src/app/not-found.tsx）が Next 16 でプリレンダーできる形を固定する
// 静的検査テスト（Issue #173 / TDD 先行）。
//
// not-found.tsx は 'use client' のファイルなのに metadata を export している。Next 16 では
// これが原因で /_not-found のプリレンダーが `$$typeof` のエラーで止まり、ビルドが通らない。
// この metadata は 14 系でも効いていなかった（404 の <title> はサイト既定）ので消す。
// 'use client' は残す。外すと AnimatedLine の usePathname でビルドが落ちる。
//
// not-found.tsx は CSS を import するテンプレートを読み込むので node test から import できない。
// page.seo.test.ts と同じく、ソースの静的検査で契約を固定する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は metadata を export しているため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const source = readFileSync(new URL('./not-found.tsx', import.meta.url), 'utf8')

test('not-found: クライアントコンポーネントのまま保つ', () => {
  // Given/When: ファイル先頭のディレクティブ
  // Then: 'use client' が先頭にある
  assert.match(source, /^\s*['"]use client['"]/)
})

test('not-found: metadata を export しない', () => {
  // Given/When: ファイル全体
  // Then: クライアントコンポーネントから metadata を公開しない
  assert.doesNotMatch(source, /export\s+const\s+metadata\b/)
})

test('not-found: 使わなくなった Metadata 型を import しない', () => {
  // Given/When: next からの import
  // Then: metadata を消したあとに Metadata の import を残さない
  assert.doesNotMatch(
    source,
    /import\s*(type\s*)?\{[^}]*\bMetadata\b[^}]*\}\s*from\s*['"]next['"]/,
  )
})
