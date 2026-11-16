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
//
// Issue #351: GET は Issue を作るため、探し方が変わって見つからなくなると同じ題の
// Issue が増える。GET の describe で「探す → 無ければ 1 回だけ作る」流れを固定する。

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
// likeIssueTitle / LIKES_ISSUE_LABEL を提供し、octokit の戻り値と失敗を fixture から切り替え、
// 呼び出しを method と args の組で fixture.calls に記録する。
// issuesAfterCreate は「作成に失敗している間に、別のリクエストが同じ Issue を作った」状況を表す。
// updateError は「いいね数を Issue に書き込む段で GitHub が失敗した」状況を表す（Issue #356）。
const GITHUB_LIKES_MOCK_CODE = `
export const LIKES_ISSUE_LABEL = 'blog-likes'
export const likeIssueTitle = (articleId) => 'likes-' + articleId
export const parseLikeCount = (body) => {
  const n = parseInt(String(body).trim(), 10)
  return isNaN(n) ? 0 : n
}
const record = (method, args) => {
  const f = globalThis.__LIKES_FIXTURE__
  f.calls.push({ method, args })
  return f
}
export const octokit = {
  issues: {
    listForRepo: async (args) => {
      const f = record('issues.listForRepo', args)
      if (f.throwError) throw new Error('github boom')
      return { data: f.issues }
    },
    create: async (args) => {
      const f = record('issues.create', args)
      if (f.createError) {
        if (f.issuesAfterCreate) f.issues = f.issuesAfterCreate
        throw f.createError
      }
      return { data: f.createdIssue }
    },
    get: async (args) => {
      const f = record('issues.get', args)
      if (f.getError) throw f.getError
      return { data: f.getIssue }
    },
    update: async (args) => {
      const f = record('issues.update', args)
      if (f.updateError) throw f.updateError
      return { data: {} }
    },
  },
  search: {
    issuesAndPullRequests: async (args) => {
      const f = record('search.issuesAndPullRequests', args)
      if (f.searchError) throw f.searchError
      return { data: { items: f.searchItems } }
    },
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

// route.tsx は GITHUB_OWNER / GITHUB_REPO をモジュール読み込み時に確定するため、env を先に設定する。
const setupRoute = async () => {
  process.env.GITHUB_TOKEN = 'test-token'
  process.env.GITHUB_OWNER = 'test-owner'
  process.env.GITHUB_REPO = 'test-repo'
  return loadModule()
}

const cleanupBuildFiles = () => {
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
}

const argsOf = (fixture, method) =>
  fixture.calls.filter((c) => c.method === method).map((c) => c.args)

describe('api/likes/route.tsx POST（Issue #158: 入力検証 + レート制限）', () => {
  let POST

  // articleId / liked は本来の位置（request body の root）から渡す。allow でレート制限を制御する。
  const callPost = async (body, fixture) => {
    globalThis.__LIKES_FIXTURE__ = {
      issues: [{ title: 'likes-hello-world', number: 3, body: '5' }],
      searchItems: [],
      allow: true,
      throwError: false,
      calls: [],
      ...fixture,
    }
    const request =
      body === '__BAD_JSON__'
        ? {
            json: async () => {
              throw new Error('invalid json')
            },
            headers: new Headers(),
          }
        : { json: async () => body, headers: new Headers() }
    const response = await POST(request)
    return {
      status: response.status,
      body: await response.json(),
      fixture: globalThis.__LIKES_FIXTURE__,
    }
  }

  before(async () => {
    const mod = await setupRoute()
    POST = mod.POST
  })

  after(cleanupBuildFiles)

  it('POST が関数としてエクスポートされている', () => {
    assert.equal(typeof POST, 'function')
  })

  it('liked=true・許可時はいいねを +1 して 200 を返す', async () => {
    // Given: 現在 5 いいね、レート制限は許可
    // When: liked=true を投稿する
    // Then: 200 で likeCount:6、Issue 3 の body を '6' に 1 回だけ更新する
    const { status, body, fixture } = await callPost(
      { articleId: 'hello-world', liked: true },
      {},
    )
    assert.equal(status, 200)
    assert.equal(body.likeCount, 6)
    assert.equal(body.liked, true)
    assert.deepEqual(argsOf(fixture, 'issues.update'), [
      {
        owner: 'test-owner',
        repo: 'test-repo',
        issue_number: 3,
        body: '6',
      },
    ])
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
    assert.deepEqual(argsOf(fixture, 'issues.update'), [])
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
    assert.deepEqual(argsOf(fixture, 'issues.update'), [])
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
    assert.deepEqual(argsOf(fixture, 'issues.update'), [])
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

  it('0 いいねの取り消しは 0 のまま Issue を更新する（Issue #356）', async () => {
    // Given: 現在 0 いいね
    // When: liked=false を投稿する
    // Then: 200 で likeCount:0、Issue 3 の body を '0' に 1 回だけ更新する（負にしない）
    const { status, body, fixture } = await callPost(
      { articleId: 'hello-world', liked: false },
      { issues: [{ title: 'likes-hello-world', number: 3, body: '0' }] },
    )
    assert.equal(status, 200)
    assert.equal(body.likeCount, 0)
    assert.deepEqual(argsOf(fixture, 'issues.update'), [
      {
        owner: 'test-owner',
        repo: 'test-repo',
        issue_number: 3,
        body: '0',
      },
    ])
  })

  it('Issue の更新が失敗したら 500 を返す（Issue #356）', async () => {
    // Given: 現在 5 いいね、issues.update が例外を投げる
    // When: liked=true を投稿する
    // Then: 500 で更新失敗のメッセージを返す。更新は 1 回だけ試みる
    const { status, body, fixture } = await callPost(
      { articleId: 'hello-world', liked: true },
      { updateError: new Error('github boom') },
    )
    assert.equal(status, 500)
    assert.deepEqual(body, { error: 'いいね数の更新に失敗しました' })
    assert.equal(argsOf(fixture, 'issues.update').length, 1)
  })
})

describe('api/likes/route.tsx GET（Issue #351: 記事 ID の検査といいね数の取得）', () => {
  let GET

  const ARTICLE_QUERY = '?articleId=hello-world'
  const TARGET_TITLE = 'likes-hello-world'

  // articleId は本来の位置（query string）から渡す。fixture には GitHub 側の状態だけを書く。
  const callGet = async (query, fixture) => {
    globalThis.__LIKES_FIXTURE__ = {
      issues: [],
      searchItems: [],
      createdIssue: { number: 999 },
      throwError: false,
      calls: [],
      ...fixture,
    }
    const request = {
      url: 'http://localhost/api/likes' + query,
      headers: new Headers(),
    }
    const response = await GET(request)
    return {
      status: response.status,
      body: await response.json(),
      fixture: globalThis.__LIKES_FIXTURE__,
    }
  }

  before(async () => {
    const mod = await setupRoute()
    GET = mod.GET
  })

  after(cleanupBuildFiles)

  it('articleId が無ければ 400 を返し、octokit を呼ばない', async () => {
    // Given: query string に articleId が無い
    // When: GET を呼ぶ
    // Then: 400、GitHub へは 1 度も問い合わせない
    const { status, body, fixture } = await callGet('', {})
    assert.equal(status, 400)
    assert.equal(body.error, '記事IDが必要です')
    assert.deepEqual(fixture.calls, [])
  })

  it('articleId が空文字なら 400 を返し、octokit を呼ばない', async () => {
    // Given: articleId= の値が空
    // When: GET を呼ぶ
    // Then: 400、GitHub へは 1 度も問い合わせない
    const { status, body, fixture } = await callGet('?articleId=', {})
    assert.equal(status, 400)
    assert.equal(body.error, '記事IDが必要です')
    assert.deepEqual(fixture.calls, [])
  })

  it('一覧に同じ題の Issue があれば、その body の数と番号を 200 で返し、Issue を作らない', async () => {
    // Given: open の一覧に別記事と対象記事の Issue がある
    const issues = [
      { title: 'likes-other', number: 1, body: '9' },
      { title: TARGET_TITLE, number: 3, body: '5' },
    ]
    // When: 対象記事のいいね数を取得する
    const { status, body, fixture } = await callGet(ARTICLE_QUERY, { issues })
    // Then: ラベル blog-likes の open 一覧から探して対象記事の Issue の値を返し、
    //       Search API も作成も使わない
    assert.equal(status, 200)
    assert.deepEqual(body, {
      articleId: 'hello-world',
      likeCount: 5,
      issueNumber: 3,
    })
    assert.deepEqual(argsOf(fixture, 'issues.listForRepo'), [
      {
        owner: 'test-owner',
        repo: 'test-repo',
        labels: 'blog-likes',
        state: 'open',
        per_page: 100,
      },
    ])
    assert.deepEqual(argsOf(fixture, 'issues.create'), [])
    assert.deepEqual(argsOf(fixture, 'search.issuesAndPullRequests'), [])
  })

  it('一覧の Issue の body が数でなければ likeCount は 0', async () => {
    // Given: 対象記事の Issue の body が数でない
    const issues = [{ title: TARGET_TITLE, number: 3, body: 'abc' }]
    // When: いいね数を取得する
    const { status, body, fixture } = await callGet(ARTICLE_QUERY, { issues })
    // Then: 200 で likeCount 0、番号は一覧の Issue のもの、Issue は作らない
    assert.equal(status, 200)
    assert.equal(body.likeCount, 0)
    assert.equal(body.issueNumber, 3)
    assert.deepEqual(argsOf(fixture, 'issues.create'), [])
  })

  it('一覧の Issue の body が null なら likeCount は 0', async () => {
    // Given: 対象記事の Issue の body が null（GitHub は本文が空の Issue で null を返す）
    const issues = [{ title: TARGET_TITLE, number: 3, body: null }]
    // When: いいね数を取得する
    const { status, body, fixture } = await callGet(ARTICLE_QUERY, { issues })
    // Then: 200 で likeCount 0、Issue は作らない
    assert.equal(status, 200)
    assert.equal(body.likeCount, 0)
    assert.equal(body.issueNumber, 3)
    assert.deepEqual(argsOf(fixture, 'issues.create'), [])
  })

  it('一覧に無く Search API にあれば、issues.get で読んだ body の数を返し、Issue を作らない', async () => {
    // Given: 一覧は空、Search API の結果と issues.get の body が異なる
    const fixtureIn = {
      searchItems: [{ title: TARGET_TITLE, number: 7, body: '999' }],
      getIssue: { title: TARGET_TITLE, number: 7, body: '12' },
    }
    // When: いいね数を取得する
    const { status, body, fixture } = await callGet(ARTICLE_QUERY, fixtureIn)
    // Then: 題で Search API を引き、Search の body ではなく issues.get の body を使い、
    //       Issue は作らない
    assert.equal(status, 200)
    assert.deepEqual(body, {
      articleId: 'hello-world',
      likeCount: 12,
      issueNumber: 7,
    })
    assert.deepEqual(argsOf(fixture, 'search.issuesAndPullRequests')[0], {
      q: 'repo:test-owner/test-repo is:issue "likes-hello-world"',
      per_page: 10,
    })
    assert.deepEqual(
      argsOf(fixture, 'issues.get').map((a) => a.issue_number),
      [7],
    )
    assert.deepEqual(argsOf(fixture, 'issues.create'), [])
  })

  it('一覧の取得が失敗しても Search API にあれば、その Issue の数を返す', async () => {
    // Given: listForRepo が throw し、Search API には対象記事の Issue がある
    const fixtureIn = {
      throwError: true,
      searchItems: [{ title: TARGET_TITLE, number: 7, body: '12' }],
      getIssue: { title: TARGET_TITLE, number: 7, body: '12' },
    }
    // When: いいね数を取得する
    const { status, body, fixture } = await callGet(ARTICLE_QUERY, fixtureIn)
    // Then: 200 で Search API 側の Issue の数を返し、Issue は作らない
    assert.equal(status, 200)
    assert.equal(body.likeCount, 12)
    assert.equal(body.issueNumber, 7)
    assert.deepEqual(argsOf(fixture, 'issues.create'), [])
  })

  it('一覧にも Search API にも無ければ、題・body 0・ラベルを付けて Issue を 1 回だけ作る', async () => {
    // Given: 一覧も Search API も空、作成すると番号 42 が返る
    // When: いいね数を取得する
    const { fixture } = await callGet(ARTICLE_QUERY, {
      createdIssue: { number: 42 },
    })
    // Then: 決まった題・body・ラベルで 1 回だけ作る
    assert.deepEqual(argsOf(fixture, 'issues.create'), [
      {
        owner: 'test-owner',
        repo: 'test-repo',
        title: 'likes-hello-world',
        body: '0',
        labels: ['blog-likes'],
      },
    ])
  })

  it('一覧にも Search API にも無ければ、作った Issue の番号と likeCount 0 を 200 で返す', async () => {
    // Given: 一覧も Search API も空、作成すると番号 42 が返る
    // When: いいね数を取得する
    const { status, body } = await callGet(ARTICLE_QUERY, {
      createdIssue: { number: 42 },
    })
    // Then: 作った Issue の番号と likeCount 0
    assert.equal(status, 200)
    assert.deepEqual(body, {
      articleId: 'hello-world',
      likeCount: 0,
      issueNumber: 42,
    })
  })

  it('Issue の作成が失敗し、もう一度探すと見つかれば、その Issue の数を 200 で返す', async () => {
    // Given: 作成は失敗するが、その間に別のリクエストが同じ題の Issue を作っている
    const fixtureIn = {
      createError: new Error('Validation Failed'),
      issuesAfterCreate: [{ title: TARGET_TITLE, number: 11, body: '4' }],
    }
    // When: いいね数を取得する
    const { status, body, fixture } = await callGet(ARTICLE_QUERY, fixtureIn)
    // Then: 見つけた Issue の値を返し、作成は 1 回だけ試す
    assert.equal(status, 200)
    assert.deepEqual(body, {
      articleId: 'hello-world',
      likeCount: 4,
      issueNumber: 11,
    })
    assert.equal(argsOf(fixture, 'issues.create').length, 1)
  })

  it('Issue の作成が失敗し、もう一度探しても無ければ 500 を返す', async () => {
    // Given: 作成は失敗し、その後も一覧・Search API は空のまま
    const fixtureIn = { createError: new Error('Validation Failed') }
    // When: いいね数を取得する
    const { status, body, fixture } = await callGet(ARTICLE_QUERY, fixtureIn)
    // Then: 500、作成を繰り返さない
    assert.equal(status, 500)
    assert.equal(body.error, 'いいね数の取得に失敗しました')
    assert.equal(argsOf(fixture, 'issues.create').length, 1)
  })
})
