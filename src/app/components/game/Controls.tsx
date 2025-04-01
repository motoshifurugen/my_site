'use client'

import useEventListeners from '@/app/components/game/hooks/useEventListeners'
import { queueMove } from '@/app/components/game/stores/player'
import './Controls.css'

export function Controls() {
  useEventListeners()

  return (
    <div id="controls">
      <div>
        <button onClick={() => queueMove('forward')}>▲</button>
        <button onClick={() => queueMove('left')}>◀</button>
        <button onClick={() => queueMove('backward')}>▼</button>
        <button onClick={() => queueMove('right')}>▶</button>
      </div>
    </div>
  )
}
