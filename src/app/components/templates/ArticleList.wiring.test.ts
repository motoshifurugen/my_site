// ブログ index への発信チャンネル導線の配線（Issue #229 / TDD 先行）を固定する結合テスト。
//
// #229 完了条件のうち「/blog 上部に Zenn / note カードが表示される」「PageFace に立ち位置の
// 一言を添える」は、ChannelLinks 単体テストでは担保できない“ArticleList への組み込み位置”の
// 契約である。ArticleList を renderToStaticMarkup で描画する案は、記事一覧配下の BlogGrid
// （useLikeCounts の fetch）・Sidebar → ProfileCard（next/image）等の重い推移的依存を引き込み、
// テストが壊れやすくなる（plan の申し送りでも ArticleList 全体描画は非推奨）。そこで本テストは
// ArticleList.tsx のソース構造を読み、次の配線契約のみを最小限に固定する:
//   - ChannelLinks を import している
//   - JSX に <ChannelLinks を配置している
//   - <ChannelLinks は記事一覧の <Suspense より前（＝上）に置かれている（常設・二重描画回避）
//   - PageFace に説明文（t.blog.lead / mainMessage）を配線しない（#243 で削除。空 <p> の余白も残さない）
//
// トークン（import 名・<ChannelLinks・<Suspense・t.blog.lead・mainMessage）は Prettier 整形で安定するため、
// 空白差異に依存しない構造契約として扱う。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は ChannelLinks 未配線・lead 未参照のため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const source = readFileSync(
  new URL('./ArticleList.tsx', import.meta.url),
  'utf8',
)

test('ArticleList: ChannelLinks を import している', () => {
  // Given/When/Then: 導線コンポーネントを取り込んでいる
  assert.match(
    source,
    /import\s+ChannelLinks\s+from\s+['"][^'"]*ChannelLinks['"]/,
    'ChannelLinks の import が存在する',
  )
})

test('ArticleList: JSX に <ChannelLinks を配置している', () => {
  // Given/When/Then: 導線を実際に描画している
  assert.ok(source.includes('<ChannelLinks'), '<ChannelLinks を含む')
})

test('ArticleList: ChannelLinks を記事一覧（<Suspense）より上に配置する', () => {
  // Given: JSX 上の各要素の出現位置
  const channelIndex = source.indexOf('<ChannelLinks')
  const suspenseIndex = source.indexOf('<Suspense')
  // Then: 記事一覧より前に導線が置かれている（記事一覧の“上”に常設する完了条件）
  assert.ok(channelIndex >= 0, '<ChannelLinks が存在する')
  assert.ok(suspenseIndex >= 0, '<Suspense（記事一覧）が存在する')
  assert.ok(
    channelIndex < suspenseIndex,
    '<ChannelLinks は <Suspense より前に置かれる',
  )
})

test('ArticleList: PageFace に説明文（t.blog.lead / mainMessage）を配線しない', () => {
  // Given/When/Then: 説明文は #243 で削除。lead 参照も mainMessage 配線も残さない
  // （mainMessage を渡さないことで PageFace の条件付きレンダリングにより要素ごと非表示になり余白が残らない）
  assert.ok(
    !source.includes('t.blog.lead'),
    't.blog.lead を参照しない（#243 で削除）',
  )
  assert.ok(
    !source.includes('mainMessage'),
    'mainMessage を配線しない（空要素の余白を残さない）',
  )
})

// --- 記事検索とタグ一覧の配線（Issue #7 / TDD 先行） ---
//
// ArticleList を描画すると BlogGrid・Sidebar などの重い依存を引き込むため、上と同じくソースを読んで
// 次の配線契約を固定する（比較前に空白を取り除き、Prettier の整形差に依存しない）:
//   - PostSearchBox と TagCountList を import し、JSX に置く
//   - 検索と件数は同じフォルダの postSearch（searchPosts・countTags）で行う。
//     旧来の initialPosts.filter(... includes(selectedTag)) を残さない（絞り込みの規則を 2 か所に持たない）
//   - インデックスは usePostSearchIndex で `${BASE_PATH}/blog/search-index.json` から取る
//     （fetch に basePath /my_site は自動で付かない）
//   - いいね数は公開記事すべての slug で 1 回だけ取り、BlogGrid に likeCounts で渡す
//   - 0 件のときは t.blog.search.noResults を出す
//   - サーバー専用（fs を使う）の searchIndex・getPostData を import しない

