// タイポグラフィスケールと余白の統一（Issue #226 UI刷新 4/4）の契約を固定する
// 回帰防止テスト。
//
// #226 は「ベーススケールを globals.css の h1/h2/h3/p に一元化し、コンポーネント側の
// サイズ直書きを剥がす」「section 縦余白をゆったり化」「p のモバイル行間の詰まりを解消」
// 「グリッド gap を1段広げる」「arbitrary な text サイズ（rpg/game 除く）を廃止」
// 「ヘッダー端数（pr-7/pr-8 混在）を統一」を範囲とする。レイアウト構造・世界観は変えない。
//
// ここでは複数ファイル横断のソース契約を静的検査（readFileSync）で固定する
// （panel-shadow-consolidation.test.ts / layout.font.test.ts と同方針）。コンポーネント単位の
// 観測可能な className は各 *.style.test.tsx でレンダリング検証する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は旧スケール・旧余白のままのため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = (rel: string): string =>
  readFileSync(new URL(`./${rel}`, import.meta.url), 'utf8')

// className 文字列内で「単独のユーティリティ」として出現するかを見る。
// `md:p-5` の中の `p-5` のような接頭辞付き一致を弾き、素の（モバイル）指定だけを検出する。
const hasBareClass = (source: string, cls: string): boolean =>
  new RegExp(`[\\s"'\`]${cls.replace(/[-[\]]/g, '\\$&')}[\\s"'\`]`).test(source)

// ------------------------------------------------------------------
// globals.css: スケール・余白・行間の一元化
// ------------------------------------------------------------------
test('globals.css: section の縦余白を py-12 md:py-16 へゆったり化する', () => {
  // Given/When: グローバルスタイルを読む
  const css = read('globals.css')
  // Then: section の縦リズムが広がっている（詰まった p-4 のみをやめる）
  assert.ok(css.includes('py-12'), 'section 縦余白 py-12 を含む')
  assert.ok(css.includes('md:py-16'), 'section 縦余白 md:py-16 を含む')
})

test('globals.css: p のモバイル行間を leading-relaxed 以上にし詰まりを解消する', () => {
  // Given/When: グローバルスタイルを読む
  const css = read('globals.css')
  // Then: モバイルも leading-relaxed（1.75）以上にする
  assert.ok(css.includes('leading-relaxed'), 'leading-relaxed を含む')
})

test('globals.css: 旧モバイル行間 leading-snug（1.375）を残さない', () => {
  // Given/When: グローバルスタイルを読む
  const css = read('globals.css')
  // Then: 日本語が黒い塊に見える詰まった行間を廃止する
  assert.ok(!css.includes('leading-snug'), 'leading-snug を含まない')
})

// ------------------------------------------------------------------
// ArticleList.tsx: 見出しのセマンティック化（div → h2）
// ------------------------------------------------------------------
test('ArticleList: セクションラベルを <h2> へセマンティック化する', () => {
  // Given/When: ブログ一覧テンプレートを読む
  const source = read('components/templates/ArticleList.tsx')
  // Then: 見出しはセマンティックな <h2> として出力する
  assert.ok(source.includes('<h2'), '<h2 を含む')
})

test('ArticleList: サイズ直書き text-xl font-bold を剥がしスケールへ委譲する', () => {
  // Given/When: ブログ一覧テンプレートを読む
  const source = read('components/templates/ArticleList.tsx')
  // Then: globals の h2 に委譲し、サイズ/太さの直書きは残さない
  assert.ok(
    !source.includes('text-xl font-bold'),
    'text-xl font-bold の直書きを含まない',
  )
})

// ------------------------------------------------------------------
// ArticleContent.tsx: arbitrary な text サイズの廃止
// ------------------------------------------------------------------
test('ArticleContent: arbitrary な text サイズ text-[…] を廃止する', () => {
  // Given/When: 記事本文テンプレートを読む
  const source = read('components/templates/ArticleContent.tsx')
  // Then: text-[0.9em] のような arbitrary 値を残さない（rpg/game 除く対象外）
  assert.ok(!source.includes('text-['), 'text-[ を含まない')
})

