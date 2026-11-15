// Issue #332: api/tanka-likes/route.tsx の入力検査と応答を固定する単体テスト。
//
// route は GET/POST で tweetId と liked を検査し、Supabase の tanka / tanka_likes を
// 読み書きする。検査を緩める変更が入ったら `npm test` が落ちるように、各分岐の status と応答を固定する。
// tanka/route.test.mjs と同じく route.tsx を typescript で JS へ変換し、
// @supabase/supabase-js・next/server・../utils/clientIp をモックへ張り替えて読み込む
// （node:test + typescript のみ。新しいパッケージ無し、本物の Supabase へつながない）。
//
// 実行: `node --import tsx --test src/app/api/tanka-likes/route.test.mjs`

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROUTE_SRC = path.join(__dirname, 'route.tsx')
const ROUTE_BUILD = path.join(__dirname, '.route.test-build.mjs')
const SUPABASE_MOCK = path.join(__dirname, '.supabase.test-mock.mjs')
const NEXT_MOCK = path.join(__dirname, '.next-server.test-mock.mjs')
const CLIENTIP_MOCK = path.join(__dirname, '.clientIp.test-mock.mjs')

const CLIENT_IP = '203.0.113.5'

// from() ごとに 1 件の呼び出し記録を作り、終端で op に応じた fixture を返す。
// count 取得・insert・delete は builder 自体を await するので、query を thenable にする。
// 想定外の op で await されたら reject し、route の呼び方が変わったことを検出する。
const SUPABASE_MOCK_CODE = `
export function createClient() {
  return {
    from(table) {
      const fx = globalThis.__TANKA_LIKES_TEST_FIXTURE__
      const call = { table, op: 'select', row: undefined, eqs: [] }
      fx.calls.push(call)
      const query = {
        select(_columns, options) {
          if (call.op === 'select') {
            call.op = options && options.head ? 'count' : 'select'
          }
          return query
        },
        insert(row) {
          call.op = 'insert'
          call.row = row
          return query
        },
        delete() {
          call.op = 'delete'
          return query
        },
        eq(column, value) {
          call.eqs.push([column, value])
          return query
        },
        maybeSingle() {
          return Promise.resolve(table === 'tanka' ? fx.tanka : fx.userLike)
        },
        then(resolve, reject) {
          const results = { count: fx.count, insert: fx.insert, delete: fx.delete }
          if (!(call.op in results)) {
            return Promise.reject(new Error('unexpected await: ' + call.op)).then(resolve, reject)
          }
          return Promise.resolve(results[call.op]).then(resolve, reject)
        },
      }
      return query
    },
  }
}
`

// route は NextResponse.json(body, init) だけを実行時に使う（NextRequest は型注釈のみ）。
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
export function getClientIP() { return '${CLIENT_IP}' }
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
  fs.writeFileSync(SUPABASE_MOCK, SUPABASE_MOCK_CODE)
  fs.writeFileSync(NEXT_MOCK, NEXT_MOCK_CODE)
  fs.writeFileSync(CLIENTIP_MOCK, CLIENTIP_MOCK_CODE)

  const code = transpile(ROUTE_SRC)
    .replaceAll('@supabase/supabase-js', toRel(SUPABASE_MOCK))
    .replaceAll('next/server', toRel(NEXT_MOCK))
    .replaceAll('../utils/clientIp', toRel(CLIENTIP_MOCK))
  fs.writeFileSync(ROUTE_BUILD, code)

  return import(`${ROUTE_BUILD}?t=${process.pid}`)
}

const setFixture = (overrides) => {
  globalThis.__TANKA_LIKES_TEST_FIXTURE__ = {
    count: { count: 3, error: null },
    userLike: { data: null, error: null },
    tanka: { data: { tweet_id: '123' }, error: null },
    insert: { data: [{}], error: null },
    delete: { error: null },
    calls: [],
    ...overrides,
  }
  return globalThis.__TANKA_LIKES_TEST_FIXTURE__
}

const callsOf = (fixture, op) => fixture.calls.filter((c) => c.op === op)

// Number へ変換すると精度が落ちる桁数。route が文字列のまま扱うかを確かめる。
const LONG_TWEET_ID = '1234567890123456789'

const INVALID_TWEET_IDS = [
  { label: '空', value: '' },
  { label: '数字以外を含む（12a）', value: '12a' },
  { label: '負号付き（-1）', value: '-1' },
  { label: '小数（1.5）', value: '1.5' },
]

const ENV_KEYS = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']

const withoutEnv = async (key, fn) => {
  const saved = process.env[key]
  delete process.env[key]
  try {
    await fn()
  } finally {
    process.env[key] = saved
  }
}

