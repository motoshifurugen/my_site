'use client'

import { CarLane } from '@/app/components/game/CarLane'
import { Forest } from '@/app/components/game/Forest'
import { TruckLane } from '@/app/components/game/TruckLane'
import type { Row } from '@/types/game-objects'

type Props = {
  rowIndex: number
  rowData: Row
}

export function Row({ rowIndex, rowData }: Props) {
  switch (rowData.type) {
    case 'forest':
      return <Forest rowData={rowData} rowIndex={rowIndex} />
    case 'car':
      return <CarLane rowData={rowData} rowIndex={rowIndex} />
    case 'truck':
      return <TruckLane rowData={rowData} rowIndex={rowIndex} />
    default:
      return null
  }
}
