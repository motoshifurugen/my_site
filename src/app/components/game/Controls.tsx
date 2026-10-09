'use client'

import useEventListeners from '@/app/components/game/hooks/useEventListeners'
import { queueMove } from '@/app/components/game/stores/player'
import './Controls.css'

export function Controls() {
  useEventListeners()

  return (
    <div id="controls">
      <div>
        <button aria-label="forward" onClick={() => queueMove('forward')}>
          ▲
        </button>
        <button aria-label="left" onClick={() => queueMove('left')}>
          ◀
        </button>
        <button aria-label="backward" onClick={() => queueMove('backward')}>
          ▼
        </button>
        <button aria-label="right" onClick={() => queueMove('right')}>
          ▶
        </button>
      </div>
    </div>
  )
}
