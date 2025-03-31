'use client'

import { Forest } from '@/app/components/molecules/Forest'
import type { Row } from '@/types/game-objects'

type Props = {
  rowData: Row
  rowIndex: number
}

export function Row({ rowData, rowIndex }: Props) {
  switch (rowData.type) {
    case 'forest':
      return <Forest rowData={rowData} rowIndex={rowIndex} />
    default:
      return null
  }
}
