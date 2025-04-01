'use client'

import { Road } from '@/app/components/game/Road'
import { Truck } from '@/app/components/game/Truck'
import type { Row } from '@/types/game-objects'

type Props = {
  rowIndex: number
  rowData: Extract<Row, { type: 'truck' }>
}

export function TruckLane({ rowIndex, rowData }: Props) {
  return (
    <Road rowIndex={rowIndex}>
      {rowData.vehicles.map((vehicle, index) => (
        <Truck
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
