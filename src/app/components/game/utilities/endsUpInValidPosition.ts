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

  // マップの端に当たった場合
  if (
    finalPosition.rowIndex === -1 ||
    finalPosition.tileIndex === minTileIndex - 1 ||
    finalPosition.tileIndex === maxTileIndex + 1
  ) {
    return false
  }

  // 木に当たった場合
  const finalRow = rows[finalPosition.rowIndex - 1]
  if (
    finalRow &&
    finalRow.type === 'forest' &&
    finalRow.trees.some((tree) => tree.tileIndex === finalPosition.tileIndex)
  ) {
    return false
  }

  return true
}
