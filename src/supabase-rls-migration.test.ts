// Supabase の RLS（Issue #159, #292）の契約を固定する静的検査テスト。
//
// 方針:
//   - migrations が作るテーブルは、すべてどこかの migration で RLS を有効にする。
//     1つでも RLS 無しのテーブルが残ると、grant を持つ anon / authenticated から
//     読み書きできてしまい「書込みは service_role だけ」が成り立たない。
//   - 読み取りポリシーを置くのは tanka / tags の2テーブルだけ。
//   - tanka_likes は user_ip を持つので、anon / authenticated から権限ごと外す（REVOKE）。
//     ポリシーが無いだけでは 0 行が返るだけで、直接 SELECT が拒否にならない。
//     いいね数は view tanka_like_counts（件数だけ）で見せる。
//   - 書込みのポリシーは作らない。ポリシーが無いこと自体で書込みを service_role
//     （bypassrls を持つ）だけに絞る。
//   - anon 鍵はフロントで使わない（書込みと IP によるいいね判定は service_role の API だけが行う）。
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

const PUBLIC_READ_TABLES = ['tanka', 'tags']

const LIKES_TABLE = 'tanka_likes'
const LIKE_COUNTS_VIEW = 'tanka_like_counts'
const CLIENT_ROLES = ['anon', 'authenticated']

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

const readMigration = (name: string): string =>
  readFileSync(new URL(name, migrationsDir), 'utf8')

