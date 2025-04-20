import { maxTileIndex, minTileIndex } from '@/app/components/game/const'
import useMapStore from '@/app/components/game/stores/map'
import { calculateFinalPosition } from '@/app/components/game/utilities/calculateFinalPosition'
import type { MoveDirection } from '@/types/game-objects'

type Position = {
  rowIndex: number
  tileIndex: number
}

export function endsUpInValidPosition(
  currentPosition: Position,
  moves: MoveDirection[],
): boolean {
  const finalPosition = calculateFinalPosition(currentPosition, moves)

  // マップの端に当たった場合
  if (
    finalPosition.rowIndex === -1 ||
    finalPosition.tileIndex === minTileIndex - 1 ||
    finalPosition.tileIndex === maxTileIndex + 1
  ) {
    return false
  }

  // 木に当たった場合
  const finalRow = useMapStore.getState().rows[finalPosition.rowIndex - 1]
  if (
    finalRow &&
    finalRow.type === 'forest' &&
    finalRow.trees.some((tree) => tree.tileIndex === finalPosition.tileIndex)
  ) {
    return false
  }

  return true
}
