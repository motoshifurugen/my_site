// Issue #158 / TDD 先行: highscore POST の配線（検証 → レート制限 → 更新）を検証する結合テスト。
//
// 対象データフロー（計画 §4.3）: request.json → isValidScore → checkRateLimit → getHighScore/setHighScore。
// 3 モジュール以上（route + scoreValidation + rateLimit + clientIp + octokit）を横断し、
// 新ステータス 429 が既存 200/400/500 フローに合流するため結合テストを作成する。
//
// scoreValidation は実物をトランスパイルして通し（検証ロジックを end-to-end で検証）、
// octokit・checkRateLimit・getClientIP は境界でモックする。既存 likes/bulk/route.test.mjs と
// 同じ transpile + import 張り替え方式（node:test + typescript のみ、新規パッケージ無し）。
//
// 実行: `node --test src/app/api/highscore/route.test.mjs`
// 実装前は route/scoreValidation/utils が未配線のため RED、実装後に GREEN を期待する。
//
// Issue #352: GET は Issue を作るため、探し方が変わって見つからなくなると同じ題の
// Issue が増える。GET の describe で「探す → 無ければ 1 回だけ作る」流れを固定する。

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROUTE_SRC = path.join(__dirname, 'route.tsx')
const SCORE_VALIDATION_SRC = path.join(__dirname, 'scoreValidation.ts')

const ROUTE_BUILD = path.join(__dirname, '.route.test-build.mjs')
const SCORE_VALIDATION_BUILD = path.join(
  __dirname,
  '.scoreValidation.test-build.mjs',
)
const OCTOKIT_MOCK = path.join(__dirname, '.octokit.test-mock.mjs')
const NEXT_MOCK = path.join(__dirname, '.next-server.test-mock.mjs')
const CLIENTIP_MOCK = path.join(__dirname, '.clientIp.test-mock.mjs')
const RATELIMIT_MOCK = path.join(__dirname, '.rateLimit.test-mock.mjs')

const OCTOKIT_MOCK_CODE = `
export class Octokit {
  constructor() {
    const fx = () => globalThis.__HIGHSCORE_FIXTURE__
    this.issues = {
      listForRepo: async (args) => {
        const f = fx()
        f.listForRepoCalls = (f.listForRepoCalls || 0) + 1
        f.listForRepoArgs = args
        if (f.throwError) throw new Error('github boom')
        return { data: f.issues }
      },
      create: async (args) => {
        const f = fx()
        f.createArgs.push(args)
        return { data: { number: 999 } }
      },
      update: async (args) => {
        const f = fx()
        f.updateCalls = (f.updateCalls || 0) + 1
        f.updateArgs = args
        return { data: {} }
      },
    }
  }
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

// checkRateLimit の戻り値をグローバル fixture から制御する。
const RATELIMIT_MOCK_CODE = `
export const RATE_LIMITS = {
  likes: { max: 30, windowSeconds: 60 },
  highscore: { max: 10, windowSeconds: 60 },
}
export async function checkRateLimit(ip, endpoint) {
  const f = globalThis.__HIGHSCORE_FIXTURE__
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
  fs.writeFileSync(OCTOKIT_MOCK, OCTOKIT_MOCK_CODE)
  fs.writeFileSync(NEXT_MOCK, NEXT_MOCK_CODE)
  fs.writeFileSync(CLIENTIP_MOCK, CLIENTIP_MOCK_CODE)
  fs.writeFileSync(RATELIMIT_MOCK, RATELIMIT_MOCK_CODE)

  // scoreValidation は実物を通す（外部依存なし）。
  fs.writeFileSync(SCORE_VALIDATION_BUILD, transpile(SCORE_VALIDATION_SRC))

  const routeCode = transpile(ROUTE_SRC)
    .replaceAll('next/server', toRel(NEXT_MOCK))
    .replaceAll('@octokit/rest', toRel(OCTOKIT_MOCK))
    .replaceAll('./scoreValidation', toRel(SCORE_VALIDATION_BUILD))
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
  delete globalThis.__HIGHSCORE_FIXTURE__
  for (const f of [
    ROUTE_BUILD,
    SCORE_VALIDATION_BUILD,
    OCTOKIT_MOCK,
    NEXT_MOCK,
    CLIENTIP_MOCK,
    RATELIMIT_MOCK,
  ]) {
    if (fs.existsSync(f)) fs.rmSync(f)
  }
}

