// 記事末の関連記事（Issue #14 / TDD 先行）を選ぶ selectRelatedPosts の契約を固定する単体テスト。
//
// selectRelatedPosts(current, posts) は純関数で、次の規則で関連記事を選ぶ:
//   - 自分自身（slug が同じ記事）を除く
//   - 一致数 = current の重複を除いたタグのうち、候補が持つものの数。0 の記事は除く
//   - 一致数の多い順。同じなら日付の新しい順（日付は getPostData の parseDateMs で解釈する）
//   - 一致数も日付も同じなら入力の順を保つ（仕様にない 3 つ目の並び順は足さない）
//   - 最大 3 件
//   - 入力の配列を変えない
// 記事ページ（page.tsx）がビルド時に getAllPostsMeta() の結果を渡して呼ぶ。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は relatedPosts.ts が無いため import エラーで RED、実装後に GREEN。

import { getAllPostsMeta } from '@/app/api/utils/getPostData'
import type { PostMeta } from '@/types/posts'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { selectRelatedPosts } from './relatedPosts'

const RELATED_POSTS_LIMIT = 3

const createPost = (overrides: Partial<PostMeta>): PostMeta => ({
  slug: 'post',
  title: 'タイトル',
  date: '2025-01-01',
  tags: [],
  ...overrides,
})

const slugsOf = (posts: PostMeta[]): string[] => posts.map((post) => post.slug)

// --- 並び順 ---

test('selectRelatedPosts: タグの一致数が多い順に並べる', () => {
  // Given: 日付が同じで、一致数が 1・3・2 の候補
  const current = createPost({ slug: 'current', tags: ['A', 'B', 'C'] })
  const posts = [
    createPost({ slug: 'one', tags: ['A'] }),
    createPost({ slug: 'three', tags: ['A', 'B', 'C'] }),
    createPost({ slug: 'two', tags: ['A', 'B'] }),
  ]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then
  assert.deepEqual(slugsOf(related), ['three', 'two', 'one'])
})

test('selectRelatedPosts: 一致数が同じなら日付の新しい順に並べる', () => {
  // Given: 一致数がどれも 1 で、入力は古い順
  const current = createPost({ slug: 'current', tags: ['A'] })
  const posts = [
    createPost({ slug: 'old', date: '2023-05-01', tags: ['A'] }),
    createPost({ slug: 'middle', date: '2024-05-01', tags: ['A'] }),
    createPost({ slug: 'new', date: '2025-05-01', tags: ['A'] }),
  ]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then: 入力の順ではなく日付で並ぶ
  assert.deepEqual(slugsOf(related), ['new', 'middle', 'old'])
})

test('selectRelatedPosts: 一致数を日付より優先する', () => {
  // Given: 新しいが一致数 1 の記事と、古いが一致数 2 の記事
  const current = createPost({ slug: 'current', tags: ['A', 'B'] })
  const posts = [
    createPost({ slug: 'new-one-match', date: '2025-12-31', tags: ['A'] }),
    createPost({
      slug: 'old-two-matches',
      date: '2020-01-01',
      tags: ['A', 'B'],
    }),
  ]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then
  assert.deepEqual(slugsOf(related), ['old-two-matches', 'new-one-match'])
})

test('selectRelatedPosts: 一致数と日付が同じなら入力の順を保つ', () => {
  // Given: 一致数も日付も同じ 2 件を、2 通りの順で渡す
  const current = createPost({ slug: 'current', tags: ['A'] })
  const first = createPost({ slug: 'first', date: '2025-03-08', tags: ['A'] })
  const second = createPost({ slug: 'second', date: '2025-03-08', tags: ['A'] })
  // When
  const forward = selectRelatedPosts(current, [first, second])
  const backward = selectRelatedPosts(current, [second, first])
  // Then: 3 つ目の並び順（slug 順など）を足さない
  assert.deepEqual(slugsOf(forward), ['first', 'second'])
  assert.deepEqual(slugsOf(backward), ['second', 'first'])
})

