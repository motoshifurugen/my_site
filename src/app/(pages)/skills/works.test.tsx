// useWorks と resolveWorkTag の振る舞いを固定するテスト（Issue #319）。
//
// 実績のデータは src/data/works.json に移した。useWorks はこの JSON を読み、
// useI18n の locale に合う文を返す。返す形（src・alt・title・description・tags・date）と、
// 日付の降順の並びは移す前と変えない。
// タグの "tag:<キー>" は t.skills.tags.<キー> を指し、知らないキーは例外で止める。
//
// 期待値は works.json から作り、19 件の値は書き写さない。
// 実績を足すたびにこのテストを直さずに済むようにするため。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { isValidElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import worksData from '../../../data/works.json'
import { I18nProvider } from '../../../i18n/context'
import { translations } from '../../../i18n/translations'
import { Locale } from '../../../i18n/types'
import { WorkEntry } from '../../../types/works'
import { resolveWorkTag, useWorks } from './works'

type Works = ReturnType<typeof useWorks>

// useWorks を呼ぶ前に写しを取る。useWorks が JSON の配列をその場で並べ替えたかを、この写しと比べて調べる。
const PRISTINE_ENTRIES: WorkEntry[] = structuredClone(worksData)

const TRANSLATED_TAG_PREFIX = 'tag:'

interface WorksProbeProps {
  onWorks: (works: Works) => void
}

const WorksProbe = ({ onWorks }: WorksProbeProps) => {
  onWorks(useWorks())
  return null
}

const collectWorks = (locale: Locale): Works => {
  const collected: Works[] = []
  renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <WorksProbe onWorks={(works) => collected.push(works)} />
    </I18nProvider>,
  )
  assert.equal(collected.length, 1, 'useWorks を 1 回だけ呼ぶ')
  return collected[0]
}

const entryOf = (alt: string): WorkEntry => {
  const entry = PRISTINE_ENTRIES.find((candidate) => candidate.id === alt)
  assert.ok(entry, `alt=${alt} に当たる works.json の id があること`)
  return entry
}

const expectedTag = (tag: string, locale: Locale): string => {
  if (!tag.startsWith(TRANSLATED_TAG_PREFIX)) {
    return tag
  }
  const key = tag.slice(TRANSLATED_TAG_PREFIX.length)
  const translated = Object.entries(translations[locale].skills.tags).find(
    ([candidate]) => candidate === key,
  )
  assert.ok(translated, `${tag} の翻訳が ${locale} にあること`)
  return translated[1]
}

const toTime = (date: string): number => new Date(date).getTime()

describe('resolveWorkTag', () => {
  test('should return the tag unchanged when it has no tag: prefix', () => {
    // Given: 翻訳しないタグ（英字と日本語）
    const tags = ['Vue.js', 'AIエージェント']
    // When: 英語のタグ翻訳で解決する
    const resolved = tags.map((tag) =>
      resolveWorkTag(tag, translations.en.skills.tags),
    )
    // Then: どの言語でもそのまま出す
    assert.deepEqual(resolved, tags)
  })

  test('should return the Japanese translation when given Japanese tags', () => {
    // Given: 翻訳キーを指すタグと日本語のタグ翻訳
    const tags = translations.ja.skills.tags
    // When: 解決する
    const team = resolveWorkTag('tag:teamDevelopment', tags)
    const personal = resolveWorkTag('tag:personalDevelopment', tags)
    // Then: 日本語の翻訳を返す
    assert.equal(team, translations.ja.skills.tags.teamDevelopment)
    assert.equal(personal, translations.ja.skills.tags.personalDevelopment)
  })

  test('should return the English translation when given English tags', () => {
    // Given: 翻訳キーを指すタグと英語のタグ翻訳
    const tags = translations.en.skills.tags
    // When: 解決する
    const team = resolveWorkTag('tag:teamDevelopment', tags)
    const personal = resolveWorkTag('tag:personalDevelopment', tags)
    // Then: 英語の翻訳を返す
    assert.equal(team, translations.en.skills.tags.teamDevelopment)
    assert.equal(personal, translations.en.skills.tags.personalDevelopment)
  })

  test('should throw when the key is not in the tag translations', () => {
    // Given: 翻訳にないキー
    const tag = 'tag:unknownKey'
    // When / Then: 生の文字列を出さずに例外で止める
    assert.throws(() => resolveWorkTag(tag, translations.ja.skills.tags))
  })

  test('should throw when the key after tag: is empty', () => {
    // Given: キーのない tag:
    const tag = 'tag:'
    // When / Then: 例外で止める
    assert.throws(() => resolveWorkTag(tag, translations.ja.skills.tags))
  })

  test('should throw when the key is an inherited property name', () => {
    // Given: Object.prototype にある名前（翻訳の持つキーではない）
    const tag = 'tag:toString'
    // When / Then: 例外で止める
    assert.throws(() => resolveWorkTag(tag, translations.ja.skills.tags))
  })
})

