// Issue #386: /api/likes の articleId の検査。
// GET は Issue が見つからないと作るので、記事の slug の形に合わない ID は GitHub へ渡す前に拒否する。
// findLikeIssue は articleId を Search クエリの "likes-<articleId>" へ入れるので、
// " や空白など、クエリの意味を変える文字もここで止める。

export const MAX_ARTICLE_ID_LENGTH = 100

type ArticleIdResult =
  { ok: true; articleId: string } | { ok: false; error: string }

const ARTICLE_ID_PATTERN = new RegExp(
  `^[A-Za-z0-9_-]{1,${MAX_ARTICLE_ID_LENGTH}}$`,
)

// 空文字と文字列でない値は、これまでの route と同じく「ID が無い」として扱う。
export function parseArticleId(rawArticleId: unknown): ArticleIdResult {
  if (typeof rawArticleId !== 'string' || rawArticleId === '') {
    return { ok: false, error: '記事IDが必要です' }
  }
  if (!ARTICLE_ID_PATTERN.test(rawArticleId)) {
    return { ok: false, error: '記事IDの形式が不正です' }
  }
  return { ok: true, articleId: rawArticleId }
}