test('selectRelatedPosts: 解釈できない日付は最も古い日付として扱う', () => {
  // Given: 一致数が同じで、片方の日付が不正
  const current = createPost({ slug: 'current', tags: ['A'] })
  const posts = [
    createPost({ slug: 'invalid-date', date: 'not-a-date', tags: ['A'] }),
    createPost({ slug: 'valid-date', date: '2001-01-01', tags: ['A'] }),
  ]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then: 一覧（getAllPostsMeta）と同じく、不正な日付は後ろに回る
  assert.deepEqual(slugsOf(related), ['valid-date', 'invalid-date'])
})

// --- 一致数の数え方 ---

test('selectRelatedPosts: 現在の記事のタグが重複していても 1 つとして数える', () => {
  // Given: current は React を 2 回持つ。どちらの候補も一致数は 1 なので日付で並ぶ。
  //   重複を数えると old-react の一致数が 2 になり、先に来てしまう
  const current = createPost({
    slug: 'current',
    tags: ['React', 'React', 'Next.js'],
  })
  const posts = [
    createPost({ slug: 'old-react', date: '2020-01-01', tags: ['React'] }),
    createPost({ slug: 'new-next', date: '2025-12-31', tags: ['Next.js'] }),
  ]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then
  assert.deepEqual(slugsOf(related), ['new-next', 'old-react'])
})

test('selectRelatedPosts: 候補のタグが重複していても一致数は増えない', () => {
  // Given: 候補 old-dup は React を 2 回持つ。どちらの候補も一致数は 1 なので日付で並ぶ。
  //   重複を数えると old-dup の一致数が 2 になり、先に来てしまう
  const current = createPost({ slug: 'current', tags: ['React', 'Next.js'] })
  const posts = [
    createPost({
      slug: 'old-dup',
      date: '2020-01-01',
      tags: ['React', 'React'],
    }),
    createPost({ slug: 'new-next', date: '2025-12-31', tags: ['Next.js'] }),
  ]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then
  assert.deepEqual(slugsOf(related), ['new-next', 'old-dup'])
})

// --- 候補の絞り込み ---

test('selectRelatedPosts: 自分自身を含めない', () => {
  // Given: 候補に current と同じ slug の記事がある（タグは全部一致する）
  const current = createPost({ slug: 'current', tags: ['A', 'B'] })
  const posts = [
    createPost({ slug: 'current', tags: ['A', 'B'] }),
    createPost({ slug: 'other', tags: ['A'] }),
  ]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then
  assert.deepEqual(slugsOf(related), ['other'])
})

test('selectRelatedPosts: タグが 1 つも一致しない記事を含めない', () => {
  // Given: 一致する記事 1 件と一致しない記事 2 件
  const current = createPost({ slug: 'current', tags: ['A'] })
  const posts = [
    createPost({ slug: 'unrelated', date: '2025-12-31', tags: ['Z'] }),
    createPost({ slug: 'related', date: '2020-01-01', tags: ['A'] }),
    createPost({ slug: 'untagged', date: '2025-12-30', tags: [] }),
  ]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then: 3 件に満たなくても一致しない記事で埋めない
  assert.deepEqual(slugsOf(related), ['related'])
})

test('selectRelatedPosts: 一致する記事が無ければ空配列を返す', () => {
  // Given
  const current = createPost({ slug: 'current', tags: ['A'] })
  const posts = [createPost({ slug: 'unrelated', tags: ['Z'] })]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then
  assert.deepEqual(related, [])
})

test('selectRelatedPosts: 現在の記事にタグが無ければ空配列を返す', () => {
  // Given: current のタグが 0 件（境界値）
  const current = createPost({ slug: 'current', tags: [] })
  const posts = [createPost({ slug: 'other', tags: ['A'] })]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then
  assert.deepEqual(related, [])
})

test('selectRelatedPosts: 候補が無ければ空配列を返す', () => {
  // Given: 記事が current だけ
  const current = createPost({ slug: 'current', tags: ['A'] })
  // When
  const related = selectRelatedPosts(current, [current])
  // Then
  assert.deepEqual(related, [])
})

// --- 件数 ---

