// react-hooks v7 の 3 ルールを eslint-config-next の既定（error）に戻したことを固定する
// テスト（Issue #286）。
//
// #173 で 3 ルールを warn に下げ、既存コードの 17 か所を #286 で直した。CI は lint を
// 実行しないので、warn への逆戻りと、直した場所での再発をここで止める。
//
// tailwindcss の 2 ルールを warn から error に上げたことも固定する（Issue #328）。
//
// react-hooks/exhaustive-deps を warn から error に上げたことも固定する（Issue #331）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import { ESLint, type Linter } from 'eslint'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

const RULES = [
  'react-hooks/set-state-in-effect',
  'react-hooks/immutability',
  'react-hooks/set-state-in-render',
] as const

type Rule = (typeof RULES)[number]

// RULES と分けるのは、RULES を「設定で上書きしない」前提のテストが使っているため。
// この 2 ルールは eslint.config.mjs で error に上書きする。
const TAILWIND_RULES = [
  'tailwindcss/classnames-order',
  'tailwindcss/enforces-shorthand',
] as const

type TailwindRule = (typeof TAILWIND_RULES)[number]

// RULES と分けるのは、RULES を「設定で上書きしない」前提のテストが使っているため。
// このルールは eslint.config.mjs で error に上書きする。
const HOOKS_ERROR_RULES = ['react-hooks/exhaustive-deps'] as const

type HooksErrorRule = (typeof HOOKS_ERROR_RULES)[number]

const ERROR = 2

// #286 で直したファイルと、直すために足した共有 hook。
const FIXED_FILES = [
  'src/app/(pages)/_tanka/page.tsx',
  'src/app/(pages)/rpg/components/ChapterPlayer.tsx',
  'src/app/components/atoms/ParticlesBackground.tsx',
  'src/app/components/atoms/SketchCloud.tsx',
  'src/app/components/atoms/SketchNight.tsx',
  'src/app/components/game/Result.tsx',
  'src/app/components/molecules/TankaCard.tsx',
  'src/app/components/organisms/ThemeSwitch.tsx',
  'src/app/components/templates/Header.tsx',
  'src/i18n/context.tsx',
  'src/app/hooks/useIsDarkMode.ts',
  'src/app/hooks/useLocalStorageValue.ts',
]

// lintText に渡す仮のパス。ファイルは作らない。
const PROBE_PATH = 'src/app/components/atoms/__RuleProbe__.tsx'

// 各ルールが必ず指摘するコード。指摘 0 件のテストが空振りしていないことを確かめる。
const VIOLATIONS: Record<Rule, string> = {
  'react-hooks/set-state-in-effect': `import { useEffect, useState } from 'react'
export function Probe() {
  const [value, setValue] = useState(0)
  useEffect(() => {
    setValue(1)
  }, [])
  return <p>{value}</p>
}
`,
  'react-hooks/immutability': `import { useMemo } from 'react'
export function Probe() {
  const handleClick = useMemo(() => {
    let timeoutId: number | undefined
    return () => {
      clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {}, 100)
    }
  }, [])
  return <button onClick={handleClick}>probe</button>
}
`,
  'react-hooks/set-state-in-render': `import { useState } from 'react'
export function Probe() {
  const [value, setValue] = useState(0)
  setValue(1)
  return <p>{value}</p>
}
`,
}

const TAILWIND_VIOLATIONS: Record<TailwindRule, string> = {
  'tailwindcss/classnames-order': `export function Probe() {
  return <p className="p-2 flex">probe</p>
}
`,
  'tailwindcss/enforces-shorthand': `export function Probe() {
  return <p className="h-4 w-4">probe</p>
}
`,
}

const HOOKS_ERROR_VIOLATIONS: Record<HooksErrorRule, string> = {
  'react-hooks/exhaustive-deps': `import { useEffect } from 'react'
export function Probe({ value }: { value: number }) {
  useEffect(() => {
    console.log(value)
  }, [])
  return <p>{value}</p>
}
`,
}

