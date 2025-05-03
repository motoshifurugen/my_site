import useStore from '@/app/components/game/stores/game'
import './Result.css'
import { useEffect } from 'react'

export function Result() {
  const status = useStore((state) => state.status)
  const score = useStore((state) => state.score)
  const reset = useStore((state) => state.reset)

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

  if (status === 'running') return null

  return (
    <div id="result-container">
      <div id="result">
        <h1>Game Over</h1>
        <p>Your score: {score}</p>
        <button onClick={reset}>Retry</button>
        <p className="retry-hint-pc">Press Space to retry</p>
      </div>
    </div>
  )
}
