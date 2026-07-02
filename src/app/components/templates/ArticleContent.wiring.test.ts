// 記事本文のモバイル可読性修正（Issue #232 / TDD 先行）を固定する回帰テスト。
//
// #232 は記事本文まわりの 2 つの独立した問題を修正する:
//   (1) 本文カードの内側余白 — モバイルの左右上を 20〜24px 帯へ、極端に非対称な
//       下余白 pb-24（96px）を pb-12（48px）へ、arbitrary 値 xl:px-[4em] を最寄りの
//       Tailwind トークン xl:px-16 へ置換する。desktop（md:p-10）は不変に保つ。
//   (2) 行間・段落間隔が効いていない p→div 置換バグ — codeBlockComponents が MDX の
//       p を <div> へ置換しているため、.articleContent p のスタイルが本文段落に一切
//       適用されていない（実効 line-height ~1.5・段落 margin 0）。置換 div へ専用クラス
//       styles.articleParagraph を付与し、module CSS 側で line-height（≥1.7）＋段落
//       margin を実効化する。あわせて死んだ .articleContent p を段落クラスへ一本化する。
//
// ArticleContent は MDXRemote（next-mdx-remote/rsc, async Server Component）を含むため
// renderToStaticMarkup で同期描画できず、CSS Module もテストでは {} にモックされ
// styles.articleParagraph が空になる。よって markup 経由の検証は不可能で、
// ArticleList.wiring.test.ts / font-noto-sans-wiring.test.ts と同じくソースの静的検査で
// 契約を固定する。トークン（p-6/pb-12/xl:px-16/styles.articleParagraph/line-height 等）は
// Prettier 整形で安定するため、空白差異に依存しない構造契約として扱う。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は p-5/pb-24/xl:px-[4em]・articleParagraph 未配線のため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const tsx = readFileSync(
  new URL('./ArticleContent.tsx', import.meta.url),
  'utf8',
)
const css = readFileSync(
  new URL('./ArticleContent.module.css', import.meta.url),
  'utf8',
)

// 本文カード div の className（${styles.articleContent} を含む唯一の template literal）を抽出する。
// これに絞ることで、コードブロック等の無関係な className への誤検出を避ける。
function cardClassName(source: string): string {
  const match = source.match(
    /className=\{`([^`]*\$\{styles\.articleContent\}[^`]*)`\}/,
  )
  assert.ok(
    match,
    '本文カード div の className（styles.articleContent を含む）が抽出できる',
  )
  return match![1]
}

// CSS ルールのブレース内本文を抽出する（このモジュールはネストしたブレースを持たない単純ルールのみ）。
function ruleBody(source: string, selector: string): string | null {
  const idx = source.indexOf(selector)
  if (idx < 0) return null
  const open = source.indexOf('{', idx)
  const close = source.indexOf('}', open)
  if (open < 0 || close < 0) return null
  return source.slice(open + 1, close)
}

// --- (1) 本文カードの内側余白 ---

test('ArticleContent: モバイルの内側余白を p-6（24px, 20〜24px 帯）にする', () => {
  // Given: 本文カード div の className
  const card = cardClassName(tsx)
  // Then: モバイル余白が p-6（24px, 受入基準 20px 以上）である
  assert.match(card, /(?<![\w-])p-6(?![\w-])/, 'p-6 を含む')
})

test('ArticleContent: 旧モバイル余白 p-5 / p-2 を残さない', () => {
  // Given: 本文カード div の className
  const card = cardClassName(tsx)
  // Then: 窮屈だった / 中途半端だった旧値は残っていない
  assert.ok(!/(?<![\w-])p-5(?![\w-])/.test(card), 'p-5 を含まない')
  assert.ok(!/(?<![\w-])p-2(?![\w-])/.test(card), 'p-2 を含まない')
})

