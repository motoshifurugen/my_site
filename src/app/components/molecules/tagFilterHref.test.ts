// tagFilterHref（タグで絞ったブログ一覧への URL）の単体テスト（Issue #7）。
// この URL を読むのは ArticleList の searchParams.get('tag') だけなので、書く側は
// tagFilterHref の 1 か所にまとめ、Tags と TagCountList で組み立て方がずれないようにする。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { tagFilterHref } from './tagFilterHref'

const SRC_DIR = fileURLToPath(new URL('../../../', import.meta.url))
const HREF_MODULE = join('app', 'components', 'molecules', 'tagFilterHref.ts')

test('tagFilterHref: タグを tag パラメータに入れた /blog の URL を返す', () => {
  // Given/When/Then
  assert.equal(tagFilterHref('React'), '/blog?tag=React')
})

test('tagFilterHref: URL で意味を持つ文字をエンコードする', () => {
  // Given: # と & と空白は、そのままだと別の意味に読まれる
  const tag = 'C# & .NET'
  // When
  const href = tagFilterHref(tag)
  // Then
  assert.equal(href, '/blog?tag=C%23%20%26%20.NET')
  assert.equal(
    new URL(href, 'https://example.com').searchParams.get('tag'),
    tag,
  )
})

test('tagFilterHref: ほかのソースは /blog?tag= を自分で組み立てない', () => {
  // Given: テストを除く src 以下の .ts / .tsx
  const sources = readdirSync(SRC_DIR, { recursive: true, encoding: 'utf8' })
    .filter((path) => /\.tsx?$/.test(path) && !/\.test\.tsx?$/.test(path))
    .filter((path) => path !== HREF_MODULE)
  // When
  const offenders = sources.filter((path) =>
    readFileSync(join(SRC_DIR, path), 'utf8').includes('/blog?tag='),
  )
  // Then
  assert.deepEqual(offenders, [])
})
