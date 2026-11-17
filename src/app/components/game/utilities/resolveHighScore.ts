interface HighScoreResponse {
  highScore?: number
}

interface ResolvedHighScore {
  highScore: number
  isNewRecord: boolean
}

// 結果画面はハイスコアが取れなくても遊び続けられるため、失敗は例外ではなく null で返し、表示だけを省く
export const resolveHighScore = async (
  apiBase: string,
  score: number,
): Promise<ResolvedHighScore | null> => {
  const endpoint = `${apiBase}/highscore`
  try {
    const res = await fetch(endpoint)
    const data: HighScoreResponse = await res.json()
    const currentHighScore = data.highScore || 0
    if (score <= currentHighScore) {
      return { highScore: currentHighScore, isNewRecord: false }
    }
    const postRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score }),
    })
    const postData: HighScoreResponse = await postRes.json()
    return { highScore: postData.highScore || score, isNewRecord: true }
  } catch {
    return null
  }
}
