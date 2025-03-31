import type { MoveDirection } from '@/types/game-objects'
import { calculateFinalPosition } from '@/app/components/game/utilities/calculateFinalPosition'
import { minTileIndex, maxTileIndex } from '@/app/components/game/const'
import { rows } from '@/app/components/game/metadata';

export function endsUpInValidPosition(
  currentPosition: { rowIndex: number; tileIndex: number },
  moves: MoveDirection[],
) {
  // Calculate where the player would end up after the move
  const finalPosition = calculateFinalPosition(currentPosition, moves)

  // Detect if we hit the edge of the map
  if (
    finalPosition.rowIndex === -1 ||
    finalPosition.tileIndex === minTileIndex - 1 ||
    finalPosition.tileIndex === maxTileIndex + 1
  ) {
    // Invalid move, ignore move command
    return false
  }

  // Detect if we hit a tree
  const finalRow = rows[finalPosition.rowIndex - 1]
  if (
    finalRow &&
    finalRow.type === 'forest' &&
    finalRow.trees.some(
      (tree) => tree.tileIndex === finalPosition.tileIndex
    )
  ) {
    // Invalid move, ignore move command
    return false
  }

  return true
}