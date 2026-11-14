// src/data/works.json（/skills の制作実績）の中身を検査するテスト（Issue #319）。
//
// 実績は「works.json に 1 件足し、public に画像を 1 枚置く」だけで増やす。
// 型検査は JSON の余分なキーや空文字、日付の書式、画像の有無までは見ないので、
// ここで JSON を unknown として読み、1 件ずつ確かめる。
// 19 件の値そのものは固定しない。固定すると、実績を足すたびにこのテストも直すことになる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { resolveWorkTag } from '../app/(pages)/skills/works'
import { locales } from '../i18n/config'
import { translations } from '../i18n/translations'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const WORKS_JSON_PATH = join(ROOT, 'src', 'data', 'works.json')
const PUBLIC_DIR = join(ROOT, 'public')

const REQUIRED_KEYS = [
  'id',
  'image',
  'title',
  'description',
  'tags',
  'date',
] as const
const OPTIONAL_KEYS = ['url'] as const
const ALLOWED_KEYS: readonly string[] = [...REQUIRED_KEYS, ...OPTIONAL_KEYS]
const LOCALIZED_KEYS = ['title', 'description'] as const
const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/

type RawEntry = Record<string, unknown>

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const loadEntries = (): RawEntry[] => {
  const parsed: unknown = JSON.parse(readFileSync(WORKS_JSON_PATH, 'utf8'))
  assert.ok(Array.isArray(parsed), 'works.json のトップレベルは配列であること')
  return parsed.map((entry: unknown, index) => {
    assert.ok(isRecord(entry), `works.json[${index}] はオブジェクトであること`)
    return entry
  })
}

const labelOf = (entry: RawEntry, index: number): string =>
  typeof entry.id === 'string'
    ? `works.json[${index}] (${entry.id})`
    : `works.json[${index}]`

const assertNonEmptyString = (value: unknown, label: string): string => {
  assert.equal(typeof value, 'string', `${label} は文字列であること`)
  assert.ok(
    typeof value === 'string' && value.trim() !== '',
    `${label} は空でないこと`,
  )
  return value
}

const stringField = (entry: RawEntry, key: string, index: number): string =>
  assertNonEmptyString(entry[key], `${labelOf(entry, index)}.${key}`)

const tagsOf = (entry: RawEntry, index: number): string[] => {
  const tags = entry.tags
  assert.ok(
    Array.isArray(tags),
    `${labelOf(entry, index)}.tags は配列であること`,
  )
  return tags.map((tag: unknown, tagIndex) =>
    assertNonEmptyString(tag, `${labelOf(entry, index)}.tags[${tagIndex}]`),
  )
}

test('should contain at least one work entry', () => {
  // Given: リポジトリの works.json
  // When: 読み込む
  const entries = loadEntries()
  // Then: 実績が 1 件以上ある
  assert.ok(entries.length > 0)
})

test('should have non-empty string id, image and date in every entry', () => {
  // Given: works.json の全件
  const entries = loadEntries()
  // When / Then: id・image・date が空でない文字列である
  entries.forEach((entry, index) => {
    for (const key of ['id', 'image', 'date']) {
      stringField(entry, key, index)
    }
  })
})

test('should have non-empty title and description for every locale', () => {
  // Given: works.json の全件と、サイトが対応する言語
  const entries = loadEntries()
  // When / Then: title と description が言語ごとの空でない文字列を持つ
  entries.forEach((entry, index) => {
    for (const key of LOCALIZED_KEYS) {
      const localized = entry[key]
      const label = `${labelOf(entry, index)}.${key}`
      assert.ok(isRecord(localized), `${label} はオブジェクトであること`)
      assert.deepEqual(
        Object.keys(localized).sort(),
        [...locales].sort(),
        `${label} のキーは対応言語と一致すること`,
      )
      for (const locale of locales) {
        assertNonEmptyString(localized[locale], `${label}.${locale}`)
      }
    }
  })
})

test('should have tags as an array of non-empty strings', () => {
  // Given: works.json の全件
  const entries = loadEntries()
  // When / Then: tags は空でない文字列の配列である
  entries.forEach((entry, index) => {
    tagsOf(entry, index)
  })
})

test('should not contain keys other than the documented fields', () => {
  // Given: works.json の全件（"Url" のような綴り違いは型検査を通り、リンクが黙って消える）
  const entries = loadEntries()
  // When / Then: 項目は id・image・url・title・description・tags・date だけ
  entries.forEach((entry, index) => {
    const unknownKeys = Object.keys(entry).filter(
      (key) => !ALLOWED_KEYS.includes(key),
    )
    assert.deepEqual(
      unknownKeys,
      [],
      `${labelOf(entry, index)} に未知の項目がないこと`,
    )
  })
})

test('should use an https URL when url is present', () => {
  // Given: url を持つ実績
  const entries = loadEntries()
  // When / Then: url は https:// で始まる文字列である
  entries.forEach((entry, index) => {
    if (!('url' in entry)) {
      return
    }
    const url = stringField(entry, 'url', index)
    assert.ok(
      url.startsWith('https://'),
      `${labelOf(entry, index)}.url は https:// で始まること`,
    )
  })
})

test('should not duplicate ids', () => {
  // Given: works.json の全件の id
  const ids = loadEntries().map((entry, index) =>
    stringField(entry, 'id', index),
  )
  // When: 2 回以上出る id を集める
  const duplicated = ids.filter((id, index) => ids.indexOf(id) !== index)
  // Then: 重複がない
  assert.deepEqual(duplicated, [])
})

test('should write date as YYYY-MM', () => {
  // Given: works.json の全件
  const entries = loadEntries()
  // When / Then: date は YYYY-MM（月は 01〜12）
  entries.forEach((entry, index) => {
    const date = stringField(entry, 'date', index)
    assert.match(
      date,
      YEAR_MONTH,
      `${labelOf(entry, index)}.date は YYYY-MM であること`,
    )
  })
})

test('should point image to an existing file under public', () => {
  // Given: works.json の全件
  const entries = loadEntries()
  // When / Then: image は / で始まり、public の下にファイルがある
  entries.forEach((entry, index) => {
    const image = stringField(entry, 'image', index)
    const label = `${labelOf(entry, index)}.image`
    assert.ok(image.startsWith('/'), `${label} は / で始まること`)
    assert.ok(
      existsSync(join(PUBLIC_DIR, image)),
      `${label} のファイル public${image} があること`,
    )
  })
})

test('should name image after id as /images/works/<id>.png', () => {
  // Given: works.json の全件（ほかの実績をコピーして image を直し忘れると、別の実績の画像が出る）
  const entries = loadEntries()
  // When / Then: image は id から決まるパスである
  entries.forEach((entry, index) => {
    const id = stringField(entry, 'id', index)
    const image = stringField(entry, 'image', index)
    assert.equal(
      image,
      `/images/works/${id}.png`,
      `${labelOf(entry, index)}.image は /images/works/<id>.png であること`,
    )
  })
})

test('should resolve every tag in every locale', () => {
  // Given: works.json の全件のタグ（tag: で始まらないタグはそのまま返る）
  const allTags = loadEntries().flatMap((entry, index) => tagsOf(entry, index))
  // When / Then: どの言語でも tag: の翻訳が見つかり、例外にならない
  for (const locale of locales) {
    for (const tag of allTags) {
      assert.doesNotThrow(
        () => resolveWorkTag(tag, translations[locale].skills.tags),
        `${tag} は ${locale} で翻訳できること`,
      )
    }
  }
})
