// /api/og-fetch の応答の型 OpenGraphData の契約テスト。
// 以前は OpenGraphFetcher（渡す側）と EmbedArticle（受け取る側）が別々に
// `ogImage?: { url: string }` と宣言していて、実際の応答（配列）と食い違っていた。
// 型の宣言を src/types/openGraph.ts の 1 か所に固定し、open-graph-scraper の result を
// そのまま代入できること（npx tsc --noEmit で検査される）を確かめる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import { embedOgImageUrl } from '@/app/components/molecules/embedArticleUrls'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import type { OgObject } from 'open-graph-scraper/types'

import type { OpenGraphData } from './openGraph'

const SRC_DIR = fileURLToPath(new URL('..', import.meta.url))

// 名前の後ろが `=`・`{`・`<`・extends のものだけを宣言とみなす。
// `import { type OpenGraphData }` のような import を宣言と取り違えないため
const DECLARATION_PATTERN =
  /(?:interface|type)\s+OpenGraphData\s*(?:[={<]|extends\b)/

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return sourceFiles(path)
    }
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [path]
      : []
  })

test('OpenGraphData: open-graph-scraper の result をそのまま受け取れる', () => {
  // Given: route.tsx は ogs の result をそのまま返す。ogImage は配列
  const result: OgObject = {
    ogTitle: 'Example Title',
    ogImage: [{ url: 'https://example.com/og.png' }],
  }
  // When: 型が食い違うと、この代入が tsc で通らない
  const ogData: OpenGraphData = result
  // Then
  assert.equal(embedOgImageUrl(ogData.ogImage), 'https://example.com/og.png')
})

test('OpenGraphData: 型の宣言は src/types/openGraph.ts の 1 か所だけにある', () => {
  // Given/When
  const declaredIn = sourceFiles(SRC_DIR)
    .filter((path) => DECLARATION_PATTERN.test(readFileSync(path, 'utf8')))
    .map((path) => relative(SRC_DIR, path))
  // Then
  assert.deepEqual(declaredIn, ['types/openGraph.ts'])
})

test('OpenGraphData: 宣言の検出は、型を宣言する書き方だけに一致する', () => {
  // Given
  const declarations = [
    'type OpenGraphData = {',
    'export type OpenGraphData = {',
    'interface OpenGraphData {',
    'export interface OpenGraphData extends Base {',
  ]
  const imports = [
    "import type { OpenGraphData } from '@/types/openGraph'",
    "import type { OgImage, OpenGraphData } from '@/types/openGraph'",
    "import { type OpenGraphData } from '@/types/openGraph'",
    "import {\n  type OpenGraphData,\n} from '@/types/openGraph'",
  ]
  // When/Then
  for (const source of declarations) {
    assert.match(source, DECLARATION_PATTERN)
  }
  for (const source of imports) {
    assert.doesNotMatch(source, DECLARATION_PATTERN)
  }
})