const PROBES: Record<Rule | TailwindRule | HooksErrorRule, string> = {
  ...VIOLATIONS,
  ...TAILWIND_VIOLATIONS,
  ...HOOKS_ERROR_VIOLATIONS,
}

const eslint = new ESLint({ cwd: ROOT })

const severityOf = (
  entry: Linter.RuleEntry | undefined,
): number | undefined => {
  if (entry === undefined) return undefined
  const level = Array.isArray(entry) ? entry[0] : entry
  if (level === 'error') return 2
  if (level === 'warn') return 1
  if (level === 'off') return 0
  return level
}

const severitiesIn = async (
  file: string,
  rules: readonly string[],
): Promise<[string, number | undefined][]> => {
  const config = await eslint.calculateConfigForFile(file)
  return rules.map((rule) => [rule, severityOf(config.rules?.[rule])])
}

const allError = (rules: readonly string[]): [string, number][] =>
  rules.map((rule) => [rule, ERROR])

const isTargetRule = (ruleId: string | null): boolean =>
  ruleId !== null && (RULES as readonly string[]).includes(ruleId)

let fixedFilesResults: Promise<ESLint.LintResult[]> | undefined
const lintFixedFiles = (): Promise<ESLint.LintResult[]> => {
  fixedFilesResults ??= eslint.lintFiles(FIXED_FILES)
  return fixedFilesResults
}

test('eslint.config.mjs: 3 ルールの重大度を上書きしていない', () => {
  // Given
  const config = readFileSync(
    new URL('../eslint.config.mjs', import.meta.url),
    'utf8',
  )
  // When
  const mentioned = RULES.filter((rule) => config.includes(rule))
  // Then: 既定の設定をそのまま使う
  assert.deepEqual(mentioned, [])
})

for (const file of FIXED_FILES) {
  test(`eslint: ${file} で 3 ルールが error になっている`, async () => {
    // Given/When
    const severities = await severitiesIn(file, RULES)
    // Then
    assert.deepEqual(severities, allError(RULES))
  })
}

test('eslint: src/app/page.tsx で tailwindcss の 2 ルールが error になっている', async () => {
  // Given/When
  const severities = await severitiesIn('src/app/page.tsx', TAILWIND_RULES)
  // Then
  assert.deepEqual(severities, allError(TAILWIND_RULES))
})

test('eslint: src/app/components/game/Player.tsx で react-hooks/exhaustive-deps が error になっている', async () => {
  // Given/When
  const severities = await severitiesIn(
    'src/app/components/game/Player.tsx',
    HOOKS_ERROR_RULES,
  )
  // Then
  assert.deepEqual(severities, allError(HOOKS_ERROR_RULES))
})

for (const [rule, code] of Object.entries(PROBES)) {
  test(`eslint: ${rule} は違反するコードを error で指摘する`, async () => {
    // Given: ループ変数の code（そのルールが必ず指摘するコード）
    // When
    const [result] = await eslint.lintText(code, { filePath: PROBE_PATH })
    const reported = result.messages.filter(
      (message) => message.ruleId === rule,
    )
    // Then
    assert.ok(reported.length > 0, `${rule} の指摘が無い`)
    assert.ok(reported.every((message) => message.severity === ERROR))
  })
}

test('eslint: #286 で直したファイルは構文エラーなく lint できる', async () => {
  // Given/When
  const results = await lintFixedFiles()
  const fatal = results.flatMap((result) =>
    result.messages
      .filter((message) => message.fatal)
      .map(
        (message) => `${result.filePath}:${message.line} ${message.message}`,
      ),
  )
  // Then: 解析に失敗してルールが走らない、という空振りがない
  assert.deepEqual(fatal, [])
})

test('eslint: #286 で直したファイルに 3 ルールの指摘が無い', async () => {
  // Given/When
  const results = await lintFixedFiles()
  const reported = results.flatMap((result) =>
    result.messages
      .filter((message) => isTargetRule(message.ruleId))
      .map((message) => `${result.filePath}:${message.line} ${message.ruleId}`),
  )
  // Then
  assert.deepEqual(reported, [])
})
