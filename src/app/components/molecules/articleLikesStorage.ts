export const ARTICLE_LIKES_STORAGE_KEY = 'article_likes'

type ArticleLikes = Record<string, boolean>

// 空文字も未保存と同じ扱いにし、JSON として読めない値は SyntaxError をそのまま投げる。
const parseArticleLikes = (stored: string | null): ArticleLikes =>
  JSON.parse(stored || '{}')

export const isArticleLiked = (
  stored: string | null,
  articleId: string,
): boolean => !!parseArticleLikes(stored)[articleId]

export const nextArticleLikes = (
  stored: string | null,
  articleId: string,
  liked: boolean,
): string => {
  const userLikes = parseArticleLikes(stored)
  if (liked) {
    userLikes[articleId] = true
  } else {
    delete userLikes[articleId]
  }
  return JSON.stringify(userLikes)
}
