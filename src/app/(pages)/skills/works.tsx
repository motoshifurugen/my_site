import worksData from '@/data/works.json'
import { WorkEntry } from '@/types/works'
import { ReactElement } from 'react'
import { BiLinkExternal } from 'react-icons/bi'
import { useI18n } from '../../../i18n/context'
import { Locale, TranslationKeys } from '../../../i18n/types'

type Work = {
  src: string
  alt: string
  title: string | ReactElement
  description: string
  tags: string[]
  date: string
}

type TagTranslations = TranslationKeys['skills']['tags']

const TRANSLATED_TAG_PREFIX = 'tag:'

const workEntries: WorkEntry[] = worksData

const isTagKey = (
  tags: TagTranslations,
  key: string,
): key is keyof TagTranslations => Object.hasOwn(tags, key)

export const resolveWorkTag = (tag: string, tags: TagTranslations): string => {
  if (!tag.startsWith(TRANSLATED_TAG_PREFIX)) {
    return tag
  }
  const key = tag.slice(TRANSLATED_TAG_PREFIX.length)
  if (!isTagKey(tags, key)) {
    throw new Error(`Unknown tag key in works.json: ${tag}`)
  }
  return tags[key]
}

const renderTitle = (
  entry: WorkEntry,
  locale: Locale,
): string | ReactElement => {
  const title = entry.title[locale]
  if (entry.url === undefined) {
    return title
  }
  return (
    <a
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1"
    >
      {title}
      <BiLinkExternal className="inline-block" />
    </a>
  )
}

const toWork = (
  entry: WorkEntry,
  locale: Locale,
  tags: TagTranslations,
): Work => ({
  src: entry.image,
  alt: entry.id,
  title: renderTitle(entry, locale),
  description: entry.description[locale],
  tags: entry.tags.map((tag) => resolveWorkTag(tag, tags)),
  date: entry.date,
})

const byDateDesc = (a: Work, b: Work): number =>
  new Date(b.date).getTime() - new Date(a.date).getTime()

export const useWorks = (): Work[] => {
  const { locale, t } = useI18n()
  return workEntries
    .map((entry) => toWork(entry, locale, t.skills.tags))
    .sort(byDateDesc)
}