const compactSource = source.replace(/\s+/g, '')

const importSpecifiers = Array.from(
  source.matchAll(/from\s+['"]([^'"]+)['"]/g),
  (match) => match[1],
)

test('ArticleList: PostSearchBox を import して JSX に置く', () => {
  assert.match(
    source,
    /import\s+PostSearchBox\s+from\s+['"][^'"]*\/PostSearchBox['"]/,
  )
  assert.ok(source.includes('<PostSearchBox'), '<PostSearchBox を含む')
})

test('ArticleList: TagCountList を import して JSX に置く', () => {
  assert.match(
    source,
    /import\s+TagCountList\s+from\s+['"][^'"]*\/TagCountList['"]/,
  )
  assert.ok(source.includes('<TagCountList'), '<TagCountList を含む')
})

test('ArticleList: searchPosts と countTags を postSearch から import する', () => {
  const match = source.match(
    /import\s*\{([^}]*)\}\s*from\s*['"][^'"]*postSearch['"]/,
  )
  assert.ok(match, 'postSearch から名前付き import する')
  const names = match![1].split(',').map((name) => name.trim())
  assert.ok(names.includes('searchPosts'), 'searchPosts を import する')
  assert.ok(names.includes('countTags'), 'countTags を import する')
})

test('ArticleList: searchPosts で絞り込み、タグの完全一致フィルタを別に書かない', () => {
  assert.ok(compactSource.includes('searchPosts('), 'searchPosts( を呼ぶ')
  assert.ok(
    !compactSource.includes('.filter((post)=>post.tags.includes(selectedTag))'),
    '旧来のタグ絞り込みを残さない',
  )
})

test('ArticleList: 空の ?tag= は絞り込みなし（null）として searchPosts に渡す', () => {
  // Given: searchPosts は tag が null のときだけ絞り込みを外し、'' では 0 件になる
  // Then: URL から読んだ空文字を null にそろえてから渡す
  assert.ok(
    compactSource.includes("selectedTag={searchParams.get('tag')||null}"),
    "selectedTag={searchParams.get('tag') || null} を渡す",
  )
})

test('ArticleList: 公開記事すべてからタグの件数を数える', () => {
  assert.ok(
    compactSource.includes('countTags(initialPosts)'),
    'countTags(initialPosts) を呼ぶ',
  )
})

test('ArticleList: 検索インデックスを basePath 付きの URL から読み込む', () => {
  assert.ok(
    importSpecifiers.some((specifier) =>
      specifier.endsWith('/usePostSearchIndex'),
    ),
    'usePostSearchIndex を import する',
  )
  assert.ok(
    compactSource.includes(
      'usePostSearchIndex(`${BASE_PATH}/blog/search-index.json`)',
    ),
    'usePostSearchIndex(`${BASE_PATH}/blog/search-index.json`) を呼ぶ',
  )
})

test('ArticleList: いいね数は公開記事すべての slug で取り、BlogGrid に渡す', () => {
  assert.ok(
    compactSource.includes('useLikeCounts(initialPosts.map('),
    'useLikeCounts(initialPosts.map(...)) を呼ぶ',
  )
  const blogGridTag = compactSource.match(/<BlogGrid[^>]*\/>/)
  assert.ok(blogGridTag, '<BlogGrid /> を描画する')
  assert.ok(
    blogGridTag![0].includes('likeCounts={'),
    '<BlogGrid> に likeCounts を渡す',
  )
})

test('ArticleList: 該当する記事が無いときの文言を出す', () => {
  assert.ok(
    source.includes('t.blog.search.noResults'),
    't.blog.search.noResults を参照する',
  )
})

test('ArticleList: サーバー専用のモジュールを import しない', () => {
  for (const specifier of importSpecifiers) {
    assert.ok(
      !specifier.endsWith('/searchIndex'),
      `searchIndex（fs を使う）を import しない: ${specifier}`,
    )
    assert.ok(
      !specifier.includes('getPostData'),
      `getPostData（fs を使う）を import しない: ${specifier}`,
    )
  }
})
