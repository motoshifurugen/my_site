'use client'

import { Car } from '@/app/components/game/Car'
import { Road } from '@/app/components/game/Road'
import type { Row } from '@/types/game-objects'

type Props = {
  rowIndex: number
  rowData: Extract<Row, { type: 'car' }>
}

export function CarLane({ rowIndex, rowData }: Props) {
  return (
    <Road rowIndex={rowIndex}>
      {rowData.vehicles.map((vehicle, index) => (
        <Car
          key={index}
          rowIndex={rowIndex}
          initialTileIndex={vehicle.initialTileIndex}
          direction={rowData.direction}
          speed={rowData.speed}
          color={vehicle.color}
        />
      ))}
    </Road>
  )
}
