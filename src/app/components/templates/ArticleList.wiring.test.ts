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
//   - PageFace に t.blog.lead を配線している（subtitle/mainMessage が空でなくなる）
//
// トークン（import 名・<ChannelLinks・<Suspense・t.blog.lead）は Prettier 整形で安定するため、
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

test('ArticleList: PageFace に立ち位置の一文（t.blog.lead）を配線する', () => {
  // Given/When/Then: 空だった mainMessage/subtitle を lead 文言で埋める
  assert.ok(
    source.includes('t.blog.lead'),
    't.blog.lead を参照して PageFace に配線する',
  )
})
