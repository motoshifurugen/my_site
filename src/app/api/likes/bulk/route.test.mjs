// api/likes/bulk/route.tsx のバルク取得契約を検証する単体テスト（Issue #166 / TDD 先行）。
//
// #166 は記事一覧のいいね数取得を「カード1枚ごとの N+1 client fetch」から
// 「slug 配列で1リクエストにまとめるバルクエンドポイント」へ移す変更。
// 本テストは新規ルート GET /api/likes/bulk?articleIds=slug1,slug2,... の契約を固定する:
//   - レスポンスは { likes: { [slug]: number } } エンベロープ
//   - 要求された slug のみを含み、存在しない slug は 0
//   - GitHub への問い合わせ（listForRepo）は要求件数に依らず 1 回（サーバ側 N+1 を作らない）
//   - 読み取り専用（一覧表示で Issue を量産しない＝ issues.create を呼ばない）
//   - articleIds 未指定 → 400 / GitHub 例外 → 500
//
// 既存の tanka/route.test.mjs と同様に、Node 組み込み node:test と devDependency の
// typescript のみで構成する（新規パッケージ無し）。route は githubLikes.ts 経由で
// @octokit/rest に依存するため、route.tsx と githubLikes.ts をインメモリで JS へ
// トランスパイルし、@octokit/rest・next/server の import 指定子をハーミティックな
// モックへ張り替えて動的 import する。
//
// 実行: プロジェクトルートで `node --test src/app/api/likes/bulk/route.test.mjs`
// 実装前は route/githubLikes が未作成のため import エラーで RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROUTE_SRC = path.join(__dirname, 'route.tsx')
const GITHUB_LIKES_SRC = path.join(__dirname, '..', 'githubLikes.ts')

const ROUTE_BUILD = path.join(__dirname, '.route.test-build.mjs')
const GITHUB_LIKES_BUILD = path.join(__dirname, '.githubLikes.test-build.mjs')
const OCTOKIT_MOCK = path.join(__dirname, '.octokit.test-mock.mjs')
const NEXT_MOCK = path.join(__dirname, '.next-server.test-mock.mjs')

// @octokit/rest のモック。listForRepo / create の呼び出し回数をグローバル fixture へ記録する。
// fixture を差し替えることで issues データと例外を制御する。
const OCTOKIT_MOCK_CODE = `
export class Octokit {
  constructor() {
    const fx = () => globalThis.__LIKES_BULK_FIXTURE__
    this.issues = {
      listForRepo: async () => {
        const f = fx()
        f.listForRepoCalls = (f.listForRepoCalls || 0) + 1
        if (f.throwError) throw new Error('github boom')
        return { data: f.issues }
      },
      create: async () => {
        const f = fx()
        f.createCalls = (f.createCalls || 0) + 1
        return { data: { number: 1 } }
      },
      get: async () => ({ data: {} }),
      update: async () => ({ data: {} }),
    }
    this.search = {
      issuesAndPullRequests: async () => ({ data: { items: [] } }),
    }
  }
}
`

// next/server のモック。route は実行時 NextResponse.json(body, init) のみ使用する。
const NEXT_MOCK_CODE = `
export class NextRequest {}
export const NextResponse = {
  json(body, init) {
    return {
      status: (init && init.status) || 200,
      async json() { return body },
    }
  },
}
`

