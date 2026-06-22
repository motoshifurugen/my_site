// app/api/likes/bulk/route.ts
// 記事一覧のいいね数をまとめて返すバルク取得エンドポイント（Issue #166）。
// GET /api/likes/bulk?articleIds=slug1,slug2,... → { likes: { [slug]: number } }
// 読み取り専用。listForRepo を 1 回だけ呼び、サーバ側 N+1 を作らない。
import { NextRequest, NextResponse } from 'next/server'
import { getLikeCountsForSlugs } from '../githubLikes'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const articleIdsParam = url.searchParams.get('articleIds')

  const articleIds = (articleIdsParam || '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0)

  if (articleIds.length === 0) {
    return NextResponse.json({ error: '記事IDが必要です' }, { status: 400 })
  }

  try {
    const likes = await getLikeCountsForSlugs(articleIds)
    return NextResponse.json({ likes })
  } catch (error) {
    console.error('いいね数の一括取得に失敗しました:', error)
    return NextResponse.json(
      { error: 'いいね数の取得に失敗しました' },
      { status: 500 },
    )
  }
}
