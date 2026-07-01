// Issue #158 / TDD 先行: likes POST の配線（入力検証 → レート制限 → 更新）を検証する結合テスト。
//
// 対象データフロー（計画 §4.3）: request.json → articleId/liked 検証 → checkRateLimit → updateLike。
// 現行 POST は articleId 存在チェックのみで無制限に書込み可能。本テストは
// liked の boolean 検証と、新ステータス 429 が既存 200/400/500 フローへ合流する配線を固定する。
//
// route は ./githubLikes 経由で octokit に依存する。既存 likes/bulk/route.test.mjs に倣い
// transpile + import 張り替え方式（node:test + typescript のみ、新規パッケージ無し）を用い、
// githubLikes・checkRateLimit・getClientIP・next/server を境界でモックする。
//
// 実行: `node --test src/app/api/likes/route.test.mjs`
// 実装前は route が未配線のため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROUTE_SRC = path.join(__dirname, 'route.tsx')

const ROUTE_BUILD = path.join(__dirname, '.route.test-build.mjs')
const GITHUB_LIKES_MOCK = path.join(__dirname, '.githubLikes.test-mock.mjs')
const NEXT_MOCK = path.join(__dirname, '.next-server.test-mock.mjs')
const CLIENTIP_MOCK = path.join(__dirname, '.clientIp.test-mock.mjs')
const RATELIMIT_MOCK = path.join(__dirname, '.rateLimit.test-mock.mjs')

// githubLikes をまるごとモックする。route が使う octokit / parseLikeCount /
// likeIssueTitle / LIKES_ISSUE_LABEL を提供し、issues データと更新呼び出しを fixture に記録する。
const GITHUB_LIKES_MOCK_CODE = `
export const LIKES_ISSUE_LABEL = 'blog-likes'
export const likeIssueTitle = (articleId) => 'likes-' + articleId
export const parseLikeCount = (body) => {
  const n = parseInt(String(body).trim(), 10)
  return isNaN(n) ? 0 : n
}
const fx = () => globalThis.__LIKES_FIXTURE__
export const octokit = {
  issues: {
    listForRepo: async () => {
      const f = fx()
      if (f.throwError) throw new Error('github boom')
      return { data: f.issues }
    },
    create: async () => {
      const f = fx()
      f.createCalls = (f.createCalls || 0) + 1
      return { data: { number: 999 } }
    },
    get: async () => ({ data: {} }),
    update: async (args) => {
      const f = fx()
      f.updateCalls = (f.updateCalls || 0) + 1
      f.updateArgs = args
      return { data: {} }
    },
  },
  search: {
    issuesAndPullRequests: async () => ({ data: { items: [] } }),
  },
}
`

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

const CLIENTIP_MOCK_CODE = `
export function getClientIP() { return '203.0.113.5' }
`

