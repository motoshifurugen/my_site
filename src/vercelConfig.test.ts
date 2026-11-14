// vercel.json で dependabot と夜勤のブランチのデプロイを止める設定を固定するテスト
// （Issue #318）。
//
// Vercel の無料枠の Deployment Storage を、PR ごとのプレビューが使い切った。
// git.deploymentEnabled に 2 つのパターンを false で書き、その 2 つだけを止める。
// main の本番デプロイと、ほかのブランチのプレビューは、書いていないブランチが既定で
// true になることで残す。true の項目を 1 つでも足すと、同じブランチに当たる false より
// 優先されるので、キーと値を完全一致で固定する。
// https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled
//
// ignoreCommand で止めたビルドも CANCELED のデプロイとして作られ、デプロイ数の上限と
// 同時ビルド枠に数えられるので使わない。
// https://vercel.com/docs/project-configuration/project-settings#ignored-build-step
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

const readVercelJson = (): string =>
  readFileSync(join(ROOT, 'vercel.json'), 'utf8')

const loadVercelConfig = (): Record<string, unknown> => {
  const parsed: unknown = JSON.parse(readVercelJson())
  assert.ok(
    typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed),
    'vercel.json のトップレベルはオブジェクトであること',
  )
  return parsed as Record<string, unknown>
}

test('vercel.json は JSON として読める', () => {
  // Given: リポジトリ直下の vercel.json
  const source = readVercelJson()

  // When / Then: JSON.parse が例外を投げない
  assert.doesNotThrow(() => JSON.parse(source))
})

test('redirects は / から /my_site への恒久リダイレクト 1 件のまま', () => {
  // Given: vercel.json の設定
  const config = loadVercelConfig()

  // When: redirects を取り出す
  const { redirects } = config

  // Then: #318 より前の内容から変わっていない
  assert.deepEqual(redirects, [
    { source: '/', destination: '/my_site', permanent: true },
  ])
})

test('git.deploymentEnabled は dependabot と夜勤のブランチだけを false にする', () => {
  // Given: vercel.json の設定
  const config = loadVercelConfig()

  // When: git の設定を取り出す
  const { git } = config

  // Then: 止めるのは 2 パターンだけで、main のキーも true の項目もない
  assert.deepEqual(git, {
    deploymentEnabled: {
      'dependabot/**': false,
      'feat/issue-*-overnight': false,
    },
  })
})

test('トップレベルのキーは redirects と git だけ（ignoreCommand を使わない）', () => {
  // Given: vercel.json の設定
  const config = loadVercelConfig()

  // When: トップレベルのキーを並べる
  const keys = Object.keys(config).sort()

  // Then: ignoreCommand や $schema などのキーがない
  assert.deepEqual(keys, ['git', 'redirects'])
})
