import { chapter5 } from './chapter5'
import type { Chapter6Route, Language } from './chapters'

const CHAPTER6_NUMBER = 6
const CHAPTER5_INDEX = 4

export const getInitialChapterIndex = (chapter: string | null): number => {
  if (!chapter) return 0
  const chapterNum = parseInt(chapter, 10)
  if (chapterNum >= 1 && chapterNum <= 5) return chapterNum - 1
  // 第6章は第5章の最後のシーンにある選択肢から始める
  if (chapterNum === CHAPTER6_NUMBER) return CHAPTER5_INDEX
  return 0
}

export const getInitialSceneIndex = (chapter: string | null): number => {
  if (!chapter) return 0
  // 第6章は第5章の最後のシーンにある選択肢から始める
  if (parseInt(chapter, 10) === CHAPTER6_NUMBER) {
    return chapter5.scenes.length - 1
  }
  return 0
}

export const isChapter6Route = (
  choiceId: string,
): choiceId is NonNullable<Chapter6Route> =>
  choiceId === 'bad_end' ||
  choiceId === 'true_end' ||
  choiceId === 'another_end'

export const parseLanguage = (raw: string | null): Language =>
  raw === 'en' ? 'en' : 'ja'
