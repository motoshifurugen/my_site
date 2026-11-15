import { chapter1, type Scene } from './chapter1'
import { chapter1 as chapter1Eng } from './chapter1_eng'
import { chapter2 } from './chapter2'
import { chapter2 as chapter2Eng } from './chapter2_eng'
import { chapter3 } from './chapter3'
import { chapter3 as chapter3Eng } from './chapter3_eng'
import { chapter4 } from './chapter4'
import { chapter4 as chapter4Eng } from './chapter4_eng'
import { chapter5 } from './chapter5'
import { chapter5 as chapter5Eng } from './chapter5_eng'
import { chapter6a } from './chapter6a'
import { chapter6a as chapter6aEng } from './chapter6a_eng'
import { chapter6b } from './chapter6b'
import { chapter6b as chapter6bEng } from './chapter6b_eng'
import { chapter6c } from './chapter6c'
import { chapter6c as chapter6cEng } from './chapter6c_eng'

export type Chapter6Route = 'bad_end' | 'true_end' | 'another_end' | null

export type Language = 'ja' | 'en'

type Chapter = { title: string; scenes: Scene[] }

const CHAPTERS_BY_LANGUAGE: Record<
  Language,
  { base: Chapter[]; chapter6: Record<NonNullable<Chapter6Route>, Chapter> }
> = {
  ja: {
    base: [chapter1, chapter2, chapter3, chapter4, chapter5],
    chapter6: {
      bad_end: chapter6a,
      true_end: chapter6b,
      another_end: chapter6c,
    },
  },
  en: {
    base: [chapter1Eng, chapter2Eng, chapter3Eng, chapter4Eng, chapter5Eng],
    chapter6: {
      bad_end: chapter6aEng,
      true_end: chapter6bEng,
      another_end: chapter6cEng,
    },
  },
}

export const getChapters = (
  language: Language,
  chapter6Route: Chapter6Route,
): Chapter[] => {
  const { base, chapter6 } = CHAPTERS_BY_LANGUAGE[language]
  return chapter6Route === null ? [...base] : [...base, chapter6[chapter6Route]]
}
