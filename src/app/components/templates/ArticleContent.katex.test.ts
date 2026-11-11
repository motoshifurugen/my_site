// katex の脆弱性 GHSA-238p-pmpm-9mq7 の解消（Issue #308 / TDD 先行）を固定する回帰テスト。
//
// katex 0.16 系は Object.prototype の汚染で trust を有効にされると \href などの危険な
// コマンドを描画してしまう。修正は 0.18.2 から。上流の rehype-katex と
// micromark-extension-math が ^0.16.0 に固定しているため、package.json の overrides で
// 0.18 系へ上げる。0.18 では CSS のクラス名に katex- 接頭辞が付くので、ArticleContent が
// CDN から読む katex.min.css も同じ版にそろえないと数式の見た目が崩れる。
//
// katex はプロジェクトの直接の依存ではない。テストで `import 'katex'` すると package.json に
// ない依存を使うことになるので、本番と同じ katex を rehype-katex 経由で解決する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は katex 0.16.47・CSS 0.16.21 のため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { test } from 'node:test'

interface LockPackage {
  version: string
}

interface Lockfile {
  packages: Record<string, LockPackage>
}

interface Katex {
  renderToString: (tex: string, options?: { trust?: boolean }) => string
}

const FIXED_VERSION = [0, 18, 2] as const

const lockfile = JSON.parse(
  readFileSync(
    new URL('../../../../package-lock.json', import.meta.url),
    'utf8',
  ),
) as Lockfile

const tsx = readFileSync(
  new URL('./ArticleContent.tsx', import.meta.url),
  'utf8',
)

function katexLockEntries(): Array<[string, LockPackage]> {
  return Object.entries(lockfile.packages).filter(
    ([key]) =>
      key === 'node_modules/katex' || key.endsWith('/node_modules/katex'),
  )
}

function parseVersion(version: string): [number, number, number] {
  const m = version.match(/^(\d+)\.(\d+)\.(\d+)/)
  assert.ok(m, `semver として読める版である（実際: ${version}）`)
  return [Number(m![1]), Number(m![2]), Number(m![3])]
}

function isAtLeast(
  actual: readonly number[],
  minimum: readonly number[],
): boolean {
  for (let i = 0; i < minimum.length; i++) {
    if (actual[i] !== minimum[i]) return actual[i] > minimum[i]
  }
  return true
}

function cdnKatexCss(source: string): { version: string; tag: string } {
  const m = source.match(
    /<link[^>]*href="https:\/\/cdn\.jsdelivr\.net\/npm\/katex@([^/"]+)\/dist\/katex\.min\.css"[^>]*\/>/,
  )
  assert.ok(m, 'ArticleContent.tsx が jsDelivr から katex.min.css を読んでいる')
  return { version: m![1], tag: m![0] }
}

function loadKatexViaRehypeKatex(): Katex {
  const requireFromRehypeKatex = createRequire(
    import.meta.resolve('rehype-katex'),
  )
  return requireFromRehypeKatex('katex') as Katex
}

// --- (1) lockfile の katex の版 ---

test('package-lock.json: katex の項目が 1 つ以上ある', () => {
  // Given/When: lockfile から katex の項目を集める
  const entries = katexLockEntries()
  // Then: rehype-katex / remark-math の依存として katex が入っている
  assert.ok(entries.length > 0, 'node_modules/katex の項目がある')
})

test('package-lock.json: すべての katex が修正版 0.18.2 以上である', () => {
  // Given: lockfile の katex の項目すべて（ネストした node_modules も含む）
  const entries = katexLockEntries()
  // When/Then: どの項目も GHSA-238p-pmpm-9mq7 の修正版以上である
  for (const [key, pkg] of entries) {
    assert.ok(
      isAtLeast(parseVersion(pkg.version), FIXED_VERSION),
      `${key} は 0.18.2 以上（実際: ${pkg.version}）`,
    )
  }
})

