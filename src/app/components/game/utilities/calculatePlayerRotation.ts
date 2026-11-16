import type { MoveDirection } from '@/types/game-objects'
import * as THREE from 'three'

const endRotations: Record<MoveDirection, number> = {
  forward: 0,
  left: Math.PI / 2,
  backward: Math.PI,
  right: -Math.PI / 2,
}

export function calculatePlayerRotation(
  currentRotation: number,
  direction: MoveDirection,
  progress: number,
): number {
  return THREE.MathUtils.lerp(
    currentRotation,
    endRotations[direction],
    progress,
  )
}
