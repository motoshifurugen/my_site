// Issue #391: book ページの page.tsx から pageNavigation.ts へ移したページ送りの計算を固定する。
//
// - getPageAfterSwipe: スワイプの移動量から次に開くページを決める
// - getPageAfterTap: 枠の中でタップした位置から次に開くページを決める
//
// 移す前の page.tsx（handleTouchEnd / handleClick）と同じ結果を返すことを確かめる。
// 右開きの本なので、左→右のスワイプと左半分のタップで次のページへ進む。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getPageAfterSwipe, getPageAfterTap } from './pageNavigation'

const totalPages = 10
const middlePage = 5
const lastPage = totalPages - 1
const firstPage = 0

test('getPageAfterSwipe: 縦の動きが横より大きいときはページを変えない', () => {
  // Given: 中ほどのページで、横 60px・縦 80px のスワイプ
  // When: 次のページを求める
  const page = getPageAfterSwipe(middlePage, 60, 80, totalPages)

  // Then: 縦スクロールとみなし、今のページのまま
  assert.equal(page, middlePage)
})

test('getPageAfterSwipe: 縦の動きが上向きで横より大きいときもページを変えない', () => {
  // Given: 中ほどのページで、横 -60px・縦 -80px のスワイプ
  // When: 次のページを求める
  const page = getPageAfterSwipe(middlePage, -60, -80, totalPages)

  // Then: 今のページのまま
  assert.equal(page, middlePage)
})

test('getPageAfterSwipe: 縦と横の動きが同じ大きさなら横の判定へ進む', () => {
  // Given: 中ほどのページで、横 60px・縦 60px のスワイプ
  // When: 次のページを求める
  const page = getPageAfterSwipe(middlePage, 60, 60, totalPages)

  // Then: 縦の判定は「より大きい」ときだけなので、次のページへ進む
  assert.equal(page, middlePage + 1)
})

test('getPageAfterSwipe: 横の動きが 49px ではページを変えない', () => {
  // Given: 中ほどのページで、縦の動きが無い 49px のスワイプ
  // When: 次のページを求める
  const page = getPageAfterSwipe(middlePage, 49, 0, totalPages)

  // Then: 閾値に届かず、今のページのまま
  assert.equal(page, middlePage)
})

test('getPageAfterSwipe: 横の動きが -49px ではページを変えない', () => {
  // Given: 中ほどのページで、縦の動きが無い -49px のスワイプ
  // When: 次のページを求める
  const page = getPageAfterSwipe(middlePage, -49, 0, totalPages)

  // Then: 閾値に届かず、今のページのまま
  assert.equal(page, middlePage)
})

test('getPageAfterSwipe: 横の動きがちょうど 50px ではページを変えない', () => {
  // Given: 中ほどのページで、縦の動きが無い 50px のスワイプ
  // When: 次のページを求める
  const page = getPageAfterSwipe(middlePage, 50, 0, totalPages)

  // Then: 移す前の page.tsx は deltaX > 50 で進むため、今のページのまま
  assert.equal(page, middlePage)
})

test('getPageAfterSwipe: 横の動きがちょうど -50px ではページを変えない', () => {
  // Given: 中ほどのページで、縦の動きが無い -50px のスワイプ
  // When: 次のページを求める
  const page = getPageAfterSwipe(middlePage, -50, 0, totalPages)

  // Then: 移す前の page.tsx は deltaX < -50 で戻るため、今のページのまま
  assert.equal(page, middlePage)
})

test('getPageAfterSwipe: 左から右へ 51px 動かすと次のページへ進む', () => {
  // Given: 中ほどのページで、縦の動きが無い 51px のスワイプ
  // When: 次のページを求める
  const page = getPageAfterSwipe(middlePage, 51, 0, totalPages)

  // Then: 1 ページ進む
  assert.equal(page, middlePage + 1)
})

test('getPageAfterSwipe: 右から左へ 51px 動かすと前のページへ戻る', () => {
  // Given: 中ほどのページで、縦の動きが無い -51px のスワイプ
  // When: 次のページを求める
  const page = getPageAfterSwipe(middlePage, -51, 0, totalPages)

  // Then: 1 ページ戻る
  assert.equal(page, middlePage - 1)
})

test('getPageAfterSwipe: 最後のページでは次へ進まない', () => {
  // Given: 最後のページで、51px のスワイプ
  // When: 次のページを求める
  const page = getPageAfterSwipe(lastPage, 51, 0, totalPages)

  // Then: totalPages - 1 で止まる
  assert.equal(page, lastPage)
})

test('getPageAfterSwipe: 最初のページでは前へ戻らない', () => {
  // Given: 最初のページで、-51px のスワイプ
  // When: 次のページを求める
  const page = getPageAfterSwipe(firstPage, -51, 0, totalPages)

  // Then: 0 で止まる
  assert.equal(page, firstPage)
})

const frameWidth = 400

test('getPageAfterTap: 左半分をタップすると次のページへ進む', () => {
  // Given: 中ほどのページで、幅 400 の枠の左端から 100 の位置
  // When: 次のページを求める
  const page = getPageAfterTap(middlePage, 100, frameWidth, totalPages)

  // Then: 1 ページ進む
  assert.equal(page, middlePage + 1)
})

test('getPageAfterTap: ちょうど中央をタップすると前のページへ戻る', () => {
  // Given: 中ほどのページで、幅 400 の枠の左端から 200 の位置
  // When: 次のページを求める
  const page = getPageAfterTap(middlePage, 200, frameWidth, totalPages)

  // Then: 左半分は「中央より小さい」ときだけなので、1 ページ戻る
  assert.equal(page, middlePage - 1)
})

test('getPageAfterTap: 右半分をタップすると前のページへ戻る', () => {
  // Given: 中ほどのページで、幅 400 の枠の左端から 300 の位置
  // When: 次のページを求める
  const page = getPageAfterTap(middlePage, 300, frameWidth, totalPages)

  // Then: 1 ページ戻る
  assert.equal(page, middlePage - 1)
})

test('getPageAfterTap: 最後のページで左半分をタップしても次へ進まない', () => {
  // Given: 最後のページで、左半分の位置
  // When: 次のページを求める
  const page = getPageAfterTap(lastPage, 100, frameWidth, totalPages)

  // Then: totalPages - 1 で止まる
  assert.equal(page, lastPage)
})

test('getPageAfterTap: 最初のページで右半分をタップしても前へ戻らない', () => {
  // Given: 最初のページで、右半分の位置
  // When: 次のページを求める
  const page = getPageAfterTap(firstPage, 300, frameWidth, totalPages)

  // Then: 0 で止まる
  assert.equal(page, firstPage)
})
