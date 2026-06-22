import assert from 'node:assert/strict'
import { test } from 'node:test'
import { translations } from '../../../i18n/translations'
import { announcementsData } from './MessageData'

const locales = ['ja', 'en'] as const

test('MessageData: 全 titleKey が ja/en 両ロケールの items に存在する', () => {
  // Given: 全お知らせデータ
  for (const locale of locales) {
    const items = translations[locale].announcements.items
    for (const a of announcementsData) {
      // When/Then: titleKey が両ロケールの items に存在し、title が文字列である
      assert.ok(
        items[a.titleKey],
        `${locale}: titleKey "${a.titleKey}" が未定義`,
      )
      assert.equal(typeof items[a.titleKey].title, 'string')
    }
  }
})

test('MessageData: link を持つ全 textKey が ja/en 両ロケールの items に存在する', () => {
  // Given: link を持つお知らせデータ
  for (const locale of locales) {
    const items = translations[locale].announcements.items
    for (const a of announcementsData) {
      if (!a.link) continue
      // When/Then: textKey が両ロケールの items に存在し、linkText が文字列である
      assert.ok(
        items[a.link.textKey],
        `${locale}: textKey "${a.link.textKey}" が未定義`,
      )
      assert.equal(typeof items[a.link.textKey].linkText, 'string')
    }
  }
})
