'use client'

import { tileSize, tilesPerRow } from '@/app/components/game/const'

type Props = {
  rowIndex: number
  children?: React.ReactNode
}

export function Grass({ rowIndex, children }: Props) {
  return (
    <group position={[0, rowIndex * tileSize, 0]}>
      <mesh>
        <boxGeometry args={[tilesPerRow * tileSize, tileSize, 3]} />
        <meshLambertMaterial color={0xbaf455} flatShading />
      </mesh>
      {children}
    </group>
  )
}