const RATELIMIT_MOCK_CODE = `
export const RATE_LIMITS = {
  likes: { max: 30, windowSeconds: 60 },
  highscore: { max: 10, windowSeconds: 60 },
}
export async function checkRateLimit(ip, endpoint) {
  const f = globalThis.__LIKES_FIXTURE__
  f.rateLimitArgs = { ip, endpoint }
  return f.allow
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
  fs.writeFileSync(GITHUB_LIKES_MOCK, GITHUB_LIKES_MOCK_CODE)
  fs.writeFileSync(NEXT_MOCK, NEXT_MOCK_CODE)
  fs.writeFileSync(CLIENTIP_MOCK, CLIENTIP_MOCK_CODE)
  fs.writeFileSync(RATELIMIT_MOCK, RATELIMIT_MOCK_CODE)

  const routeCode = transpile(ROUTE_SRC)
    .replaceAll('next/server', toRel(NEXT_MOCK))
    .replaceAll('./githubLikes', toRel(GITHUB_LIKES_MOCK))
    .replaceAll('../utils/clientIp', toRel(CLIENTIP_MOCK))
    .replaceAll('../utils/rateLimit', toRel(RATELIMIT_MOCK))
  fs.writeFileSync(ROUTE_BUILD, routeCode)

  return import(`${ROUTE_BUILD}?t=${process.pid}`)
}

describe('api/likes/route.tsx POST（Issue #158: 入力検証 + レート制限）', () => {
  let POST

  // articleId / liked は本来の位置（request body の root）から渡す。allow でレート制限を制御する。
  const callPost = async (body, fixture) => {
    globalThis.__LIKES_FIXTURE__ = {
      issues: [{ title: 'likes-hello-world', number: 3, body: '5' }],
      allow: true,
      createCalls: 0,
      updateCalls: 0,
      throwError: false,
      ...fixture,
    }
    const request =
      body === '__BAD_JSON__'
        ? { json: async () => { throw new Error('invalid json') }, headers: new Headers() }
        : { json: async () => body, headers: new Headers() }
    const response = await POST(request)
    return {
      status: response.status,
      body: await response.json(),
      fixture: globalThis.__LIKES_FIXTURE__,
    }
  }

  before(async () => {
    process.env.GITHUB_TOKEN = 'test-token'
    process.env.GITHUB_OWNER = 'test-owner'
    process.env.GITHUB_REPO = 'test-repo'
    const mod = await loadModule()
    POST = mod.POST
  })

  after(() => {
    delete globalThis.__LIKES_FIXTURE__
    for (const f of [
      ROUTE_BUILD,
      GITHUB_LIKES_MOCK,
      NEXT_MOCK,
      CLIENTIP_MOCK,
      RATELIMIT_MOCK,
    ]) {
      if (fs.existsSync(f)) fs.rmSync(f)
    }
  })

  it('POST が関数としてエクスポートされている', () => {
    assert.equal(typeof POST, 'function')
  })

  it('liked=true・許可時はいいねを +1 して 200 を返す', async () => {
    // Given: 現在 5 いいね、レート制限は許可
    // When: liked=true を投稿する
    // Then: 200 で likeCount:6、Issue が更新される
    const { status, body, fixture } = await callPost(
      { articleId: 'hello-world', liked: true },
      {},
    )
    assert.equal(status, 200)
    assert.equal(body.likeCount, 6)
    assert.equal(body.liked, true)
    assert.equal(fixture.updateCalls, 1)
  })

  it('liked=false・許可時はいいねを -1 して 200 を返す', async () => {
    // Given: 現在 5 いいね
    // When: liked=false を投稿する
    // Then: 200 で likeCount:4
    const { status, body } = await callPost(
      { articleId: 'hello-world', liked: false },
      {},
    )
    assert.equal(status, 200)
    assert.equal(body.likeCount, 4)
  })

  it('articleId が欠落していれば 400（更新しない）', async () => {
    // Given: articleId 無し
    // Then: 400、Issue は更新されない
    const { status, fixture } = await callPost({ liked: true }, {})
    assert.equal(status, 400)
    assert.equal(fixture.updateCalls, 0)
  })

  it('liked が boolean でなければ 400（改ざん入力の拒否）', async () => {
    // Given: liked が文字列
    // When: 投稿する
    // Then: 400、Issue は更新されない
    const { status, fixture } = await callPost(
      { articleId: 'hello-world', liked: 'true' },
      {},
    )
    assert.equal(status, 400)
    assert.equal(fixture.updateCalls, 0)
  })

  it('liked が欠落していれば 400', async () => {
    // Given: liked 無し
    // Then: 400
    const { status } = await callPost({ articleId: 'hello-world' }, {})
    assert.equal(status, 400)
  })

  it('レート制限に達したら 429（有効入力でも書込みしない）', async () => {
    // Given: 有効入力だがレート制限が拒否
    // When: 投稿する
    // Then: 429、Issue は更新されない
    const { status, fixture } = await callPost(
      { articleId: 'hello-world', liked: true },
      { allow: false },
    )
    assert.equal(status, 429)
    assert.equal(fixture.updateCalls, 0)
  })

  it('レート制限は likes endpoint で判定される', async () => {
    // Given: 有効入力の投稿
    // When: 投稿する
    // Then: checkRateLimit は endpoint='likes' で呼ばれる
    const { fixture } = await callPost(
      { articleId: 'hello-world', liked: true },
      {},
    )
    assert.equal(fixture.rateLimitArgs.endpoint, 'likes')
  })

  it('不正な JSON ボディは 400', async () => {
    // Given: request.json() が throw する不正ボディ
    // Then: 400（500 でクラッシュさせない）
    const { status } = await callPost('__BAD_JSON__', {})
    assert.equal(status, 400)
  })
})
