'use client'

import { tileSize } from '@/app/components/game/const'
import useHitDetection from '@/app/components/game/hooks/useHitDetection'
import useVehicleAnimation from '@/app/components/game/hooks/useVehicleAnimation'
import { Wheel } from '@/app/components/game/Wheel'
import { useRef } from 'react'
import * as THREE from 'three'

type Props = {
  rowIndex: number
  initialTileIndex: number
  direction: boolean
  speed: number
  color: THREE.ColorRepresentation
}

export function Truck({
  rowIndex,
  initialTileIndex,
  direction,
  speed,
  color,
}: Props) {
  const truck = useRef<THREE.Group>(null)
  useVehicleAnimation(truck, direction, speed)
  useHitDetection(truck, rowIndex)

  return (
    <group
      ref={truck}
      position-x={initialTileIndex * tileSize}
      rotation-z={direction ? 0 : Math.PI}
    >
      <mesh position={[-15, 0, 25]} castShadow receiveShadow>
        <boxGeometry args={[70, 35, 35]} />
        <meshLambertMaterial color={0xb4c6fc} flatShading />
      </mesh>
      <mesh position={[35, 0, 20]} castShadow receiveShadow>
        <boxGeometry args={[30, 30, 30]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
      <Wheel x={-35} />
      <Wheel x={5} />
      <Wheel x={37} />
    </group>
  )
}
