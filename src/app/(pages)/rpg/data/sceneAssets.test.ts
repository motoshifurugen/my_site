// Issue #387: 背景と人物画像のキーの一覧（data/sceneAssets.ts）と章データの対応を固定する。
//
// 章データの background と image の型は string なので、キーを打ち間違えても型検査は落ちない。
// ChapterPlayer は合わない背景のキーなら stationMorning を出し、合わない人物画像のキーなら
// 人物を描かない。全言語・全ルートの章データが一覧にあるキーだけを使うことを確かめる。
// あわせて、ChapterPlayer から移した getFurigana の動きを固定する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { type Chapter6Route, getChapters, type Language } from './chapters'
import {
  BACKGROUND_KEYS,
  CHARACTER_IMAGE_KEYS,
  getFurigana,
  isBackgroundKey,
  isCharacterImageKey,
} from './sceneAssets'

const LANGUAGES: Language[] = ['ja', 'en']
const ROUTES: Chapter6Route[] = [null, 'bad_end', 'true_end', 'another_end']

const CASES = LANGUAGES.flatMap((language) =>
  ROUTES.map((route) => ({ language, route })),
)

const backgroundKeys: readonly string[] = BACKGROUND_KEYS
const characterImageKeys: readonly string[] = CHARACTER_IMAGE_KEYS

test('BACKGROUND_KEYS: ChapterPlayer が知っている背景のキー 12 個を重複なく持つ', () => {
  // Given: ChapterPlayer の三項演算子が比べていた 12 個のキー
  const expected = [
    'station_morning',
    'office_morning',
    'meeting_room',
    'bar_night',
    'cafe_lunch',
    'blue_leaf',
    'rain_road',
    'night_coffee',
    'aoba_room',
    'after_cafe',
    'client_room',
    'night_platform',
  ]
  // When: 一覧を取り出す
  // Then: 同じ 12 個を同じ順で持ち、重複が無い
  assert.deepEqual([...BACKGROUND_KEYS], expected)
  assert.equal(new Set(BACKGROUND_KEYS).size, BACKGROUND_KEYS.length)
})

test('CHARACTER_IMAGE_KEYS: ChapterPlayer が知っている人物画像のキー 8 個を重複なく持つ', () => {
  // Given: ChapterPlayer の characterImageMap にあった 8 個のキー
  const expected = [
    'aoba_1.png',
    'aoba_2.png',
    'aoba_3.png',
    'aoba_4.png',
    'kise_1.png',
    'kise_2.png',
    'kise_3.png',
    'saegusa_1.png',
  ]
  // When: 一覧を取り出す
  // Then: 同じ 8 個を同じ順で持ち、重複が無い
  assert.deepEqual([...CHARACTER_IMAGE_KEYS], expected)
  assert.equal(new Set(CHARACTER_IMAGE_KEYS).size, CHARACTER_IMAGE_KEYS.length)
})

test('isBackgroundKey: 一覧にあるキーはすべて true', () => {
  // Given: 背景のキーの一覧
  // When: 各キーを判定する
  // Then: すべて true
  for (const key of BACKGROUND_KEYS) {
    assert.equal(isBackgroundKey(key), true, key)
  }
})

test('isBackgroundKey: 一覧に無い文字列は false', () => {
  // Given: 空文字、大文字違い、人物画像のキー、Object の組み込みのキー
  const values = [
    '',
    'Station_Morning',
    'station_morning ',
    'aoba_1.png',
    'toString',
    'constructor',
    '__proto__',
  ]
  // When: 各値を判定する
  // Then: すべて false（合わないキーとして stationMorning に戻せる）
  for (const value of values) {
    assert.equal(isBackgroundKey(value), false, JSON.stringify(value))
  }
})

test('isCharacterImageKey: 一覧にあるキーはすべて true', () => {
  // Given: 人物画像のキーの一覧
  // When: 各キーを判定する
  // Then: すべて true
  for (const key of CHARACTER_IMAGE_KEYS) {
    assert.equal(isCharacterImageKey(key), true, key)
  }
})

test('isCharacterImageKey: 一覧に無い文字列は false', () => {
  // Given: 空文字、拡張子なし、無い番号、背景のキー、Object の組み込みのキー
  const values = [
    '',
    'aoba_1',
    'aoba_5.png',
    'Aoba_1.png',
    'saegusa_2.png',
    'station_morning',
    'toString',
    'constructor',
    '__proto__',
  ]
  // When: 各値を判定する
  // Then: すべて false（合わないキーとして人物を描かずに済む）
  for (const value of values) {
    assert.equal(isCharacterImageKey(value), false, JSON.stringify(value))
  }
})

for (const { language, route } of CASES) {
  test(`章データ（${language}, ${route}）: どのシーンの background も背景のキーの一覧にある`, () => {
    // Given: 言語とルートの組み合わせで取った章
    const chapters = getChapters(language, route)
    // When: 全章・全シーンの background を調べる
    let checked = 0
    for (const chapter of chapters) {
      for (const scene of chapter.scenes) {
        // Then: 一覧にあるキーだけを使っている
        assert.ok(
          backgroundKeys.includes(scene.background),
          `${language}/${route}/${scene.id}: 背景のキー ${JSON.stringify(scene.background)} が一覧に無い`,
        )
        checked++
      }
    }
    // Then: 何も確かめずに通っていない
    assert.ok(checked > 0, `${language}/${route}: シーンが 1 つも無い`)
  })

  test(`章データ（${language}, ${route}）: シーンと行のどの image も人物画像のキーの一覧にある`, () => {
    // Given: 言語とルートの組み合わせで取った章
    const chapters = getChapters(language, route)
    // When: 全シーンの characters と、全行の characters の image を調べる
    let checked = 0
    for (const chapter of chapters) {
      for (const scene of chapter.scenes) {
        const characters = [
          ...(scene.characters ?? []),
          ...scene.lines.flatMap((line) => line.characters ?? []),
        ]
        for (const character of characters) {
          // Then: 一覧にあるキーだけを使っている
          assert.ok(
            characterImageKeys.includes(character.image),
            `${language}/${route}/${scene.id}: 人物画像のキー ${JSON.stringify(character.image)} が一覧に無い`,
          )
          checked++
        }
      }
    }
    // Then: 何も確かめずに通っていない
    assert.ok(checked > 0, `${language}/${route}: 人物が 1 人も無い`)
  })
}

test('getFurigana: 表にある名前ならふりがなを返す', () => {
  // Given: 表にある 4 人の名前
  const cases: [string, string][] = [
    ['赤羽', 'あかばね'],
    ['青葉', 'あおば'],
    ['黄瀬', 'きせ'],
    ['三枝', 'さえぐさ'],
  ]
  // When: 各名前のふりがなを求める
  // Then: 表のとおりのふりがな
  for (const [speaker, furigana] of cases) {
    assert.equal(getFurigana(speaker), furigana, speaker)
  }
})

test('getFurigana: 表に無い名前なら空文字を返す', () => {
  // Given: 空文字、表に無い話者、英語表記の名前、空白付きの名前、Object の組み込みのキー
  const speakers = [
    '',
    '上司',
    'Akabane',
    'Aoba',
    '赤羽 ',
    'toString',
    'constructor',
    '__proto__',
  ]
  // When: 各名前のふりがなを求める
  // Then: すべて空文字
  for (const speaker of speakers) {
    assert.equal(getFurigana(speaker), '', JSON.stringify(speaker))
  }
})
