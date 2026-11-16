import type { MoveDirection } from '@/types/game-objects'

export function getMoveDirectionFromKey(key: string): MoveDirection | null {
  switch (key) {
    case 'ArrowUp':
      return 'forward'
    case 'ArrowDown':
      return 'backward'
    case 'ArrowLeft':
      return 'left'
    case 'ArrowRight':
      return 'right'
    default:
      return null
  }
}
