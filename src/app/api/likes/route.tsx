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
  try {
    // より確実にイシューを検索するため、複数の方法を試す
    const likeIssue = await findLikeIssue(articleId)
    
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
      // 作成前に再度確認して重複を防ぐ
      const doubleCheckIssue = await findLikeIssue(articleId)
      
      if (doubleCheckIssue) {
        // 再確認で見つかった場合は既存のイシューを使用
        const likeCount = parseLikeCount(doubleCheckIssue.body || '0')
        return {
          articleId,
          likeCount,
          issueNumber: doubleCheckIssue.number,
        }
      }
      
      // 確実に存在しない場合のみ新規作成
      try {
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
      } catch (createError: any) {
        // イシュー作成に失敗した場合（例：重複タイトルなど）
        console.error('イシュー作成エラー:', createError)
        
        // 作成失敗時は再度検索を試行
        const retryIssue = await findLikeIssue(articleId)
        if (retryIssue) {
          const likeCount = parseLikeCount(retryIssue.body || '0')
          return {
            articleId,
            likeCount,
            issueNumber: retryIssue.number,
          }
        }
        
        // それでも見つからない場合はエラーを投げる
        throw new Error(`いいねイシューの作成に失敗しました: ${createError.message}`)
      }
    }
  } catch (error) {
    console.error('いいね数取得エラー:', error)
    throw error
  }
}

// イシューを検索する関数（複数の方法を試す）
async function findLikeIssue(articleId: string) {
  const targetTitle = `likes-${articleId}`
  
  // 方法1: ラベルで検索（open状態）
  try {
    const openIssues = await octokit.issues.listForRepo({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      labels: LIKES_ISSUE_LABEL,
      state: 'open',
      per_page: 100, // より多くの結果を取得
    })
    
    const foundIssue = openIssues.data.find(
      (issue) => issue.title === targetTitle,
    )
    
    if (foundIssue) {
      return foundIssue
    }
  } catch (error) {
    console.error('open状態のイシュー検索エラー:', error)
  }

  // 方法2: タイトルで直接検索（GitHub Search API使用）
  try {
    const searchQuery = `repo:${GITHUB_OWNER}/${GITHUB_REPO} is:issue "${targetTitle}"`
    const searchResults = await octokit.search.issuesAndPullRequests({
      q: searchQuery,
      per_page: 10,
    })
    
    const foundIssue = searchResults.data.items.find(
      (issue) => issue.title === targetTitle,
    )
    
    if (foundIssue) {
      // 検索結果から詳細情報を取得
      const issueDetails = await octokit.issues.get({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        issue_number: foundIssue.number,
      })
      
      return issueDetails.data
    }
  } catch (error) {
    console.error('検索APIでのイシュー検索エラー:', error)
  }

  return null
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
