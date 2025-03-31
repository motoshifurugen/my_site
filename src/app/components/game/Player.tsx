'use client'

import usePlayerAnimation from '@/app/components/game/hooks/usePlayerAnimation'
import { Bounds } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

export function Player() {
  const player = useRef<THREE.Group>(null)
  usePlayerAnimation(player)

  return (
    <Bounds fit clip observe margin={10}>
      <group ref={player}>
        <mesh position={[0, 0, 10]} castShadow receiveShadow>
          <boxGeometry args={[15, 15, 20]} />
          <meshLambertMaterial color={0xffffff} flatShading />
        </mesh>
        <mesh position={[0, 0, 21]} castShadow receiveShadow>
          <boxGeometry args={[2, 4, 2]} />
          <meshLambertMaterial color={0xf0619a} flatShading />
        </mesh>
      </group>
    </Bounds>
  )
}
