import { tileSize } from '@/app/components/game/const'
import { calculateFinalPosition } from '@/app/components/game/utilities/calculateFinalPosition'
import type { MoveDirection } from '@/types/game-objects'
import * as THREE from 'three'

const jumpHeight = 8

export function calculatePlayerPosition(
  currentPosition: { rowIndex: number; tileIndex: number },
  direction: MoveDirection,
  progress: number,
): { x: number; y: number; z: number } {
  const end = calculateFinalPosition(currentPosition, [direction])

  return {
    x: THREE.MathUtils.lerp(
      currentPosition.tileIndex * tileSize,
      end.tileIndex * tileSize,
      progress,
    ),
    y: THREE.MathUtils.lerp(
      currentPosition.rowIndex * tileSize,
      end.rowIndex * tileSize,
      progress,
    ),
    z: Math.sin(progress * Math.PI) * jumpHeight,
  }
}