describe('api/tanka-likes/route.tsx（Issue #332: 入力検査と応答の固定）', () => {
  let GET
  let POST

  before(async () => {
    process.env.SUPABASE_URL = 'http://supabase.test'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
    const mod = await loadModule()
    GET = mod.GET
    POST = mod.POST
  })

  after(() => {
    delete globalThis.__TANKA_LIKES_TEST_FIXTURE__
    for (const f of [ROUTE_BUILD, SUPABASE_MOCK, NEXT_MOCK, CLIENTIP_MOCK]) {
      if (fs.existsSync(f)) fs.rmSync(f)
    }
  })

  describe('GET', () => {
    // tweetId は本来の位置（クエリパラメータ）から渡す。
    const callGet = async (query, overrides = {}) => {
      const fixture = setFixture(overrides)
      const request = {
        url: `http://localhost/api/tanka-likes${query}`,
        headers: new Headers(),
      }
      const response = await GET(request)
      return { status: response.status, body: await response.json(), fixture }
    }

    it('GET が関数としてエクスポートされている', () => {
      assert.equal(typeof GET, 'function')
    })

    it('tweetId が無いときは 400 を返し、Supabase を読まない', async () => {
      // Given: クエリに tweetId が無い
      // When: GET を呼ぶ
      // Then: status 400・error='tweetIdが必要です'・from() は呼ばれない
      const { status, body, fixture } = await callGet('')
      assert.equal(status, 400)
      assert.equal(body.error, 'tweetIdが必要です')
      assert.equal(fixture.calls.length, 0)
    })

    for (const { label, value } of INVALID_TWEET_IDS) {
      it(`tweetId が${label}のときは 400 を返し、Supabase を読まない`, async () => {
        // Given: 数字だけの文字列でない tweetId
        // When: GET を呼ぶ
        // Then: status 400・error='tweetIdが必要です'・from() は呼ばれない
        const query = `?tweetId=${encodeURIComponent(value)}`
        const { status, body, fixture } = await callGet(query)
        assert.equal(status, 400)
        assert.equal(body.error, 'tweetIdが必要です')
        assert.equal(fixture.calls.length, 0)
      })
    }

    for (const key of ENV_KEYS) {
      it(`${key} が無いときは 500 を返し、Supabase を読まない`, async () => {
        // Given: 環境変数の片方だけが欠けている
        // When: 正しい tweetId で GET を呼ぶ
        // Then: status 500・error='Supabase configuration is missing'
        await withoutEnv(key, async () => {
          const { status, body, fixture } = await callGet('?tweetId=123')
          assert.equal(status, 500)
          assert.equal(body.error, 'Supabase configuration is missing')
          assert.equal(fixture.calls.length, 0)
        })
      })
    }

    it('正しい tweetId で自分のいいねが無いときは isLiked=false を返す', async () => {
      // Given: いいね数 3・自分のいいね行は無い
      // When: GET を呼ぶ
      // Then: status 200・{ tweetId, likeCount: 3, isLiked: false }
      const { status, body } = await callGet('?tweetId=123', {
        count: { count: 3, error: null },
        userLike: { data: null, error: null },
      })
      assert.equal(status, 200)
      assert.deepEqual(body, { tweetId: '123', likeCount: 3, isLiked: false })
    })

    it('正しい tweetId で自分のいいねがあるときは isLiked=true を返す', async () => {
      // Given: いいね数 5・自分のいいね行がある
      // When: GET を呼ぶ
      // Then: status 200・{ tweetId, likeCount: 5, isLiked: true }
      const { status, body } = await callGet('?tweetId=123', {
        count: { count: 5, error: null },
        userLike: { data: { id: 1 }, error: null },
      })
      assert.equal(status, 200)
      assert.deepEqual(body, { tweetId: '123', likeCount: 5, isLiked: true })
    })

    it('tweetId を数値へ変換せず文字列のまま返す', async () => {
      // Given: Number にすると精度が落ちる 19 桁の tweetId
      // When: GET を呼ぶ
      // Then: 応答の tweetId は送った文字列と一致する
      const { status, body } = await callGet(`?tweetId=${LONG_TWEET_ID}`)
      assert.equal(status, 200)
      assert.equal(typeof body.tweetId, 'string')
      assert.equal(body.tweetId, LONG_TWEET_ID)
    })

    it('いいね数と自分のいいねを、tweetId とクライアント IP で絞り込んで読む', async () => {
      // Given: 正しい tweetId
      // When: GET を呼ぶ
      // Then: count は tweet_id で、自分のいいねは tweet_id と user_ip で絞り込む
      const { fixture } = await callGet(`?tweetId=${LONG_TWEET_ID}`)
      const [countCall] = callsOf(fixture, 'count')
      const [userLikeCall] = callsOf(fixture, 'select')
      assert.equal(countCall.table, 'tanka_likes')
      assert.deepEqual(countCall.eqs, [['tweet_id', LONG_TWEET_ID]])
      assert.equal(userLikeCall.table, 'tanka_likes')
      assert.deepEqual(userLikeCall.eqs, [
        ['tweet_id', LONG_TWEET_ID],
        ['user_ip', CLIENT_IP],
      ])
    })

    it('いいね数が null のときは likeCount=0 を返す', async () => {
      // Given: count が null
      // When: GET を呼ぶ
      // Then: likeCount は 0
      const { status, body } = await callGet('?tweetId=123', {
        count: { count: null, error: null },
      })
      assert.equal(status, 200)
      assert.equal(body.likeCount, 0)
    })

    it('いいね数の取得が error のときは 500 を返す', async () => {
      // Given: count 取得が error を返す
      // When: GET を呼ぶ
      // Then: status 500・error='いいね数の取得に失敗しました'
      const { status, body } = await callGet('?tweetId=123', {
        count: { count: null, error: { message: 'boom' } },
      })
      assert.equal(status, 500)
      assert.equal(body.error, 'いいね数の取得に失敗しました')
    })
  })

  describe('POST', () => {
    // tweetId / liked は本来の位置（request body の root）から渡す。
    const callPost = async (body, overrides = {}) => {
      const fixture = setFixture(overrides)
      const request = { json: async () => body, headers: new Headers() }
      const response = await POST(request)
      return { status: response.status, body: await response.json(), fixture }
    }

    it('POST が関数としてエクスポートされている', () => {
      assert.equal(typeof POST, 'function')
    })

    it('tweetId が無いときは 400 を返し、Supabase を読まない', async () => {
      // Given: body に tweetId が無い
      // When: POST を呼ぶ
      // Then: status 400・error='tweetIdが必要です'・from() は呼ばれない
      const { status, body, fixture } = await callPost({ liked: true })
      assert.equal(status, 400)
      assert.equal(body.error, 'tweetIdが必要です')
      assert.equal(fixture.calls.length, 0)
    })

    for (const { label, value } of INVALID_TWEET_IDS) {
      it(`tweetId が${label}のときは 400 を返し、Supabase を読まない`, async () => {
        // Given: 数字だけの文字列でない tweetId と正しい liked
        // When: POST を呼ぶ
        // Then: status 400・error='tweetIdが必要です'・from() は呼ばれない
        const { status, body, fixture } = await callPost({
          tweetId: value,
          liked: true,
        })
        assert.equal(status, 400)
        assert.equal(body.error, 'tweetIdが必要です')
        assert.equal(fixture.calls.length, 0)
      })
    }

    const INVALID_LIKED = [
      { label: '文字列 "true"', body: { tweetId: '123', liked: 'true' } },
      { label: '数値 1', body: { tweetId: '123', liked: 1 } },
      { label: '無い', body: { tweetId: '123' } },
    ]

    for (const { label, body: requestBody } of INVALID_LIKED) {
      it(`liked が${label}のときは 400 を返し、Supabase を読まない`, async () => {
        // Given: 正しい tweetId と boolean でない liked
        // When: POST を呼ぶ
        // Then: status 400・error='likedパラメータが必要です'・from() は呼ばれない
        const { status, body, fixture } = await callPost(requestBody)
        assert.equal(status, 400)
        assert.equal(body.error, 'likedパラメータが必要です')
        assert.equal(fixture.calls.length, 0)
      })
    }

    for (const key of ENV_KEYS) {
      it(`${key} が無いときは 500 を返し、Supabase を読まない`, async () => {
        // Given: 環境変数の片方だけが欠けている
        // When: 正しい body で POST を呼ぶ
        // Then: status 500・error='Supabase configuration is missing'
        await withoutEnv(key, async () => {
          const { status, body, fixture } = await callPost({
            tweetId: '123',
            liked: true,
          })
          assert.equal(status, 500)
          assert.equal(body.error, 'Supabase configuration is missing')
          assert.equal(fixture.calls.length, 0)
        })
      })
    }

    it('tanka に行が無いときは 404 を返し、いいねを書き込まない', async () => {
      // Given: tanka の存在確認が data=null を返す
      // When: liked=true で POST を呼ぶ
      // Then: status 404・error='指定された短歌が見つかりません'・insert しない
      const { status, body, fixture } = await callPost(
        { tweetId: '123', liked: true },
        { tanka: { data: null, error: null } },
      )
      assert.equal(status, 404)
      assert.equal(body.error, '指定された短歌が見つかりません')
      assert.equal(callsOf(fixture, 'insert').length, 0)
    })

    it('tanka の存在確認が error のときは 500 を返す', async () => {
      // Given: tanka の存在確認が error を返す
      // When: POST を呼ぶ
      // Then: status 500・error='短歌の確認に失敗しました'
      const { status, body } = await callPost(
        { tweetId: '123', liked: true },
        { tanka: { data: null, error: { message: 'boom' } } },
      )
      assert.equal(status, 500)
      assert.equal(body.error, '短歌の確認に失敗しました')
    })

    it('tanka の存在確認を tweet_id で絞り込む', async () => {
      // Given: 正しい body
      // When: POST を呼ぶ
      // Then: tanka テーブルを tweet_id で読む
      const { fixture } = await callPost({
        tweetId: LONG_TWEET_ID,
        liked: true,
      })
      const [tankaCall] = fixture.calls.filter((c) => c.table === 'tanka')
      assert.deepEqual(tankaCall.eqs, [['tweet_id', LONG_TWEET_ID]])
    })

    it('liked=true のときは tweet_id とクライアント IP で insert し、isLiked=true を返す', async () => {
      // Given: insert が成功し、更新後のいいね数は 4
      // When: liked=true で POST を呼ぶ
      // Then: status 200・{ tweetId, likeCount: 4, isLiked: true }・delete しない
      const { status, body, fixture } = await callPost(
        { tweetId: LONG_TWEET_ID, liked: true },
        { count: { count: 4, error: null } },
      )
      assert.equal(status, 200)
      assert.deepEqual(body, {
        tweetId: LONG_TWEET_ID,
        likeCount: 4,
        isLiked: true,
      })
      const inserts = callsOf(fixture, 'insert')
      assert.equal(inserts.length, 1)
      assert.equal(inserts[0].table, 'tanka_likes')
      assert.deepEqual(inserts[0].row, {
        tweet_id: LONG_TWEET_ID,
        user_ip: CLIENT_IP,
      })
      assert.equal(callsOf(fixture, 'delete').length, 0)
    })

    it('liked=true で insert が 23505（重複）を返しても 200 と isLiked=true を返す', async () => {
      // Given: insert が重複エラー 23505 を返す
      // When: liked=true で POST を呼ぶ
      // Then: status 200・isLiked=true・更新後のいいね数を返す
      const { status, body } = await callPost(
        { tweetId: '123', liked: true },
        {
          insert: { data: null, error: { code: '23505', message: 'dup' } },
          count: { count: 2, error: null },
        },
      )
      assert.equal(status, 200)
      assert.deepEqual(body, { tweetId: '123', likeCount: 2, isLiked: true })
    })

    it('liked=true で insert が 23505 以外の error を返したら 500 を返す', async () => {
      // Given: insert が 23505 以外の code（42501）を返す
      // When: liked=true で POST を呼ぶ
      // Then: status 500・error='いいねの追加に失敗しました'
      const { status, body } = await callPost(
        { tweetId: '123', liked: true },
        { insert: { data: null, error: { code: '42501', message: 'denied' } } },
      )
      assert.equal(status, 500)
      assert.equal(body.error, 'いいねの追加に失敗しました')
    })

    it('liked=false のときは tweet_id とクライアント IP で delete し、isLiked=false を返す', async () => {
      // Given: delete が成功し、更新後のいいね数は 1
      // When: liked=false で POST を呼ぶ
      // Then: status 200・{ tweetId, likeCount: 1, isLiked: false }・insert しない
      const { status, body, fixture } = await callPost(
        { tweetId: LONG_TWEET_ID, liked: false },
        { count: { count: 1, error: null } },
      )
      assert.equal(status, 200)
      assert.deepEqual(body, {
        tweetId: LONG_TWEET_ID,
        likeCount: 1,
        isLiked: false,
      })
      const deletes = callsOf(fixture, 'delete')
      assert.equal(deletes.length, 1)
      assert.equal(deletes[0].table, 'tanka_likes')
      assert.deepEqual(deletes[0].eqs, [
        ['tweet_id', LONG_TWEET_ID],
        ['user_ip', CLIENT_IP],
      ])
      assert.equal(callsOf(fixture, 'insert').length, 0)
    })

    it('liked=false で delete が error を返したら 500 を返す', async () => {
      // Given: delete が error を返す
      // When: liked=false で POST を呼ぶ
      // Then: status 500・error='いいねの削除に失敗しました'
      const { status, body } = await callPost(
        { tweetId: '123', liked: false },
        { delete: { error: { message: 'boom' } } },
      )
      assert.equal(status, 500)
      assert.equal(body.error, 'いいねの削除に失敗しました')
    })

    it('更新後のいいね数の取得が error のときは 500 を返す', async () => {
      // Given: insert は成功し、更新後の count 取得が error を返す
      // When: liked=true で POST を呼ぶ
      // Then: status 500・error='いいね数の取得に失敗しました'
      const { status, body } = await callPost(
        { tweetId: '123', liked: true },
        { count: { count: null, error: { message: 'boom' } } },
      )
      assert.equal(status, 500)
      assert.equal(body.error, 'いいね数の取得に失敗しました')
    })
  })
})