test('ArticleContent: 極端に非対称な下余白 pb-24 を pb-12 へ緩和する', () => {
  // Given: 本文カード div の className
  const card = cardClassName(tsx)
  // Then: pb-12（48px）へ縮小し、pb-24（96px）は残っていない
  assert.match(card, /(?<![\w-])pb-12(?![\w-])/, 'pb-12 を含む')
  assert.ok(!/(?<![\w-])pb-24(?![\w-])/.test(card), 'pb-24 を含まない')
})

test('ArticleContent: arbitrary 値 xl:px-[4em] を Tailwind トークン xl:px-16 へ置換する', () => {
  // Given: 本文カード div の className
  const card = cardClassName(tsx)
  // Then: 標準トークン xl:px-16（=4rem=64px, 旧 4em と同値）へ置換し arbitrary 値は残さない
  assert.match(card, /(?<![\w-])xl:px-16(?![\w-])/, 'xl:px-16 を含む')
  assert.ok(!card.includes('xl:px-[4em]'), 'xl:px-[4em] を含まない')
})

test('ArticleContent: desktop 余白 md:p-10 を不変に保つ（世界観・レイアウト維持）', () => {
  // Given: 本文カード div の className
  const card = cardClassName(tsx)
  // Then: md 以上の余白は据え置き（desktop の見た目を変えない制約）
  assert.match(card, /(?<![\w-])md:p-10(?![\w-])/, 'md:p-10 を含む')
})

// --- (2) 行間・段落間隔の実効化（p→div 置換バグの修正） ---

test('ArticleContent: 置換 div（本文段落）へ段落クラス styles.articleParagraph を配線する', () => {
  // Given/When: p→div 置換で本文段落は <div> になる
  // Then: その div に styles.articleParagraph を付与し、実レンダリング要素へスタイルを効かせる
  assert.ok(
    tsx.includes('styles.articleParagraph'),
    'styles.articleParagraph を参照して段落 div に付与する',
  )
})

test('ArticleContent.module.css: 段落クラス .articleParagraph を定義する', () => {
  // Given/When/Then: 実レンダリング要素向けの段落ルールが存在する
  assert.ok(
    ruleBody(css, '.articleParagraph') !== null,
    '.articleParagraph ルールが存在する',
  )
})

test('ArticleContent.module.css: 段落の line-height を 1.7 以上にする', () => {
  // Given: .articleParagraph ルール本文
  const body = ruleBody(css, '.articleParagraph')
  assert.ok(body, '.articleParagraph ルールが存在する')
  // When: line-height の値を取り出す
  const m = body!.match(/line-height:\s*([\d.]+)/)
  assert.ok(m, 'line-height 宣言が存在する')
  // Then: 受入基準どおり 1.7 以上（黒い塊回避の行間）
  assert.ok(
    parseFloat(m![1]) >= 1.7,
    `line-height は 1.7 以上（実際: ${m![1]}）`,
  )
})

test('ArticleContent.module.css: 段落間に正の縦マージンを設定する', () => {
  // Given: .articleParagraph ルール本文
  const body = ruleBody(css, '.articleParagraph')
  assert.ok(body, '.articleParagraph ルールが存在する')
  // When: 縦方向の margin 宣言を取り出す（shorthand の第一値 or margin-top/-bottom/-block）
  const m = body!.match(/margin(?:-top|-bottom|-block)?:\s*([\d.]+)(px|rem|em)/)
  assert.ok(m, 'margin 宣言が存在する')
  // Then: 段落間マージンが正の値で適用される
  assert.ok(
    parseFloat(m![1]) > 0,
    `段落マージンは正の値（実際: ${m![1]}${m![2]}）`,
  )
})

test('ArticleContent.module.css: 死んだ .articleContent p を段落クラスへ一本化する', () => {
  // Given/When/Then: p→div 化で無効だった .articleContent p を撤去し、
  // 本文タイポを .articleParagraph 側へ一本化する（二重管理の解消）
  assert.ok(
    !/\.articleContent\s+p\s*\{/.test(css),
    '無効な .articleContent p セレクタを残さない',
  )
})
