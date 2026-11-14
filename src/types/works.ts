import { Locale } from '@/i18n/types'

type LocalizedText = Record<Locale, string>

// src/data/works.json の 1 件。tags の "tag:<キー>" は t.skills.tags.<キー> を指す。
export type WorkEntry = {
  id: string
  image: string
  url?: string
  title: LocalizedText
  description: LocalizedText
  tags: string[]
  date: string
}
