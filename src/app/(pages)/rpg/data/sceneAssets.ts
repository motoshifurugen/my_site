// 章データが使う背景・人物画像のキーの一覧。
// テスト（node --test）は PNG を読めないので、このファイルは画像を import しない。
// キーと画像の対応は ChapterPlayer が持つ。

export const BACKGROUND_KEYS = [
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
] as const

export type BackgroundKey = (typeof BACKGROUND_KEYS)[number]

export const CHARACTER_IMAGE_KEYS = [
  'aoba_1.png',
  'aoba_2.png',
  'aoba_3.png',
  'aoba_4.png',
  'kise_1.png',
  'kise_2.png',
  'kise_3.png',
  'saegusa_1.png',
] as const

export type CharacterImageKey = (typeof CHARACTER_IMAGE_KEYS)[number]

const backgroundKeys: readonly string[] = BACKGROUND_KEYS
const characterImageKeys: readonly string[] = CHARACTER_IMAGE_KEYS

export const isBackgroundKey = (value: string): value is BackgroundKey =>
  backgroundKeys.includes(value)

export const isCharacterImageKey = (
  value: string,
): value is CharacterImageKey => characterImageKeys.includes(value)

// Object のリテラルだと 'constructor' などの組み込みのキーで関数を返すので Map にする
const FURIGANA = new Map<string, string>([
  ['赤羽', 'あかばね'],
  ['青葉', 'あおば'],
  ['黄瀬', 'きせ'],
  ['三枝', 'さえぐさ'],
])

export const getFurigana = (speaker: string): string =>
  FURIGANA.get(speaker) ?? ''
