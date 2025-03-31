'use client'

import { Grass } from '@/app/components/atoms/Grass'
import { Tree } from '@/app/components/atoms/Tree'
import type { Row } from '@/types/game-objects'

type Props = {
  rowIndex: number
  rowData: Extract<Row, { type: 'forest' }>
}

export function Forest({ rowIndex, rowData }: Props) {
  return (
    <Grass rowIndex={rowIndex}>
      {rowData.trees.map((tree, index) => (
        <Tree key={index} tileIndex={tree.tileIndex} height={tree.height} />
      ))}
    </Grass>
  )
}
