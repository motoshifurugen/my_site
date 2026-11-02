// テストの JSX 変換と globalThis.React の使い方を固定する静的検査テスト（Issue #173）。
//
// Next 16 の `next build` は tsconfig の jsx を react-jsx に書き換える。tsx もこの設定を読み、
// テストの JSX を react/jsx-runtime へ変換する。そのため JSX のために React をグローバルに
// 置く必要はない。globalThis.React が要るのは、resolve フックで差し替える data: モック
// （next/link など）が React.createElement を呼ぶテストだけになる。
//
// jsx の設定を変えたのにテストのコメントと代入が追従しないことが #173 で起きたので、
// 設定・コメント・代入の 3 つを合わせて検査する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const srcDir = fileURLToPath(new URL('.', import.meta.url))
const rootDir = join(srcDir, '..')

function listTestFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return listTestFiles(path)
    return /\.test\.tsx?$/.test(entry.name) ? [path] : []
  })
}

// このファイルは検出用の正規表現に同じ語を含むので、検査対象から外す。
const selfPath = fileURLToPath(import.meta.url)
const testFiles = listTestFiles(srcDir)
  .filter((path) => path !== selfPath)
  .map((path) => ({
    path: path.slice(rootDir.length + 1),
    source: readFileSync(path, 'utf8'),
  }))

const SETS_GLOBAL_REACT = /\.React\s*=\s*React\b/
const MOCK_CALLS_CREATE_ELEMENT =
  /data:text\/javascript[\s\S]*React\.createElement/
const CLASSIC_RUNTIME_NOTE =
  /classic JSX runtime|classic な React\.createElement/

test('tsconfig: jsx は react-jsx（automatic runtime）', () => {
  // Given/When: tsconfig.json の compilerOptions
  const tsconfig = JSON.parse(
    readFileSync(join(rootDir, 'tsconfig.json'), 'utf8'),
  ) as { compilerOptions: { jsx: string } }
  // Then: next build が書き換える値と同じ
  assert.equal(tsconfig.compilerOptions.jsx, 'react-jsx')
})

test('テストのコメントは classic JSX runtime を前提にしない', () => {
  // Given/When: src 配下のテストファイル
  const stale = testFiles
    .filter(({ source }) => CLASSIC_RUNTIME_NOTE.test(source))
    .map(({ path }) => path)
  // Then: jsx の設定と食い違うコメントがない
  assert.deepEqual(stale, [])
})

test('globalThis.React を置くテストは、それを呼ぶ data: モックを持つ', () => {
  // Given/When: React をグローバルに置くテストファイル
  const unused = testFiles
    .filter(
      ({ source }) =>
        SETS_GLOBAL_REACT.test(source) &&
        !MOCK_CALLS_CREATE_ELEMENT.test(source),
    )
    .map(({ path }) => path)
  // Then: 使われない代入がない
  assert.deepEqual(unused, [])
})