test('ArticleContent: インラインコードを最寄りトークン text-sm へ寄せる', () => {
  // Given/When: 記事本文テンプレートを読む
  const source = read('components/templates/ArticleContent.tsx')
  // Then: 廃止した text-[0.9em] の代替として text-sm を使う
  assert.ok(source.includes('text-sm'), 'text-sm を含む')
})

// ------------------------------------------------------------------
// Header.tsx: ヘッダー端数の統一（pr-7 → pr-8）
// ------------------------------------------------------------------
test('Header: 右端の端数 pr-7 を廃止し 8px グリッドへ統一する', () => {
  // Given/When: ヘッダーを読む
  const source = read('components/templates/Header.tsx')
  // Then: 8 の倍数でない pr-7（28px）を残さない
  assert.ok(!source.includes('pr-7'), 'pr-7 を含まない')
})

test('Header: 右端を HeaderLinkButton と同じ pr-8 に揃える', () => {
  // Given/When: ヘッダーを読む
  const source = read('components/templates/Header.tsx')
  // Then: pr-8（32px = 8×4）へ統一する
  assert.ok(hasBareClass(source, 'pr-8'), 'pr-8 を含む')
})

// ------------------------------------------------------------------
// BlogGrid.tsx: カードグリッドの gap を1段広げる
// ------------------------------------------------------------------
test('BlogGrid: カードグリッドの gap を1段広げ gap-8 に揃える', () => {
  // Given/When: ブログ一覧グリッドを読む
  const source = read('components/organisms/BlogGrid.tsx')
  // Then: WorkList と同じ gap-8 で余白により区切る
  assert.ok(source.includes('gap-8'), 'gap-8 を含む')
})

test('BlogGrid: 詰まった gap-6 を残さない', () => {
  // Given/When: ブログ一覧グリッドを読む
  const source = read('components/organisms/BlogGrid.tsx')
  // Then: 旧 gap-6 は使わない
  assert.ok(!source.includes('gap-6'), 'gap-6 を含まない')
})

// ------------------------------------------------------------------
// 窮屈な padding の解消（追補3・近接の法則 / 8pxグリッド）
// カード・パネルのモバイル内側 padding を p-5/px-4 下限へ引き上げ、
// 文字が枠に接近する p-2/px-2（8px）を残さない。
// ------------------------------------------------------------------
test('ArticleContent: ブログ本文カードのモバイル p-2 を p-5 へ引き上げる', () => {
  // Given/When: 記事本文テンプレートを読む
  const source = read('components/templates/ArticleContent.tsx')
  // Then: モバイルの内側 padding は p-5（20px）以上にする
  assert.ok(hasBareClass(source, 'p-5'), 'p-5 を含む')
  // Then: 窮屈な p-2（8px）は残さない（pb-24/md:p-10 は別クラスのため影響なし）
  assert.ok(!hasBareClass(source, 'p-2'), 'p-2 を含まない')
})

test('MessageBoard: top パネルのモバイル padding を 16px（p-4）以上に保つ', () => {
  // Given/When: top ページのお知らせパネルを読む
  const source = read('components/organisms/MessageBoard.tsx')
  // Then: モバイルの内側 padding は 16px 以上にする（p-4 は px-4 を内包する等価表記）
  assert.ok(hasBareClass(source, 'p-4'), 'p-4 を含む')
  // Then: 窮屈な px-2 / p-2（8px）は残さない
  assert.ok(!hasBareClass(source, 'px-2'), 'px-2 を含まない')
  assert.ok(!hasBareClass(source, 'p-2'), 'p-2 を含まない')
})

test('MessageBoard: 縦横同値 padding は冗長な px-4 py-4 でなく p-4 に短縮する', () => {
  // Given/When: top ページのお知らせパネルを読む
  const source = read('components/organisms/MessageBoard.tsx')
  // Then: eslint tailwindcss/enforces-shorthand を誘発する冗長表記を残さない
  //       （px-N py-N が同値なら shorthand p-N に統一する）
  assert.ok(!source.includes('px-4 py-4'), 'px-4 py-4 の冗長表記を含まない')
  assert.ok(!source.includes('py-4 px-4'), 'py-4 px-4 の冗長表記を含まない')
})