describe('api/highscore/route.tsx POST（Issue #158: 検証 + レート制限）', () => {
  let POST

  // score は本来の位置（request body の root）から渡す。allow でレート制限を制御する。
  const callPost = async (body, fixture) => {
    globalThis.__HIGHSCORE_FIXTURE__ = {
      issues: [{ title: 'highscore-game', number: 7, body: '100' }],
      allow: true,
      listForRepoCalls: 0,
      createArgs: [],
      updateCalls: 0,
      throwError: false,
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
      fixture: globalThis.__HIGHSCORE_FIXTURE__,
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

  it('現在値より高い有効スコアは更新され 200 { updated:true } を返す', async () => {
    // Given: 現在の最高スコア 100、レート制限は許可
    // When: 200 を投稿する
    // Then: 200 で updated:true / highScore:200、Issue が更新される
    const { status, body, fixture } = await callPost({ score: 200 }, {})
    assert.equal(status, 200)
    assert.equal(body.updated, true)
    assert.equal(body.highScore, 200)
    assert.equal(fixture.updateCalls, 1)
  })

  it('現在値以下の有効スコアは更新されず 200 { updated:false } を返す', async () => {
    // Given: 現在の最高スコア 100
    // When: 50 を投稿する
    // Then: 200 で updated:false / highScore:100、Issue は更新されない
    const { status, body, fixture } = await callPost({ score: 50 }, {})
    assert.equal(status, 200)
    assert.equal(body.updated, false)
    assert.equal(body.highScore, 100)
    assert.equal(fixture.updateCalls, 0)
  })

  it('Infinity は 400（typeof の穴を塞ぐ）', async () => {
    // Given: score=Infinity（typeof は number）
    // When: 投稿する
    // Then: 400 で更新されない
    const { status, fixture } = await callPost({ score: Infinity }, {})
    assert.equal(status, 400)
    assert.equal(fixture.updateCalls, 0)
  })

  it('負値は 400', async () => {
    // Given: score=-5
    // Then: 400
    const { status } = await callPost({ score: -5 }, {})
    assert.equal(status, 400)
  })

  it('巨大値は 400', async () => {
    // Given: 明らかな偽装の巨大値
    // Then: 400
    const { status } = await callPost({ score: 1e12 }, {})
    assert.equal(status, 400)
  })

  it('数値でない score は 400', async () => {
    // Given: score が文字列（改ざん）
    // Then: 400
    const { status } = await callPost({ score: '200' }, {})
    assert.equal(status, 400)
  })

  it('score が欠落していれば 400', async () => {
    // Given: body に score 無し
    // Then: 400
    const { status } = await callPost({}, {})
    assert.equal(status, 400)
  })

  it('レート制限に達したら 429（有効スコアでも書込みしない）', async () => {
    // Given: 有効スコア 200 だがレート制限が拒否
    // When: 投稿する
    // Then: 429、Issue は更新されない
    const { status, fixture } = await callPost({ score: 200 }, { allow: false })
    assert.equal(status, 429)
    assert.equal(fixture.updateCalls, 0)
  })

  it('レート制限は highscore endpoint で判定される', async () => {
    // Given: 有効スコアの投稿
    // When: 投稿する
    // Then: checkRateLimit は endpoint='highscore' で呼ばれる
    const { fixture } = await callPost({ score: 200 }, {})
    assert.equal(fixture.rateLimitArgs.endpoint, 'highscore')
  })

  it('不正な JSON ボディは 400', async () => {
    // Given: request.json() が throw する不正ボディ
    // Then: 400（500 でクラッシュさせない）
    const { status } = await callPost('__BAD_JSON__', {})
    assert.equal(status, 400)
  })
})

describe('api/highscore/route.tsx GET（Issue #352: 最高スコアの取得）', () => {
  let GET

  // GET は request を読まない。fixture には GitHub 側の状態だけを書く。
  const callGet = async (fixture) => {
    globalThis.__HIGHSCORE_FIXTURE__ = {
      issues: [],
      createArgs: [],
      throwError: false,
      ...fixture,
    }
    const response = await GET({ headers: new Headers() })
    return {
      status: response.status,
      body: await response.json(),
      fixture: globalThis.__HIGHSCORE_FIXTURE__,
    }
  }

  before(async () => {
    const mod = await setupRoute()
    GET = mod.GET
  })

  after(cleanupBuildFiles)

  it('GET が関数としてエクスポートされている', () => {
    assert.equal(typeof GET, 'function')
  })

  it('題が highscore-game の Issue があれば、body の数と番号を 200 で返し、Issue を作らない', async () => {
    // Given: 一覧に題の違う Issue と highscore-game の Issue がある
    const issues = [
      { title: 'other-title', number: 5, body: '300' },
      { title: 'highscore-game', number: 7, body: '100' },
    ]
    // When: 最高スコアを取得する
    const { status, body, fixture } = await callGet({ issues })
    // Then: highscore-game の Issue の値を返し、Issue は作らない
    assert.equal(status, 200)
    assert.deepEqual(body, { highScore: 100, issueNumber: 7 })
    assert.deepEqual(fixture.createArgs, [])
  })

  it('ラベル highscore の open の Issue を、env の owner と repo で 1 回だけ探す', async () => {
    // Given: 一覧に highscore-game の Issue がある
    const issues = [{ title: 'highscore-game', number: 7, body: '100' }]
    // When: 最高スコアを取得する
    const { fixture } = await callGet({ issues })
    // Then: 決まった owner・repo・ラベル・state で 1 回だけ一覧を取る
    assert.equal(fixture.listForRepoCalls, 1)
    assert.deepEqual(fixture.listForRepoArgs, {
      owner: 'test-owner',
      repo: 'test-repo',
      labels: 'highscore',
      state: 'open',
    })
  })

  it('highscore-game の Issue の body が数でなければ highScore は 0', async () => {
    // Given: highscore-game の Issue の body が数でない
    const issues = [{ title: 'highscore-game', number: 7, body: 'abc' }]
    // When: 最高スコアを取得する
    const { status, body, fixture } = await callGet({ issues })
    // Then: 200 で highScore 0、番号は一覧の Issue のもの、Issue は作らない
    assert.equal(status, 200)
    assert.deepEqual(body, { highScore: 0, issueNumber: 7 })
    assert.deepEqual(fixture.createArgs, [])
  })

  it('highscore-game の Issue の body が null なら highScore は 0', async () => {
    // Given: highscore-game の Issue の body が null（GitHub は本文が空の Issue で null を返す）
    const issues = [{ title: 'highscore-game', number: 7, body: null }]
    // When: 最高スコアを取得する
    const { status, body, fixture } = await callGet({ issues })
    // Then: 200 で highScore 0、Issue は作らない
    assert.equal(status, 200)
    assert.deepEqual(body, { highScore: 0, issueNumber: 7 })
    assert.deepEqual(fixture.createArgs, [])
  })

  it('同じラベルで題の違う Issue しか無ければ、それを使わずに Issue を作る', async () => {
    // Given: 一覧には題の違う Issue だけがある
    const issues = [{ title: 'other-title', number: 5, body: '300' }]
    // When: 最高スコアを取得する
    const { status, body, fixture } = await callGet({ issues })
    // Then: 題の違う Issue の番号と body を使わず、作った Issue の番号と highScore 0 を返す
    assert.equal(status, 200)
    assert.deepEqual(body, { highScore: 0, issueNumber: 999 })
    assert.equal(fixture.createArgs.length, 1)
  })

  it('Issue が無ければ、題 highscore-game・body 0・ラベル highscore で Issue を 1 回だけ作る', async () => {
    // Given: 一覧が空
    // When: 最高スコアを取得する
    const { fixture } = await callGet({ issues: [] })
    // Then: 決まった題・body・ラベルで 1 回だけ作る
    assert.deepEqual(fixture.createArgs, [
      {
        owner: 'test-owner',
        repo: 'test-repo',
        title: 'highscore-game',
        body: '0',
        labels: ['highscore'],
      },
    ])
  })

  it('Issue が無ければ、作った Issue の番号と highScore 0 を 200 で返す', async () => {
    // Given: 一覧が空、作成するとモックは番号 999 を返す
    // When: 最高スコアを取得する
    const { status, body } = await callGet({ issues: [] })
    // Then: 作った Issue の番号と highScore 0
    assert.equal(status, 200)
    assert.deepEqual(body, { highScore: 0, issueNumber: 999 })
  })

  it('listForRepo が例外を投げたら 500 とエラーメッセージを返し、Issue を作らない', async () => {
    // Given: listForRepo が throw する
    // When: 最高スコアを取得する
    const { status, body, fixture } = await callGet({ throwError: true })
    // Then: 500 で決まったエラーメッセージ、Issue は作らない
    assert.equal(status, 500)
    assert.deepEqual(body, { error: '最高スコアの取得に失敗しました' })
    assert.deepEqual(fixture.createArgs, [])
  })
})
