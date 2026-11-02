// Supabase の RLS（Issue #159）の契約を固定する静的検査テスト。
//
// 方針:
//   - migrations が作るテーブルは、すべてどこかの migration で RLS を有効にする。
//     1つでも RLS 無しのテーブルが残ると、grant を持つ anon / authenticated から
//     読み書きできてしまい「書込みは service_role だけ」が成り立たない。
//   - 読み取りを許すのは tanka / tanka_likes / tags の3テーブルだけ。
//   - 書込みのポリシーは作らない。ポリシーが無いこと自体で書込みを service_role
//     （bypassrls を持つ）だけに絞る。
//   - anon 鍵はフロントで使わない（tanka_likes.user_ip が読み取りポリシーで見えるため）。
//
// 本番 DB には当てず、SQL と src のソースを読んで検査する（font-noto-sans-wiring.test.ts と同方針）。
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const migrationsDir = new URL('../scripts/migrations/', import.meta.url)
const srcDir = new URL('./', import.meta.url)
const selfPath = fileURLToPath(import.meta.url)

const RLS_MIGRATION_FILE = '008_enable_rls.sql'

// migrations が作るテーブル（001, 002, 006, 007）。抽出用の正規表現が壊れていないことの確認に使う
const KNOWN_TABLES = [
  'tanka',
  'metadata',
  'tags',
  'tag_dictionary',
  'tanka_tags',
  'tanka_embeddings',
  'tanka_likes',
  'api_rate_limits',
]

const PUBLIC_READ_TABLES = ['tanka', 'tanka_likes', 'tags']

// コメントの中に書いた戻し用 SQL を実行文と取り違えないよう、コメントを除いて空白をならす。
// 既存 migrations の `--` はすべて行末コメントで、文字列リテラルの中には現れない。
const normalizeSql = (sql: string): string =>
  sql
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/--[^\n]*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

const migrationFiles = readdirSync(migrationsDir)
  .filter((name) => name.endsWith('.sql'))
  .sort()

const migrations = migrationFiles.map((name) => ({
  name,
  sql: normalizeSql(readFileSync(new URL(name, migrationsDir), 'utf8')),
}))

const allSql = migrations.map((m) => m.sql).join(' ')

const escapeRegExp = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const tableRef = (table: string): string =>
  `(?:public\\.)?"?${escapeRegExp(table)}"?`

// tsconfig の target が古く Set / matchAll を spread できないため Array.from で回す
const collectCreatedTables = (sql: string): string[] => {
  const pattern =
    /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?"?(\w+)"?/g
  const names = Array.from(sql.matchAll(pattern), (m) => m[1])
  return names.filter((name, i) => names.indexOf(name) === i)
}

interface PolicyStatement {
  name: string
  table: string
  body: string
}

const collectPolicies = (sql: string): PolicyStatement[] => {
  const pattern =
    /create\s+policy\s+(?:"([^"]+)"|(\w+))\s+on\s+(?:public\.)?"?(\w+)"?([^;]*);/g
  return Array.from(sql.matchAll(pattern), (m) => ({
    name: m[1] ?? m[2],
    table: m[3],
    body: m[4].trim(),
  }))
}

const policies = collectPolicies(allSql)
const createdTables = collectCreatedTables(allSql)

const hasEnableRls = (table: string): boolean =>
  new RegExp(
    `alter\\s+table\\s+(?:if\\s+exists\\s+)?(?:only\\s+)?${tableRef(table)}\\s+enable\\s+row\\s+level\\s+security`,
  ).test(allSql)

