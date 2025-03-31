'use client'

import { tileSize, tilesPerRow } from '@/app/components/game/const'

type Props = {
  rowIndex: number
  children: React.ReactNode
}

export function Road({ rowIndex, children }: Props) {
  return (
    <group position={[0, rowIndex * tileSize, 0]}>
      <mesh>
        <planeGeometry args={[tilesPerRow * tileSize, tileSize]} />
        <meshLambertMaterial color={0x454a59} flatShading />
      </mesh>
      {children}
    </group>
  )
}
