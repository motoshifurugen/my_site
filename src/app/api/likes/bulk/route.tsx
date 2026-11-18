// app/api/likes/bulk/route.ts
// 記事一覧のいいね数をまとめて返すバルク取得エンドポイント（Issue #166）。
// GET /api/likes/bulk?articleIds=slug1,slug2,... → { likes: { [slug]: number } }
// 読み取り専用。listForRepo を 1 回だけ呼び、サーバ側 N+1 を作らない。
import { NextRequest, NextResponse } from 'next/server'
import { parseArticleIds } from '../articleIdValidation'
import { getLikeCountsForSlugs } from '../githubLikes'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const parsedArticleIds = parseArticleIds(url.searchParams.get('articleIds'))

  if (!parsedArticleIds.ok) {
    return NextResponse.json({ error: parsedArticleIds.error }, { status: 400 })
  }

  try {
    const likes = await getLikeCountsForSlugs(parsedArticleIds.articleIds)
    return NextResponse.json({ likes })
  } catch (error) {
    console.error('いいね数の一括取得に失敗しました:', error)
    return NextResponse.json(
      { error: 'いいね数の取得に失敗しました' },
      { status: 500 },
    )
  }
}
