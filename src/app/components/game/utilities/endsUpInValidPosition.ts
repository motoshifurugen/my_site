import { maxTileIndex, minTileIndex } from '@/app/components/game/const'
import { rows } from '@/app/components/game/metadata'
import type { MoveDirection } from '@/types/game-objects'

type Position = {
  rowIndex: number
  tileIndex: number
}

export function endsUpInValidPosition(
  currentPosition: Position,
  moves: MoveDirection[],
): boolean {
  let finalPosition = { ...currentPosition }

  for (const move of moves) {
    if (move === 'forward') finalPosition.rowIndex += 1
    if (move === 'backward') finalPosition.rowIndex -= 1
    if (move === 'left') finalPosition.tileIndex -= 1
    if (move === 'right') finalPosition.tileIndex += 1
  }

  if (
    finalPosition.rowIndex < 0 ||
    finalPosition.rowIndex >= rows.length ||
    finalPosition.tileIndex < minTileIndex ||
    finalPosition.tileIndex > maxTileIndex
  ) {
    return false
  }

  const row = rows[finalPosition.rowIndex]
  if (row.type === 'forest') {
    return !row.trees.some((tree) => tree.tileIndex === finalPosition.tileIndex)
  }

  return true
}
