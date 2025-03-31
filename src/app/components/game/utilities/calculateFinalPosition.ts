import type { MoveDirection } from '@/types/game-objects'

export function calculateFinalPosition(
  currentPosition: { rowIndex: number; tileIndex: number },
  moves: MoveDirection[]
) {
  return moves.reduce((position, direction) => {
    if (direction === 'forward')
      return {
        rowIndex: position.rowIndex + 1,
        tileIndex: position.tileIndex,
      }
    if (direction === 'backward')
      return {
        rowIndex: position.rowIndex - 1,
        tileIndex: position.tileIndex,
      }
    if (direction === 'left')
      return {
        rowIndex: position.rowIndex,
        tileIndex: position.tileIndex - 1,
      }
    if (direction === 'right')
      return {
        rowIndex: position.rowIndex,
        tileIndex: position.tileIndex + 1,
      }
    return position
  }, currentPosition)
}
