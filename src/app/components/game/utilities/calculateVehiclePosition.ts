import {
  maxTileIndex,
  minTileIndex,
  tileSize,
} from '@/app/components/game/const'

const beginningOfRow = (minTileIndex - 2) * tileSize
const endOfRow = (maxTileIndex + 2) * tileSize

export function calculateVehiclePosition(
  x: number,
  direction: boolean,
  speed: number,
  delta: number,
): number {
  if (direction) {
    return x > endOfRow ? beginningOfRow : x + speed * delta
  }
  return x < beginningOfRow ? endOfRow : x - speed * delta
}
