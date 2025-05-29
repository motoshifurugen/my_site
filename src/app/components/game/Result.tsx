import useStore from '@/app/components/game/stores/game'
import { useEffect, useState } from 'react'
import './Result.css'

export function Result() {
  const status = useStore((state) => state.status)
  const score = useStore((state) => state.score)
  const reset = useStore((state) => state.reset)
  const [highScore, setHighScore] = useState<number | null>(null)
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [loading, setLoading] = useState(false)

  const apiBase = process.env.NEXT_PUBLIC_API_URL || '/my_site/api'

  useEffect(() => {
    if (status !== 'over') return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        reset()
      }
    }
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [status, reset])

  useEffect(() => {
    if (status !== 'over') return
    setLoading(true)
    const fetchHighScore = async () => {
      try {
        const res = await fetch(`${apiBase}/highscore`)
        const data = await res.json()
        let high = data.highScore || 0
        if (score > high) {
          setIsNewRecord(true)
          const postRes = await fetch(`${apiBase}/highscore`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score }),
          })
          const postData = await postRes.json()
          high = postData.highScore || score
        } else {
          setIsNewRecord(false)
        }
        setHighScore(high)
      } catch (e) {
        setHighScore(null)
      } finally {
        setLoading(false)
      }
    }
    fetchHighScore()
  }, [status, score, apiBase])

  if (status === 'running') return null

  return (
    <div id="result-container">
      <div id="result">
        <h1>Game Over</h1>
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '1.5em',
            color: '#222',
            marginBottom: 4,
          }}
        >
          Your score: {score}
        </p>
        <div
          style={{
            minHeight: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          {loading ? (
            <span
              className="inline-block mr-2"
              style={{ width: 20, height: 20 }}
            >
              <span
                className="score-spinner"
                style={{
                  display: 'inline-block',
                  width: 20,
                  height: 20,
                  border: '3px solid #eab308',
                  borderTop: '3px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  verticalAlign: 'middle',
                }}
              />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
            </span>
          ) : (
            highScore !== null && (
              <p
                style={{
                  fontWeight: 500,
                  color: isNewRecord ? '#eab308' : '#888',
                  fontSize: '1em',
                  margin: 0,
                }}
              >
                High Score: {highScore} {isNewRecord && <span>🎉 New!</span>}
              </p>
            )
          )}
        </div>
        <button onClick={reset}>Retry</button>
        <p className="retry-hint-pc">Press Space to retry</p>
      </div>
    </div>
  )
}
