import { queueMove } from '@/app/components/game/stores/player'
import { getMoveDirectionFromKey } from '@/app/components/game/utilities/getMoveDirectionFromKey'
import { useEffect } from 'react'

export default function useEventListeners() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = getMoveDirectionFromKey(event.key)
      if (direction === null) return

      event.preventDefault()
      queueMove(direction)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}
