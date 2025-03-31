'use client'

import { tileSize } from '@/app/components/game/const'
import { Wheel } from '@/app/components/game/Wheel'
import * as THREE from 'three'

type Props = {
  rowIndex: number
  initialTileIndex: number
  direction: boolean
  speed: number
  color: THREE.ColorRepresentation
}

export function Car({
  rowIndex,
  initialTileIndex,
  direction,
  speed,
  color,
}: Props) {
  return (
    <group
      position-x={initialTileIndex * tileSize}
      position-z={direction ? 0 : Math.PI}
    >
      <mesh position={[0, 0, 12]}>
        <boxGeometry args={[60, 30, 15]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
      <mesh position={[-6, 0, 25.5]}>
        <boxGeometry args={[33, 24, 12]} />
        <meshLambertMaterial color={0xffffff} flatShading />
      </mesh>
      <Wheel x={-18} />
      <Wheel x={18} />
    </group>
  )
}