// 並び順の違いで落とさないよう集合で比べる
const policyRoles = (body: string): Set<string> => {
  const m = body.match(/\bto\s+([\w\s,"]+?)(?=\s+using\b|\s+with\s+check\b|$)/)
  if (!m) return new Set()
  return new Set(
    m[1]
      .split(',')
      .map((r) => r.trim().replace(/"/g, ''))
      .filter((r) => r.length > 0),
  )
}

const isSelectPolicy = (body: string): boolean => /\bfor\s+select\b/.test(body)

// --- テーブル抽出の前提 ---

test('migrations から既知の8テーブルをすべて抽出できる', () => {
  // Given: scripts/migrations/*.sql
  // When: CREATE TABLE を集める
  // Then: EXECUTE の文字列内で作る tanka_embeddings も含め、既知のテーブルがそろう
  for (const table of KNOWN_TABLES) {
    assert.ok(
      createdTables.includes(table),
      `${table} を CREATE TABLE から抽出できる（抽出: ${createdTables.join(', ')}）`,
    )
  }
})

// --- (a) RLS の有効化 ---

test(`RLS を有効にする migration として ${RLS_MIGRATION_FILE} がある`, () => {
  assert.ok(
    migrationFiles.includes(RLS_MIGRATION_FILE),
    `scripts/migrations/${RLS_MIGRATION_FILE} が存在する（現在: ${migrationFiles.join(', ')}）`,
  )
})

test('migrations が作るすべてのテーブルで ENABLE ROW LEVEL SECURITY している', () => {
  // Given: migrations が作るテーブル一覧（今後足すテーブルも含めて自動で集める）
  // When: それぞれに ALTER TABLE ... ENABLE ROW LEVEL SECURITY があるか調べる
  // Then: 抜けが無い
  const missing = createdTables.filter((table) => !hasEnableRls(table))
  assert.deepEqual(
    missing,
    [],
    `RLS を有効にしていないテーブル: ${missing.join(', ')}`,
  )
})

test('実行文に DISABLE ROW LEVEL SECURITY が無い（戻し用 SQL はコメントの中だけに置く）', () => {
  assert.ok(
    !/disable\s+row\s+level\s+security/.test(allSql),
    'コメントを除いた SQL に DISABLE ROW LEVEL SECURITY を含まない',
  )
})

test('FORCE ROW LEVEL SECURITY を使わない（テーブルの持ち主まで縛らない）', () => {
  assert.ok(
    !/force\s+row\s+level\s+security/.test(allSql),
    'コメントを除いた SQL に FORCE ROW LEVEL SECURITY を含まない',
  )
})

// --- (b) 読み取りポリシー ---

for (const table of PUBLIC_READ_TABLES) {
  test(`${table}: anon と authenticated に SELECT を USING (true) で許すポリシーがある`, () => {
    // Given: ${table} に付いたポリシー
    const selectPolicies = policies.filter(
      (p) => p.table === table && isSelectPolicy(p.body),
    )
    // Then: FOR SELECT TO anon, authenticated USING (true) のポリシーが1つ以上ある
    const matched = selectPolicies.filter((p) => {
      const roles = policyRoles(p.body)
      return (
        roles.size === 2 &&
        roles.has('anon') &&
        roles.has('authenticated') &&
        /\busing\s*\(\s*true\s*\)/.test(p.body)
      )
    })
    assert.ok(
      matched.length >= 1,
      `${table} に FOR SELECT TO anon, authenticated USING (true) のポリシーがある（見つかったポリシー: ${JSON.stringify(selectPolicies)}）`,
    )
  })
}

test('読み取りを許す3テーブル以外にはポリシーを作らない（anon と authenticated は全面拒否）', () => {
  // Given: metadata / tag_dictionary / tanka_tags / tanka_embeddings / api_rate_limits
  // Then: これらにポリシーが1つも無い
  const unexpected = policies.filter(
    (p) => !PUBLIC_READ_TABLES.includes(p.table),
  )
  assert.deepEqual(
    unexpected.map((p) => `${p.name} ON ${p.table}`),
    [],
    '読み取り対象外のテーブルにポリシーが無い',
  )
})

// --- (c) 書込みポリシーが無い ---

test('すべての CREATE POLICY が FOR SELECT を明示している（FOR 省略は ALL になるため不可）', () => {
  // Given: migrations 内の全 CREATE POLICY
  // Then: FOR SELECT 以外（INSERT / UPDATE / DELETE / ALL / 省略）が無い
  const nonSelect = policies.filter((p) => !isSelectPolicy(p.body))
  assert.deepEqual(
    nonSelect.map((p) => `${p.name} ON ${p.table}: ${p.body}`),
    [],
    '書込みを許すポリシーが無い',
  )
})

test('CREATE POLICY ... FOR INSERT / UPDATE / DELETE / ALL がどこにも無い', () => {
  assert.ok(
    !/create\s+policy\s[^;]*\bfor\s+(?:insert|update|delete|all)\b/.test(
      allSql,
    ),
    '書込み系のポリシー定義を含まない',
  )
})

test('ポリシーに WITH CHECK を書かない（書込みの条件を持たない）', () => {
  const withCheck = policies.filter((p) => /\bwith\s+check\b/.test(p.body))
  assert.deepEqual(
    withCheck.map((p) => `${p.name} ON ${p.table}`),
    [],
    'WITH CHECK を持つポリシーが無い',
  )
})

// --- 008 の適用しやすさ（手で流す前提） ---

const rlsMigration = (): string => {
  const found = migrations.find((m) => m.name === RLS_MIGRATION_FILE)
  assert.ok(found, `${RLS_MIGRATION_FILE} が存在する`)
  return found.sql
}

test(`${RLS_MIGRATION_FILE}: 全体を BEGIN; ... COMMIT; で囲む（途中までの適用を防ぐ）`, () => {
  const sql = rlsMigration()
  assert.match(sql, /^begin\s*;/, 'コメントを除いた先頭が BEGIN;')
  assert.match(sql, /commit\s*;$/, 'コメントを除いた末尾が COMMIT;')
})

test(`${RLS_MIGRATION_FILE}: 各 CREATE POLICY の前に同名の DROP POLICY IF EXISTS がある（何度流しても同じ結果）`, () => {
  const sql = rlsMigration()
  const ownPolicies = collectPolicies(sql)
  assert.ok(
    ownPolicies.length >= PUBLIC_READ_TABLES.length,
    'ポリシーを定義している',
  )
  for (const p of ownPolicies) {
    const drop = new RegExp(
      `drop\\s+policy\\s+if\\s+exists\\s+"?${escapeRegExp(p.name)}"?\\s+on\\s+${tableRef(p.table)}\\s*;`,
    )
    const dropIndex = sql.search(drop)
    const createIndex = sql.search(
      new RegExp(
        `create\\s+policy\\s+"?${escapeRegExp(p.name)}"?\\s+on\\s+${tableRef(p.table)}\\b`,
      ),
    )
    assert.ok(
      dropIndex >= 0,
      `${p.name} ON ${p.table} の DROP POLICY IF EXISTS がある`,
    )
    assert.ok(
      dropIndex < createIndex,
      `${p.name} の DROP が CREATE より前にある`,
    )
  }
})

test(`${RLS_MIGRATION_FILE}: SECURITY DEFINER / GRANT / REVOKE を足さない（スコープ外）`, () => {
  const sql = rlsMigration()
  assert.ok(!/security\s+definer/.test(sql), 'SECURITY DEFINER を含まない')
  assert.ok(!/\bgrant\b/.test(sql), 'GRANT を含まない')
  assert.ok(!/\brevoke\b/.test(sql), 'REVOKE を含まない')
})

// --- (d) anon 鍵をフロントで使わない ---

const srcFiles = (readdirSync(srcDir, { recursive: true }) as string[])
  .filter((rel) => /\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(rel))
  .map((rel) => fileURLToPath(new URL(rel, srcDir)))
  .filter((abs) => abs !== selfPath)

test('src のファイル一覧を取得できる（検査対象が空でない）', () => {
  assert.ok(srcFiles.length > 0, 'src 配下にソースファイルがある')
})

for (const forbidden of ['NEXT_PUBLIC_SUPABASE', 'SUPABASE_ANON_KEY']) {
  test(`src のどこにも ${forbidden} が出てこない（anon 鍵をフロントで使わない）`, () => {
    const offenders = srcFiles.filter((abs) =>
      readFileSync(abs, 'utf8').includes(forbidden),
    )
    assert.deepEqual(offenders, [], `${forbidden} を参照するファイル`)
  })
}
