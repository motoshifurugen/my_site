// ESLint の警告で lint を落とす設定と、ErrorView の no-img-element 警告を理由付きの
// disable で止めたことを固定するテスト（Issue #339）。
//
// CI は lint を実行しないので、`--max-warnings 0` の削除と、ErrorView の警告の再発を
// ここで止める。ErrorView は crash path で使うので、next/image に置き換えず素の <img>
// を使い続ける。ルールを設定で off にせず、その 1 行だけを理由付きで止める。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import { ESLint } from 'eslint'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

const ERROR_VIEW = 'src/app/components/templates/ErrorView.tsx'
const RULE = '@next/next/no-img-element'
const WARN = 1

const eslint = new ESLint({ cwd: ROOT })

const loadScripts = (): Record<string, unknown> => {
  const parsed: unknown = JSON.parse(
    readFileSync(join(ROOT, 'package.json'), 'utf8'),
  )
  assert.ok(
    typeof parsed === 'object' && parsed !== null && 'scripts' in parsed,
    'package.json に scripts があること',
  )
  const { scripts } = parsed
  assert.ok(typeof scripts === 'object' && scripts !== null)
  return scripts as Record<string, unknown>
}

const readErrorView = (): string => readFileSync(join(ROOT, ERROR_VIEW), 'utf8')

test('package.json: lint:eslint は警告が 1 件でもあれば失敗する', () => {
  // Given: package.json の scripts
  const scripts = loadScripts()
  // When
  const lintEslint = scripts['lint:eslint']
  // Then
  assert.equal(lintEslint, 'eslint . --max-warnings 0')
})

test('package.json: fix:eslint は lint:eslint に --fix を付けて呼ぶ', () => {
  // Given: package.json の scripts
  const scripts = loadScripts()
  // When
  const fixEslint = scripts['fix:eslint']
  // Then: --max-warnings 0 を lint:eslint から引き継ぐ
  assert.equal(fixEslint, 'npm run lint:eslint -- --fix')
})

test(`eslint: ${ERROR_VIEW} で ${RULE} が warn のまま有効`, async () => {
  // Given/When
  const config = await eslint.calculateConfigForFile(ERROR_VIEW)
  const entry = config.rules?.[RULE]
  const level = Array.isArray(entry) ? entry[0] : entry
  // Then: 設定で off にして警告を消していない
  assert.ok(level === 'warn' || level === WARN, `${RULE} が ${String(level)}`)
})

test(`eslint: disable が無い <img> は ${ERROR_VIEW} で指摘される`, async () => {
  // Given: ErrorView から disable の行だけを除いたコード
  const withoutDirective = readErrorView()
    .split('\n')
    .filter((line) => !line.includes(`eslint-disable-next-line ${RULE}`))
    .join('\n')
  // When
  const [result] = await eslint.lintText(withoutDirective, {
    filePath: ERROR_VIEW,
  })
  const reported = result.messages.filter((message) => message.ruleId === RULE)
  // Then: 警告が消えたのは disable の行のおかげで、<img> が無くなったからではない
  assert.equal(reported.length, 1)
})

test(`eslint: ${ERROR_VIEW} に警告もエラーも無い`, async () => {
  // Given/When
  const [result] = await eslint.lintFiles([ERROR_VIEW])
  const reported = result.messages.map(
    (message) => `${message.line}:${message.column} ${message.ruleId}`,
  )
  // Then: 使われない disable の警告も出ない
  assert.deepEqual(reported, [])
})

test(`${ERROR_VIEW}: <img> の直前の行で ${RULE} を理由付きで止める`, () => {
  // Given
  const lines = readErrorView().split('\n')
  // When
  const imgIndex = lines.findIndex((line) => line.trim() === '<img')
  assert.ok(imgIndex > 0, '<img の行が無い')
  const previous = lines[imgIndex - 1].trim()
  // Then: ルール名のあとに ` -- 理由` を同じ行で続ける
  assert.match(
    previous,
    new RegExp(`^\\{/\\* eslint-disable-next-line ${RULE} -- \\S.*\\*/\\}$`),
  )
})

test(`${ERROR_VIEW}: ファイル単位の eslint-disable を使わない`, () => {
  // Given
  const source = readErrorView()
  // When
  const fileWide = source.match(/eslint-disable(?!-next-line)/g) ?? []
  // Then
  assert.deepEqual(fileWide, [])
})
