// Issue #386: /api/likes の articleId の検査。
// GET は Issue が見つからないと作るので、記事の slug の形に合わない ID は GitHub へ渡す前に拒否する。
// findLikeIssue は articleId を Search クエリの "likes-<articleId>" へ入れるので、
// " や空白など、クエリの意味を変える文字もここで止める。

export const MAX_ARTICLE_ID_LENGTH = 100

// Issue #390: getLikeCountsForSlugs は Issue を per_page: 100 で 1 回しか読まないので、
// これより多い ID を受けても数えきれない。
export const MAX_ARTICLE_IDS = 100

const MISSING_ARTICLE_ID_ERROR = '記事IDが必要です'

type ArticleIdResult =
  { ok: true; articleId: string } | { ok: false; error: string }

type ArticleIdsResult =
  { ok: true; articleIds: string[] } | { ok: false; error: string }

const ARTICLE_ID_PATTERN = new RegExp(
  `^[A-Za-z0-9_-]{1,${MAX_ARTICLE_ID_LENGTH}}$`,
)

// 空文字と文字列でない値は、これまでの route と同じく「ID が無い」として扱う。
export function parseArticleId(rawArticleId: unknown): ArticleIdResult {
  if (typeof rawArticleId !== 'string' || rawArticleId === '') {
    return { ok: false, error: MISSING_ARTICLE_ID_ERROR }
  }
  if (!ARTICLE_ID_PATTERN.test(rawArticleId)) {
    return { ok: false, error: '記事IDの形式が不正です' }
  }
  return { ok: true, articleId: rawArticleId }
}

// 空白の除去と空要素の除外は、これまでの bulk route と同じ扱いにそろえる。
// 件数は形式より先に調べ、多すぎる入力の要素を 1 つずつ検査しない。
export function parseArticleIds(rawArticleIds: unknown): ArticleIdsResult {
  if (typeof rawArticleIds !== 'string') {
    return { ok: false, error: MISSING_ARTICLE_ID_ERROR }
  }

  const articleIds = rawArticleIds
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0)

  if (articleIds.length === 0) {
    return { ok: false, error: MISSING_ARTICLE_ID_ERROR }
  }
  if (articleIds.length > MAX_ARTICLE_IDS) {
    return { ok: false, error: '記事IDが多すぎます' }
  }

  for (const articleId of articleIds) {
    const parsedArticleId = parseArticleId(articleId)
    if (!parsedArticleId.ok) {
      return parsedArticleId
    }
  }
  return { ok: true, articleIds }
}