const transpile = (srcPath) =>
  ts.transpileModule(fs.readFileSync(srcPath, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText

const toRel = (target) =>
  './' + path.relative(__dirname, target).split(path.sep).join('/')

const loadModule = async () => {
  fs.writeFileSync(OCTOKIT_MOCK, OCTOKIT_MOCK_CODE)
  fs.writeFileSync(NEXT_MOCK, NEXT_MOCK_CODE)

  // githubLikes（@octokit/rest 依存）をモックへ張り替えて出力。
  const githubLikesCode = transpile(GITHUB_LIKES_SRC).replaceAll(
    '@octokit/rest',
    toRel(OCTOKIT_MOCK),
  )
  fs.writeFileSync(GITHUB_LIKES_BUILD, githubLikesCode)

  // route（next/server と ../githubLikes 依存）を張り替えて出力。
  const routeCode = transpile(ROUTE_SRC)
    .replaceAll('next/server', toRel(NEXT_MOCK))
    .replaceAll('../githubLikes', toRel(GITHUB_LIKES_BUILD))
  fs.writeFileSync(ROUTE_BUILD, routeCode)

  return import(`${ROUTE_BUILD}?t=${process.pid}`)
}

describe('api/likes/bulk/route.tsx GET（Issue #166: バルク取得契約）', () => {
  let GET

  // articleIds は本来の位置（クエリパラメータ）から渡す。fixture で issues / 例外を制御する。
  const callGet = async (query, fixture) => {
    globalThis.__LIKES_BULK_FIXTURE__ = {
      issues: [],
      listForRepoCalls: 0,
      createCalls: 0,
      throwError: false,
      ...fixture,
    }
    const request = { url: `http://localhost/api/likes/bulk${query}` }
    const response = await GET(request)
    return {
      status: response.status,
      body: await response.json(),
      fixture: globalThis.__LIKES_BULK_FIXTURE__,
    }
  }

  const issuesFixture = [
    { title: 'likes-hello-world', body: '5' },
    { title: 'likes-second-post', body: '12' },
    { title: 'likes-bad-body', body: 'not-a-number' },
    { title: 'some-unrelated-issue', body: '99' },
  ]

  before(async () => {
    process.env.GITHUB_TOKEN = 'test-token'
    process.env.GITHUB_OWNER = 'test-owner'
    process.env.GITHUB_REPO = 'test-repo'
    const mod = await loadModule()
    GET = mod.GET
  })

  after(() => {
    delete globalThis.__LIKES_BULK_FIXTURE__
    for (const f of [ROUTE_BUILD, GITHUB_LIKES_BUILD, OCTOKIT_MOCK, NEXT_MOCK]) {
      if (fs.existsSync(f)) fs.rmSync(f)
    }
  })

  it('GET が関数としてエクスポートされている', () => {
    assert.equal(typeof GET, 'function')
  })

  it('成功時は { likes } エンベロープを返す', async () => {
    // Given: 既存の blog-likes Issue 群
    // When: 1 件の articleId を要求する
    // Then: status 200 で likes(オブジェクト) を持つ
    const { status, body } = await callGet('?articleIds=hello-world', {
      issues: issuesFixture,
    })
    assert.equal(status, 200)
    assert.equal(typeof body.likes, 'object')
  })

  it('要求した複数 slug のいいね数をマップで返す', async () => {
    // Given: hello-world=5 / second-post=12 の Issue
    // When: 2 slug を要求する
    // Then: それぞれの件数が返る
    const { body } = await callGet('?articleIds=hello-world,second-post', {
      issues: issuesFixture,
    })
    assert.equal(body.likes['hello-world'], 5)
    assert.equal(body.likes['second-post'], 12)
  })

  it('存在しない slug は 0 を返す', async () => {
    // Given: missing-post に対応する Issue は存在しない
    // When: missing-post を要求する
    // Then: 0 が返る
    const { body } = await callGet('?articleIds=missing-post', {
      issues: issuesFixture,
    })
    assert.equal(body.likes['missing-post'], 0)
  })

  it('body が数値でない Issue は 0 として扱う', async () => {
    // Given: body='not-a-number' の Issue
    // When: その slug を要求する
    // Then: 0 が返る（parseLikeCount の NaN フォールバック）
    const { body } = await callGet('?articleIds=bad-body', {
      issues: issuesFixture,
    })
    assert.equal(body.likes['bad-body'], 0)
  })

  it('要求した slug のみを返す（無関係な Issue や非要求 slug を含めない）', async () => {
    // Given: 複数の Issue（うち1つは likes- 接頭辞でない無関係 Issue）
    // When: hello-world のみを要求する
    // Then: キーは hello-world だけ（second-post や unrelated は含まない）
    const { body } = await callGet('?articleIds=hello-world', {
      issues: issuesFixture,
    })
    assert.deepEqual(Object.keys(body.likes), ['hello-world'])
    assert.equal(body.likes['hello-world'], 5)
  })

  it('複数 slug を要求しても GitHub への問い合わせは 1 回だけ（サーバ側 N+1 を作らない）', async () => {
    // Given: 4 slug を要求する
    // When: GET を呼ぶ
    // Then: listForRepo は 1 回のみ呼ばれる
    const { fixture } = await callGet(
      '?articleIds=hello-world,second-post,bad-body,missing-post',
      { issues: issuesFixture },
    )
    assert.equal(fixture.listForRepoCalls, 1)
  })

  it('読み取り専用: 欠損 slug があっても Issue を新規作成しない', async () => {
    // Given: 存在しない slug を含む要求
    // When: GET を呼ぶ
    // Then: issues.create は呼ばれない（一覧表示で Issue を量産しない）
    const { fixture } = await callGet('?articleIds=missing-post', {
      issues: issuesFixture,
    })
    assert.equal(fixture.createCalls, 0)
  })

  it('articleIds 未指定なら 400 を返す', async () => {
    // Given: articleIds クエリ無し
    // When: GET を呼ぶ
    // Then: status 400
    const { status } = await callGet('', { issues: issuesFixture })
    assert.equal(status, 400)
  })

  it('articleIds が空文字なら 400 を返す', async () => {
    // Given: ?articleIds=（空）
    // When: GET を呼ぶ
    // Then: status 400
    const { status } = await callGet('?articleIds=', { issues: issuesFixture })
    assert.equal(status, 400)
  })

  it('GitHub 取得で例外が起きたら 500 を返す', async () => {
    // Given: listForRepo が例外を投げる
    // When: GET を呼ぶ
    // Then: status 500
    const { status } = await callGet('?articleIds=hello-world', {
      issues: issuesFixture,
      throwError: true,
    })
    assert.equal(status, 500)
  })
})