describe('useWorks', () => {
  test('should return one work for each entry in works.json', () => {
    // Given: works.json の全件
    // When: 日本語で useWorks を呼ぶ
    const works = collectWorks('ja')
    // Then: 件数と id の集合が works.json と一致する
    assert.deepEqual(
      works.map((work) => work.alt).sort(),
      PRISTINE_ENTRIES.map((entry) => entry.id).sort(),
    )
  })

  test('should sort works by date in descending order', () => {
    // Given: 日付がばらばらに並んだ works.json
    // When: useWorks を呼ぶ
    const times = collectWorks('ja').map((work) => toTime(work.date))
    // Then: 新しい日付から順に並ぶ
    times.slice(1).forEach((time, index) => {
      assert.ok(times[index] >= time, `${index} 番目と次の日付が降順であること`)
    })
  })

  test('should keep works.json order for works with the same date', () => {
    // Given: works.json での並び
    const jsonOrder = PRISTINE_ENTRIES.map((entry) => entry.id)
    // When: useWorks を呼ぶ
    const works = collectWorks('ja')
    // Then: 同じ日付どうしは works.json の順のまま
    works.slice(1).forEach((work, index) => {
      const previous = works[index]
      if (previous.date === work.date) {
        assert.ok(
          jsonOrder.indexOf(previous.alt) < jsonOrder.indexOf(work.alt),
          `${previous.alt} と ${work.alt} は works.json の順であること`,
        )
      }
    })
  })

  test('should not reorder the imported works.json array', () => {
    // Given: useWorks を呼ぶ前の works.json の並び
    const before = PRISTINE_ENTRIES.map((entry) => entry.id)
    // When: 両方の言語で useWorks を呼ぶ
    collectWorks('ja')
    collectWorks('en')
    // Then: import した配列の並びは変わらない
    assert.deepEqual(
      worksData.map((entry) => entry.id),
      before,
    )
  })

  test('should map image to src and id to alt', () => {
    // Given: works.json の全件
    // When: useWorks を呼ぶ
    const works = collectWorks('ja')
    // Then: src は image、alt は id
    works.forEach((work) => {
      assert.equal(work.src, entryOf(work.alt).image)
    })
  })

  test('should return date as written in works.json', () => {
    // Given: works.json の全件
    // When: useWorks を呼ぶ
    const works = collectWorks('ja')
    // Then: date は YYYY-MM のまま
    works.forEach((work) => {
      assert.equal(work.date, entryOf(work.alt).date)
    })
  })

  for (const locale of ['ja', 'en'] as const) {
    test(`should return ${locale} descriptions when locale is ${locale}`, () => {
      // Given: works.json の全件
      // When: locale を指定して useWorks を呼ぶ
      const works = collectWorks(locale)
      // Then: description はその言語の文
      works.forEach((work) => {
        assert.equal(work.description, entryOf(work.alt).description[locale])
      })
    })

    test(`should return ${locale} titles as plain text when url is absent`, () => {
      // Given: url を持たない実績
      // When: locale を指定して useWorks を呼ぶ
      const works = collectWorks(locale).filter(
        (work) => entryOf(work.alt).url === undefined,
      )
      // Then: title はその言語の文字列
      assert.ok(works.length > 0)
      works.forEach((work) => {
        assert.equal(work.title, entryOf(work.alt).title[locale])
      })
    })

    test(`should resolve tags for ${locale}`, () => {
      // Given: 翻訳キーを指すタグを含む works.json
      // When: locale を指定して useWorks を呼ぶ
      const works = collectWorks(locale)
      // Then: tag: のタグはその言語の翻訳に、ほかのタグはそのままになる
      works.forEach((work) => {
        assert.deepEqual(
          work.tags,
          entryOf(work.alt).tags.map((tag) => expectedTag(tag, locale)),
        )
      })
    })
  }

  test('should render the title as an external link with an icon when url is present', () => {
    // Given: url を持つ実績
    // When: 英語で useWorks を呼び、title を描画する
    const works = collectWorks('en').filter(
      (work) => entryOf(work.alt).url !== undefined,
    )
    // Then: 移す前と同じ属性の <a> に、英語のタイトルとアイコンの <svg> が入る
    assert.ok(works.length > 0)
    works.forEach((work) => {
      const entry = entryOf(work.alt)
      assert.ok(
        isValidElement(work.title),
        `${entry.id} の title は要素であること`,
      )
      const html = renderToStaticMarkup(work.title)
      const anchor = new RegExp(
        `^<a href="([^"]+)" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1">(.*)</a>$`,
      ).exec(html)
      assert.ok(
        anchor,
        `${entry.id} の title は外部リンクの <a> であること: ${html}`,
      )
      assert.equal(anchor[1], entry.url)
      const [, , content] = anchor
      const escapedTitle = renderToStaticMarkup(<>{entry.title.en}</>)
      assert.ok(
        content.startsWith(escapedTitle),
        `${entry.id} の <a> は英語のタイトルで始まること`,
      )
      assert.match(
        content.slice(escapedTitle.length),
        /^<svg\b[^>]*class="inline-block"[^>]*>.*<\/svg>$/,
      )
    })
  })
})
