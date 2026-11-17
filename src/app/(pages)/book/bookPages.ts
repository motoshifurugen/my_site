export type BookmarkData = {
  title: string // 表：栞タイトル
  content: string // 裏：コンテンツ
}

export type ChapterContent = {
  title: string // 章タイトル（例：「第1章」「はじめに」）
  pages: string[] // 章内の各ページのテキスト
  bookmark?: BookmarkData | null // 章末の栞（オプション）
}

type PageMappingEntry = {
  type: 'cover' | 'table-of-contents' | 'content' | 'bookmark' | 'back-cover'
  chapterIndex?: number
  pageIndex?: number
  bookmark?: BookmarkData
}

export const splitTextIntoPages = (
  text: string,
  maxLines: number = 10,
): string[] => {
  const lines = text.split('\n')
  const pages: string[] = []
  let currentPage: string[] = []

  for (const line of lines) {
    currentPage.push(line)
    if (currentPage.length >= maxLines) {
      pages.push(currentPage.join('\n'))
      currentPage = []
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage.join('\n'))
  }

  return pages
}

export const buildPageMapping = (
  chapters: readonly ChapterContent[],
): PageMappingEntry[] => {
  const mapping: PageMappingEntry[] = [
    { type: 'cover' },
    { type: 'table-of-contents' },
  ]

  chapters.forEach((chapter, chapterIndex) => {
    chapter.pages.forEach((_, pageIndex) => {
      mapping.push({ type: 'content', chapterIndex, pageIndex })
    })

    if (chapter.bookmark) {
      mapping.push({ type: 'bookmark', bookmark: chapter.bookmark })
    }
  })

  mapping.push({ type: 'back-cover' })

  return mapping
}
