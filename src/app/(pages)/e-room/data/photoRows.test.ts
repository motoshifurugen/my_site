// 写真行データ（data/photoRows.ts）の分割ロジック契約を固定する単体テスト
// （Issue #162 / TDD 先行）。
//
// page.tsx:141-157 の写真分割ロジック（全写真を前半/後半に 2 分割し、各群を
// idx % 3 で 3 行へ振り分ける）は data/photoRows.ts へ移設される。
// FIRST_PHOTO_ROWS / SECOND_PHOTO_ROWS の分割結果が現行ロジックと完全一致することを固定する。
//
// photos.ts は実画像（.jpg/.jpeg 等）を import するが、node --import tsx --test には
// 画像ローダが無い。__testShims__/resolveAssets.mjs を register して StaticImageData
// スタブへ写像したうえで、register 後に動的 import する（WorkCard.test.tsx と同型）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は data/photoRows.ts が未存在のため RED、実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'

register(
  new URL('../__testShims__/resolveAssets.mjs', import.meta.url).href,
  import.meta.url,
)

type PhotoRows = unknown[][]

let FIRST_PHOTO_ROWS: PhotoRows
let SECOND_PHOTO_ROWS: PhotoRows
let E_ROOM_PHOTOS: unknown[]

before(async () => {
  const mod = await import('./photoRows')
  FIRST_PHOTO_ROWS = mod.FIRST_PHOTO_ROWS as PhotoRows
  SECOND_PHOTO_ROWS = mod.SECOND_PHOTO_ROWS as PhotoRows
  E_ROOM_PHOTOS = (await import('../photos')).E_ROOM_PHOTOS as unknown[]
})

// 現行 page.tsx:141-157 と同一の分割ロジックを検証用に再現する。
function expectedRows(photos: unknown[]): PhotoRows {
  return Array.from({ length: 3 }, (_, rowIndex) =>
    photos.filter((_, idx) => idx % 3 === rowIndex),
  )
}

test('photoRows: FIRST/SECOND ともに 3 行構造である', () => {
  // Given/When/Then: 各スライドショーは 3 行（idx % 3）に分割される
  assert.equal(FIRST_PHOTO_ROWS.length, 3)
  assert.equal(SECOND_PHOTO_ROWS.length, 3)
})

test('photoRows: 各行は配列である', () => {
  // Given/When/Then: 行はすべて配列（空でも可）
  for (const row of [...FIRST_PHOTO_ROWS, ...SECOND_PHOTO_ROWS]) {
    assert.ok(Array.isArray(row))
  }
})

test('photoRows: FIRST は前半写真を idx%3 で振り分けた結果と一致する', () => {
  // Given: 全写真の前半（floor(N/2) 件）
  const half = Math.floor(E_ROOM_PHOTOS.length / 2)
  const first = E_ROOM_PHOTOS.slice(0, half)
  // When/Then: 現行の分割ロジックと構造・要素順が一致
  assert.deepEqual(FIRST_PHOTO_ROWS, expectedRows(first))
})

test('photoRows: SECOND は後半写真を idx%3 で振り分けた結果と一致する', () => {
  // Given: 全写真の後半
  const half = Math.floor(E_ROOM_PHOTOS.length / 2)
  const second = E_ROOM_PHOTOS.slice(half)
  // When/Then: 現行の分割ロジックと構造・要素順が一致
  assert.deepEqual(SECOND_PHOTO_ROWS, expectedRows(second))
})

test('photoRows: 全行の写真総数は元の写真枚数と一致する（欠落なし）', () => {
  // Given/When: FIRST と SECOND の全行を平坦化した総数
  const total = FIRST_PHOTO_ROWS.flat().length + SECOND_PHOTO_ROWS.flat().length
  // Then: 分割で写真が失われない
  assert.equal(total, E_ROOM_PHOTOS.length)
})
