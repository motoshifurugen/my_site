// app/api/likes/githubLikes.ts
// ブログのいいね数（GitHub Issues に保存）へのデータアクセスを集約するモジュール。
// いいねは title `likes-{slug}` / label `blog-likes` の Issue として管理される。
import { Octokit } from '@octokit/rest'

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const GITHUB_OWNER = process.env.GITHUB_OWNER || ''
const GITHUB_REPO = process.env.GITHUB_REPO || ''

export const LIKES_ISSUE_LABEL = 'blog-likes'

export const likeIssueTitle = (articleId: string): string =>
  `likes-${articleId}`

// Issue の body からいいね数を解析する。数値でなければ 0。
export const parseLikeCount = (body: string): number => {
  const count = parseInt(body.trim(), 10)
  return isNaN(count) ? 0 : count
}

// 複数 slug のいいね数を 1 回の listForRepo で集計する（サーバ側 N+1 を作らない）。
// 欠損 slug は 0。読み取り専用で Issue は作成しない。
// per_page=100。記事数が 100 を超えたらページネーションが必要になる（現状は未対応）。
export const getLikeCountsForSlugs = async (
  slugs: string[],
): Promise<Record<string, number>> => {
  const openIssues = await octokit.issues.listForRepo({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    labels: LIKES_ISSUE_LABEL,
    state: 'open',
    per_page: 100,
  })

  const countByTitle = new Map<string, number>()
  for (const issue of openIssues.data) {
    countByTitle.set(issue.title, parseLikeCount(issue.body || '0'))
  }

  const result: Record<string, number> = {}
  for (const slug of slugs) {
    result[slug] = countByTitle.get(likeIssueTitle(slug)) ?? 0
  }
  return result
}
