// app/api/likes/route.ts
import { Octokit } from '@octokit/rest'
import { NextRequest, NextResponse } from 'next/server'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const GITHUB_OWNER = process.env.GITHUB_OWNER || ''
const GITHUB_REPO = process.env.GITHUB_REPO || ''
const LIKES_ISSUE_LABEL = 'blog-likes'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const articleId = url.searchParams.get('articleId')

    if (!articleId) {
      return NextResponse.json({ error: '記事IDが必要です' }, { status: 400 })
    }

    // GitHub Issueからいいね数を取得
    const likeData = await getLikeCount(articleId)
    return NextResponse.json(likeData)
  } catch (error) {
    console.error('いいね取得エラー:', error)
    return NextResponse.json(
      { error: 'いいね数の取得に失敗しました' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  const { articleId, liked } = await request.json()

  if (!articleId) {
    return NextResponse.json({ error: '記事IDが必要です' }, { status: 400 })
  }

  try {
    // いいねを更新
    const likeData = await updateLike(articleId, liked)
    return NextResponse.json(likeData)
  } catch (error) {
    console.error('いいね更新エラー:', error)
    return NextResponse.json(
      { error: 'いいね数の更新に失敗しました' },
      { status: 500 },
    )
  }
}

// いいね数を取得する関数
async function getLikeCount(articleId: string) {
  // 当該記事のいいね管理用Issueを検索
  const issues = await octokit.issues.listForRepo({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    labels: LIKES_ISSUE_LABEL,
    state: 'open',
  })

  // 記事IDに対応するIssueを探す
  const likeIssue = issues.data.find(
    (issue) => issue.title === `likes-${articleId}`,
  )

  if (likeIssue) {
    // Issueのbodyからいいね数を取得
    const likeCount = parseLikeCount(likeIssue.body || '0')
    return {
      articleId,
      likeCount,
      issueNumber: likeIssue.number,
    }
  } else {
    // 記事のいいねIssueがまだない場合は新規作成
    const newIssue = await octokit.issues.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title: `likes-${articleId}`,
      body: '0',
      labels: [LIKES_ISSUE_LABEL],
    })

    return {
      articleId,
      likeCount: 0,
      issueNumber: newIssue.data.number,
    }
  }
}

// いいねを更新する関数
async function updateLike(articleId: string, liked: boolean) {
  // 現在のいいね情報を取得
  const currentLike = await getLikeCount(articleId)
  const issueNumber = currentLike.issueNumber

  // いいね数を更新
  const newLikeCount = liked
    ? currentLike.likeCount + 1
    : Math.max(0, currentLike.likeCount - 1)

  // Issueを更新
  await octokit.issues.update({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    issue_number: issueNumber,
    body: newLikeCount.toString(),
  })

  return {
    articleId,
    likeCount: newLikeCount,
    issueNumber,
    liked,
  }
}

// Issueのbodyからいいね数を解析
function parseLikeCount(body: string): number {
  const count = parseInt(body.trim(), 10)
  return isNaN(count) ? 0 : count
}
