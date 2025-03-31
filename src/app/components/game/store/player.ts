import type { MoveDirection } from '@/types/game-objects'
import { endsUpInValidPosition } from '@/app/components/game/utilities/endsUpInValidPosition'

export const state: {
  currentRow: number
  currentTile: number
  movesQueue: MoveDirection[]
} = {
  currentRow: 0,
  currentTile: 0,
  movesQueue: [],
}

export function queueMove(direction: MoveDirection) {
  const isValidMove = endsUpInValidPosition(
    { rowIndex: state.currentRow, tileIndex: state.currentTile },
    [...state.movesQueue, direction]
  )

  if (!isValidMove) return
  state.movesQueue.push(direction)
}

export function stepCompleted() {
  const direction = state.movesQueue.shift()

  if (direction === 'forward') state.currentRow += 1
  if (direction === 'backward') state.currentRow -= 1
  if (direction === 'left') state.currentTile -= 1
  if (direction === 'right') state.currentTile += 1
}
