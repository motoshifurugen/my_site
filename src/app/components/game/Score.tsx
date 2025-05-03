import useStore from '@/app/components/game/stores/game'
import './Score.css'

export function Score() {
  const score = useStore((state) => state.score)
  const isHigh = score > 100

  return (
    <div id="score" className={isHigh ? 'score--high' : ''}>
      SCORE: {score}
    </div>
  )
}