const migrations = migrationFiles.map((name) => ({
  name,
  sql: normalizeSql(readMigration(name)),
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
const roleSet = (list: string): Set<string> =>
  new Set(
    list
      .split(',')
      .map((r) => r.trim().replace(/"/g, ''))
      .filter((r) => r.length > 0),
  )

const isClientRoleSet = (roles: Set<string>): boolean =>
  roles.size === CLIENT_ROLES.length && CLIENT_ROLES.every((r) => roles.has(r))

const policyRoles = (body: string): Set<string> => {
  const m = body.match(/\bto\s+([\w\s,"]+?)(?=\s+using\b|\s+with\s+check\b|$)/)
  if (!m) return new Set()
  return roleSet(m[1])
}

const collectStatements = (sql: string, keyword: string): string[] =>
  Array.from(
    sql.matchAll(new RegExp(`\\b${keyword}\\b[^;]*;`, 'g')),
    (m) => m[0],
  )

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
    const matched = selectPolicies.filter(
      (p) =>
        isClientRoleSet(policyRoles(p.body)) &&
        /\busing\s*\(\s*true\s*\)/.test(p.body),
    )
    assert.ok(
      matched.length >= 1,
      `${table} に FOR SELECT TO anon, authenticated USING (true) のポリシーがある（見つかったポリシー: ${JSON.stringify(selectPolicies)}）`,
    )
  })
}

test('読み取りを許す2テーブル以外にはポリシーを作らない（anon と authenticated は全面拒否）', () => {
  // Given: metadata / tag_dictionary / tanka_tags / tanka_embeddings / tanka_likes / api_rate_limits
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

test(`${RLS_MIGRATION_FILE}: SECURITY DEFINER を足さない（件数は view で見せ、関数は作らない）`, () => {
  const sql = rlsMigration()
  assert.ok(!/security\s+definer/.test(sql), 'SECURITY DEFINER を含まない')
})

// --- (e) tanka_likes を anon / authenticated から隠す（Issue #292） ---

test(`${RLS_MIGRATION_FILE}: REVOKE は tanka_likes の ALL を anon, authenticated から外す1文だけ`, () => {
  // Given: 008 の実行文
  // When: REVOKE 文を集める
  const revokes = collectStatements(rlsMigration(), 'revoke')
  // Then: REVOKE ALL ON tanka_likes FROM anon, authenticated; の1文だけ
  //       （ポリシーが無いだけでは 0 行が返るだけなので、権限ごと外して直接 SELECT を拒否にする）
  assert.equal(
    revokes.length,
    1,
    `REVOKE は1文だけ（見つかった文: ${JSON.stringify(revokes)}）`,
  )
  const m = revokes[0].match(
    new RegExp(
      `^revoke\\s+all(?:\\s+privileges)?\\s+on\\s+(?:table\\s+)?${tableRef(LIKES_TABLE)}\\s+from\\s+([\\w\\s,"]+?)\\s*;$`,
    ),
  )
  assert.ok(
    m,
    `REVOKE ALL ON ${LIKES_TABLE} FROM ... の形（実際: ${revokes[0]}）`,
  )
  assert.ok(
    isClientRoleSet(roleSet(m[1])),
    `REVOKE の対象 role が anon と authenticated（実際: ${m[1]}）`,
  )
})

test(`${RLS_MIGRATION_FILE}: GRANT は tanka_like_counts の SELECT を anon, authenticated に渡す1文だけ`, () => {
  // Given: 008 の実行文
  // When: GRANT 文を集める
  const grants = collectStatements(rlsMigration(), 'grant')
  // Then: GRANT SELECT ON tanka_like_counts TO anon, authenticated; の1文だけ（件数を見せる唯一の道）
  assert.equal(
    grants.length,
    1,
    `GRANT は1文だけ（見つかった文: ${JSON.stringify(grants)}）`,
  )
  const m = grants[0].match(
    new RegExp(
      `^grant\\s+select\\s+on\\s+(?:table\\s+)?${tableRef(LIKE_COUNTS_VIEW)}\\s+to\\s+([\\w\\s,"]+?)\\s*;$`,
    ),
  )
  assert.ok(
    m,
    `GRANT SELECT ON ${LIKE_COUNTS_VIEW} TO ... の形（実際: ${grants[0]}）`,
  )
  assert.ok(
    isClientRoleSet(roleSet(m[1])),
    `GRANT の対象 role が anon と authenticated（実際: ${m[1]}）`,
  )
})

test('どの migration の実行文も tanka_likes に GRANT しない（user_ip を anon / authenticated に戻さない）', () => {
  // Given: 全 migration の実行文の GRANT
  const grants = collectStatements(allSql, 'grant')
  // Then: tanka_likes を対象にした GRANT も、スキーマの全テーブルへの GRANT も無い
  const onLikes = new RegExp(
    `\\bon\\s+(?:table\\s+)?(?:[\\w."]+\\s*,\\s*)*${tableRef(LIKES_TABLE)}(?=[\\s,;])`,
  )
  const offenders = grants.filter(
    (g) => onLikes.test(g) || /\bon\s+all\s+tables\b/.test(g),
  )
  assert.deepEqual(offenders, [], `${LIKES_TABLE} に届く GRANT が無い`)
})

test(`${RLS_MIGRATION_FILE}: 古い tanka_likes_select_public を DROP POLICY IF EXISTS で消す（旧 008 適用後でも同じ状態にそろう）`, () => {
  assert.match(
    rlsMigration(),
    new RegExp(
      `drop\\s+policy\\s+if\\s+exists\\s+"?tanka_likes_select_public"?\\s+on\\s+${tableRef(LIKES_TABLE)}\\s*;`,
    ),
  )
})

test('どの migration の実行文も tanka_likes にポリシーを作らない', () => {
  // Given: 全 migration の CREATE POLICY
  const onLikes = policies.filter((p) => p.table === LIKES_TABLE)
  // Then: tanka_likes には1つも無い（SELECT ポリシーがあると user_ip が読める）
  assert.deepEqual(
    onLikes.map((p) => `${p.name}: ${p.body}`),
    [],
    `${LIKES_TABLE} にポリシーが無い（user_ip 列を anon / authenticated に見せない）`,
  )
})

const likeCountsViewDefinitions = (): string[] =>
  Array.from(
    allSql.matchAll(
      new RegExp(
        `create\\s+(?:or\\s+replace\\s+)?view\\s+${tableRef(LIKE_COUNTS_VIEW)}[^;]*;`,
        'g',
      ),
    ),
    (m) => m[0],
  )

test('tanka_like_counts の定義に user_ip が出てこない（件数だけを見せる）', () => {
  // Given: 全 migration の CREATE VIEW tanka_like_counts
  const definitions = likeCountsViewDefinitions()
  assert.ok(
    definitions.length >= 1,
    `${LIKE_COUNTS_VIEW} の CREATE VIEW がある`,
  )
  // Then: どの定義にも user_ip が無い
  const leaking = definitions.filter((d) => /\buser_ip\b/.test(d))
  assert.deepEqual(leaking, [], `${LIKE_COUNTS_VIEW} が user_ip を返さない`)
})

test('tanka_like_counts に security_invoker を設定しない（付けると anon が件数を読めない）', () => {
  // Given: tanka_like_counts を作る文・変える文
  const alters = Array.from(
    allSql.matchAll(
      new RegExp(
        `alter\\s+view\\s+(?:if\\s+exists\\s+)?${tableRef(LIKE_COUNTS_VIEW)}[^;]*;`,
        'g',
      ),
    ),
    (m) => m[0],
  )
  // Then: どれにも security_invoker が無い（view は持ち主の権限で REVOKE 済みの tanka_likes を数える）
  const offenders = likeCountsViewDefinitions()
    .concat(alters)
    .filter((s) => /\bsecurity_invoker\b/.test(s))
  assert.deepEqual(
    offenders,
    [],
    `${LIKE_COUNTS_VIEW} に security_invoker が無い`,
  )
})

// --- 008 のヘッダーにある戻し用 SQL（コメントの中） ---

// コメント部分だけを取り出し、normalizeSql で空白をならす（行内の `-- 注記` も消える）
const commentSql = (raw: string): string =>
  normalizeSql(Array.from(raw.matchAll(/--([^\n]*)/g), (m) => m[1]).join('\n'))

// 戻し用 SQL は BEGIN; ... COMMIT; で、DISABLE ROW LEVEL SECURITY を含むもの。
// 確認用 SQL（BEGIN; SET LOCAL ROLE ...; ROLLBACK;）と取り違えないよう、間に別の BEGIN; を挟まない範囲で探す。
const rollbackSql = (): string => {
  const blocks = Array.from(
    commentSql(readMigration(RLS_MIGRATION_FILE)).matchAll(
      /begin\s*;((?:(?!begin\s*;).)*?)commit\s*;/g,
    ),
    (m) => m[1],
  ).filter((b) => /disable\s+row\s+level\s+security/.test(b))
  assert.equal(
    blocks.length,
    1,
    `${RLS_MIGRATION_FILE} のコメントに戻し用 SQL（BEGIN; ... DISABLE ROW LEVEL SECURITY ... COMMIT;）が1つある`,
  )
  return blocks[0]
}

test(`${RLS_MIGRATION_FILE}: 戻し用 SQL が tanka_likes の権限を anon, authenticated に GRANT ALL で戻す`, () => {
  // Given: 008 のヘッダーにある戻し用 SQL
  const grants = collectStatements(rollbackSql(), 'grant')
  // Then: GRANT ALL ON tanka_likes TO anon, authenticated; がある（REVOKE を打ち消す）
  const restored = grants.filter((g) => {
    const m = g.match(
      new RegExp(
        `^grant\\s+all(?:\\s+privileges)?\\s+on\\s+(?:table\\s+)?${tableRef(LIKES_TABLE)}\\s+to\\s+([\\w\\s,"]+?)\\s*;$`,
      ),
    )
    return m !== null && isClientRoleSet(roleSet(m[1]))
  })
  assert.equal(
    restored.length,
    1,
    `戻し用 SQL に GRANT ALL ON ${LIKES_TABLE} TO anon, authenticated; がある（見つかった GRANT: ${JSON.stringify(grants)}）`,
  )
})

test(`${RLS_MIGRATION_FILE}: 戻し用 SQL が 008 の作るポリシーだけを DROP する`, () => {
  // Given: 008 が作るポリシーと、戻し用 SQL の DROP POLICY
  const created = collectPolicies(rlsMigration()).map(
    (p) => `${p.name} on ${p.table}`,
  )
  const dropped = Array.from(
    rollbackSql().matchAll(
      /drop\s+policy\s+(?:if\s+exists\s+)?"?(\w+)"?\s+on\s+(?:public\.)?"?(\w+)"?\s*;/g,
    ),
    (m) => `${m[1]} on ${m[2]}`,
  )
  // Then: 両者が一致する（tanka_likes_select_public は 008 がもう作らないので DROP しない）
  assert.deepEqual(dropped.sort(), created.sort())
})

test(`${RLS_MIGRATION_FILE}: 戻し用 SQL が全テーブルの RLS を無効に戻す`, () => {
  const sql = rollbackSql()
  const missing = createdTables.filter(
    (table) =>
      !new RegExp(
        `alter\\s+table\\s+(?:if\\s+exists\\s+)?(?:only\\s+)?${tableRef(table)}\\s+disable\\s+row\\s+level\\s+security`,
      ).test(sql),
  )
  assert.deepEqual(
    missing,
    [],
    `戻し用 SQL で DISABLE していないテーブル: ${missing.join(', ')}`,
  )
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

test('tanka_likes を読む src のファイルは、どの Supabase クライアントも service_role 鍵で作る（REVOKE 後もいいね数が出る）', () => {
  // Given: src で .from('tanka_likes') を使うファイル
  const likesReaders = srcFiles.filter((abs) =>
    /\.from\(\s*['"`]tanka_likes['"`]\s*\)/.test(readFileSync(abs, 'utf8')),
  )
  assert.ok(
    likesReaders.length > 0,
    'tanka_likes を読むファイルがある（/api/tanka-likes）',
  )
  // Then: そのファイルの createClient はすべて第2引数が SUPABASE_SERVICE_ROLE_KEY
  //       （anon / authenticated は REVOKE で拒否されるが、service_role は権限を持ち RLS も素通りする）
  for (const abs of likesReaders) {
    const source = readFileSync(abs, 'utf8')
    const clients = source.match(/createClient\(/g) ?? []
    const serviceRoleClients =
      source.match(
        /createClient\(\s*process\.env\.SUPABASE_URL\s*,\s*process\.env\.SUPABASE_SERVICE_ROLE_KEY\s*,?\s*\)/g,
      ) ?? []
    assert.ok(clients.length > 0, `${abs} が createClient を呼ぶ`)
    assert.equal(
      serviceRoleClients.length,
      clients.length,
      `${abs} の createClient がすべて SUPABASE_SERVICE_ROLE_KEY を使う`,
    )
  }
})