test('selectRelatedPosts: 一致する記事が 4 件以上あっても上位 3 件だけ返す', () => {
  // Given: 一致する記事が 5 件。入力は並び順と逆にしておく
  const current = createPost({ slug: 'current', tags: ['A', 'B'] })
  const posts = [
    createPost({ slug: 'fifth', date: '2021-01-01', tags: ['A'] }),
    createPost({ slug: 'fourth', date: '2022-01-01', tags: ['A'] }),
    createPost({ slug: 'third', date: '2023-01-01', tags: ['A'] }),
    createPost({ slug: 'second', date: '2020-01-01', tags: ['A', 'B'] }),
    createPost({ slug: 'first', date: '2021-01-01', tags: ['A', 'B'] }),
  ]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then: 並べてから 3 件に切る
  assert.deepEqual(slugsOf(related), ['first', 'second', 'third'])
})

test('selectRelatedPosts: 一致する記事がちょうど 3 件なら 3 件すべて返す', () => {
  // Given（境界値）
  const current = createPost({ slug: 'current', tags: ['A'] })
  const posts = [
    createPost({ slug: 'a', date: '2025-03-01', tags: ['A'] }),
    createPost({ slug: 'b', date: '2025-02-01', tags: ['A'] }),
    createPost({ slug: 'c', date: '2025-01-01', tags: ['A'] }),
  ]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then
  assert.deepEqual(slugsOf(related), ['a', 'b', 'c'])
})

test('selectRelatedPosts: 一致する記事が 3 件未満ならその件数だけ返す', () => {
  // Given: 一致する記事が 2 件
  const current = createPost({ slug: 'current', tags: ['A'] })
  const posts = [
    createPost({ slug: 'a', date: '2025-02-01', tags: ['A'] }),
    createPost({ slug: 'b', date: '2025-01-01', tags: ['A'] }),
  ]
  // When
  const related = selectRelatedPosts(current, posts)
  // Then
  assert.deepEqual(slugsOf(related), ['a', 'b'])
})

// --- 入出力の形 ---

test('selectRelatedPosts: 入力の記事をそのままの形で返す', () => {
  // Given
  const current = createPost({ slug: 'current', tags: ['A'] })
  const candidate = createPost({
    slug: 'other',
    title: '別の記事',
    date: '2024-06-01',
    tags: ['A', 'B'],
  })
  // When
  const related = selectRelatedPosts(current, [candidate])
  // Then: 一致数などのフィールドを足さない
  assert.deepEqual(related, [candidate])
})

test('selectRelatedPosts: 入力の配列と記事を変えない', () => {
  // Given: 並び替えが起きる入力
  const current = createPost({ slug: 'current', tags: ['A', 'B'] })
  const posts = [
    createPost({ slug: 'one', date: '2020-01-01', tags: ['A'] }),
    createPost({ slug: 'two', date: '2021-01-01', tags: ['A', 'B'] }),
    createPost({ slug: 'none', date: '2022-01-01', tags: ['Z'] }),
    createPost({ slug: 'current', tags: ['A', 'B'] }),
  ]
  const postsSnapshot = structuredClone(posts)
  const currentSnapshot = structuredClone(current)
  // When
  selectRelatedPosts(current, posts)
  // Then
  assert.deepEqual(posts, postsSnapshot)
  assert.deepEqual(current, currentSnapshot)
})

// --- 実際の記事一覧との結合 ---

test('selectRelatedPosts: 公開記事のどれに対しても、他の公開記事からタグの一致する 3 件以内を選ぶ', async () => {
  // Given: page.tsx と同じく getAllPostsMeta() の結果を渡す
  const allPosts = await getAllPostsMeta()
  const publicSlugs = new Set(slugsOf(allPosts))
  assert.ok(allPosts.length > 0, '公開記事がある')

  for (const current of allPosts) {
    // When
    const related = selectRelatedPosts(current, allPosts)
    // Then
    assert.ok(
      related.length <= RELATED_POSTS_LIMIT,
      `${current.slug}: ${RELATED_POSTS_LIMIT} 件以内（実際: ${related.length}）`,
    )
    for (const post of related) {
      assert.notEqual(
        post.slug,
        current.slug,
        `${current.slug}: 自分を含まない`,
      )
      assert.ok(
        publicSlugs.has(post.slug),
        `${current.slug}: ${post.slug} は公開記事`,
      )
      assert.ok(
        post.tags.some((tag) => current.tags.includes(tag)),
        `${current.slug}: ${post.slug} はタグが 1 つ以上一致する`,
      )
    }
  }
})
