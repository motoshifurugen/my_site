import { endsUpInValidPosition } from '@/app/components/game/utilities/endsUpInValidPosition'
import type { MoveDirection } from '@/types/game-objects'
import useMapStore from '@/app/components/game/stores/map'

export const state = {
  currentRow: 0,
  currentTile: 0,
  movesQueue: [] as MoveDirection[],
}

export function queueMove(direction: MoveDirection) {
  if (
    !endsUpInValidPosition(
      { rowIndex: state.currentRow, tileIndex: state.currentTile },
      [...state.movesQueue, direction],
    )
  )
    return
  state.movesQueue.push(direction)
}

export function stepCompleted() {
  const direction = state.movesQueue.shift()
  if (!direction) return

  if (direction === 'forward') state.currentRow += 1
  if (direction === 'backward') state.currentRow -= 1
  if (direction === 'left') state.currentTile -= 1
  if (direction === 'right') state.currentTile += 1

  if (state.currentRow === useMapStore.getState().rows.length - 10) {
    useMapStore.getState().addRows()
  }
}
