// eslint.config.mjs で一時的に warn へ下げたルールに、直す Issue の番号があることを固定する
// 静的検査テスト（Issue #173）。
//
// #173 で react-hooks v7 の新ルールを warn にしたとき、いつ戻すかを書いた Issue 番号が
// なかった。warn に下げたルールの直前のコメントに #番号 がなければ失敗させる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const lines = readFileSync(
  new URL('../eslint.config.mjs', import.meta.url),
  'utf8',
).split('\n')

const DOWNGRADED_RULE = /^\s*'react-hooks\/[\w-]+':\s*'warn',?\s*$/
const COMMENT = /^\s*\/\//

// 下げたルールの行から上へ、ルール行とコメント行が続く範囲のコメントを集める。
function commentAbove(index: number): string {
  const comments: string[] = []
  for (let i = index - 1; i >= 0; i--) {
    if (COMMENT.test(lines[i])) comments.push(lines[i])
    else if (!DOWNGRADED_RULE.test(lines[i])) break
  }
  return comments.join('\n')
}

const downgraded = lines
  .map((line, index) => ({ line, index }))
  .filter(({ line }) => DOWNGRADED_RULE.test(line))

test('eslint.config.mjs: react-hooks のルールを warn に下げている', () => {
  // Given/When: eslint.config.mjs の rules
  // Then: 検査する対象がある（無くなったらこのテストごと消す）
  assert.ok(downgraded.length > 0)
})

for (const { line, index } of downgraded) {
  test(`eslint.config.mjs: ${line.trim()} の理由に Issue 番号がある`, () => {
    // Given/When: warn に下げたルールの直前のコメント
    // Then: 直す作業の Issue 番号を書いている
    assert.match(commentAbove(index), /#\d+/)
  })
}
