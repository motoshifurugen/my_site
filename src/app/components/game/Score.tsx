import useStore from '@/app/components/game/stores/game'
import './Score.css'

export function Score() {
  const score = useStore((state) => state.score)

  return <div id="score">SCORE: {score}</div>
}
