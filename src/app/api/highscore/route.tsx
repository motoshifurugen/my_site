import { Octokit } from '@octokit/rest'
import { NextRequest, NextResponse } from 'next/server'
import { getClientIP } from '../utils/clientIp'
import { checkRateLimit } from '../utils/rateLimit'
import { isValidScore } from './scoreValidation'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const GITHUB_OWNER = process.env.GITHUB_OWNER || ''
const GITHUB_REPO = process.env.GITHUB_REPO || ''
const HIGHSCORE_ISSUE_TITLE = 'highscore-game'
const HIGHSCORE_LABEL = 'highscore'

export async function GET(request: NextRequest) {
  try {
    const highScoreData = await getHighScore()
    return NextResponse.json(highScoreData)
  } catch (error) {
    console.error('最高スコア取得エラー:', error)
    return NextResponse.json(
      { error: '最高スコアの取得に失敗しました' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'リクエストボディが不正です' },
      { status: 400 },
    )
  }

  const { score } = (body ?? {}) as { score?: unknown }

  // NaN/Infinity/負値/巨大値/小数/非数値をすべて拒否する（改ざん対策）
  if (!isValidScore(score)) {
    return NextResponse.json({ error: 'scoreが不正です' }, { status: 400 })
  }

  // (IP, endpoint) 単位のレート制限。上限到達時は書込みせず 429 を返す
  const allowed = await checkRateLimit(getClientIP(request), 'highscore')
  if (!allowed) {
    return NextResponse.json(
      { error: 'リクエストが多すぎます。しばらくしてから再試行してください' },
      { status: 429 },
    )
  }

  try {
    const current = await getHighScore()
    if (score > current.highScore) {
      await setHighScore(score, current.issueNumber)
      return NextResponse.json({ highScore: score, updated: true })
    } else {
      return NextResponse.json({ highScore: current.highScore, updated: false })
    }
  } catch (error) {
    console.error('最高スコア更新エラー:', error)
    return NextResponse.json(
      { error: '最高スコアの更新に失敗しました' },
      { status: 500 },
    )
  }
}

// 最高スコアを取得
async function getHighScore() {
  const issues = await octokit.issues.listForRepo({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    labels: HIGHSCORE_LABEL,
    state: 'open',
  })
  const highScoreIssue = issues.data.find(
    (issue) => issue.title === HIGHSCORE_ISSUE_TITLE,
  )
  if (highScoreIssue) {
    const highScore = parseHighScore(highScoreIssue.body || '0')
    return {
      highScore,
      issueNumber: highScoreIssue.number,
    }
  } else {
    // なければ新規作成
    const newIssue = await octokit.issues.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title: HIGHSCORE_ISSUE_TITLE,
      body: '0',
      labels: [HIGHSCORE_LABEL],
    })
    return {
      highScore: 0,
      issueNumber: newIssue.data.number,
    }
  }
}

// 最高スコアを更新
async function setHighScore(score: number, issueNumber: number) {
  await octokit.issues.update({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    issue_number: issueNumber,
    body: score.toString(),
  })
}

function parseHighScore(body: string): number {
  const n = parseInt(body.trim(), 10)
  return isNaN(n) ? 0 : n
}