test('package-lock.json: katex は 0.19 以上に上がっていない（strict 周りの破壊的変更を避ける）', () => {
  // Given: lockfile の katex の項目すべて
  const entries = katexLockEntries()
  // When/Then: どの項目も 0.18 系にとどまる
  for (const [key, pkg] of entries) {
    const [major, minor] = parseVersion(pkg.version)
    assert.ok(
      major === 0 && minor === 18,
      `${key} は 0.18 系（実際: ${pkg.version}）`,
    )
  }
})

test('package-lock.json: katex の版が 1 つにそろっている', () => {
  // Given: lockfile の katex の項目すべて
  const versions = new Set(katexLockEntries().map(([, pkg]) => pkg.version))
  // Then: CDN の CSS と突き合わせる版が一意に決まる
  assert.equal(versions.size, 1, `katex の版が 1 つ（実際: ${[...versions]}）`)
})

// --- (2) CDN の CSS と JS の版をそろえる ---

test('ArticleContent: CDN の katex.min.css の版が lockfile の katex と同じである', () => {
  // Given: lockfile の katex の版
  const [[, pkg]] = katexLockEntries()
  // When: ArticleContent.tsx の CDN URL から版を取り出す
  const { version } = cdnKatexCss(tsx)
  // Then: JS と CSS の版が一致する（0.18 のクラス名の接頭辞変更で見た目が崩れるのを防ぐ）
  assert.equal(version, pkg.version)
})

test('ArticleContent: CDN の katex.min.css に sha384 の SRI を付けている', () => {
  // Given: CDN から katex.min.css を読む <link>
  const { tag } = cdnKatexCss(tsx)
  // Then: integrity が sha384 で指定され、crossOrigin="anonymous" が付いている
  assert.match(
    tag,
    /integrity="sha384-[A-Za-z0-9+/]{64}"/,
    'sha384 の SRI がある',
  )
  assert.match(tag, /crossOrigin="anonymous"/, 'crossOrigin="anonymous" がある')
})

test('ArticleContent: 旧版 katex@0.16 の CSS を残していない', () => {
  // Given/When/Then: 0.16 系の CSS を読む URL が残っていない
  assert.ok(!tsx.includes('katex@0.16'), 'katex@0.16 の URL を含まない')
})

// --- (3) GHSA-238p-pmpm-9mq7 の回帰 ---

test('katex: Object.prototype.trust を汚染されても \\href を描画しない', () => {
  // Given: 本番と同じ katex と、汚染された Object.prototype
  const katex = loadKatexViaRehypeKatex()
  const proto = Object.prototype as Record<string, unknown>
  proto.trust = true
  try {
    // When: trust を明示せずに \href を描画する
    const html = katex.renderToString('\\href{https://evil.example}{x}')
    // Then: リンク要素を出さない
    assert.ok(!html.includes('<a '), `<a> を出さない（実際: ${html}）`)
  } finally {
    delete proto.trust
  }
})

test('katex: trust: true を明示したときは \\href を描画する（正常な動き）', () => {
  // Given: 本番と同じ katex（Object.prototype は汚染しない）
  const katex = loadKatexViaRehypeKatex()
  // When: trust を明示して \href を描画する
  const html = katex.renderToString('\\href{https://example.com}{x}', {
    trust: true,
  })
  // Then: リンク要素を出す（修正で正規の trust 指定まで壊れていない）
  assert.ok(html.includes('<a '), `<a> を出す（実際: ${html}）`)
})

test('katex: trust を指定しないときは \\href を描画しない（既定値）', () => {
  // Given: 本番と同じ katex（Object.prototype は汚染しない）
  const katex = loadKatexViaRehypeKatex()
  // When: trust を指定せずに \href を描画する
  const html = katex.renderToString('\\href{https://example.com}{x}')
  // Then: リンク要素を出さない
  assert.ok(!html.includes('<a '), `<a> を出さない（実際: ${html}）`)
})
