'use client'

import { Grass } from '@/app/components/atoms/Grass'
import { Row } from '@/app/components/molecules/Row'
import { rows } from '@/types/game-meta'

export function Map() {
  return (
    <>
      <Grass rowIndex={0} />
      {rows.map((rowData, index) => (
        <Row key={index} rowData={rowData} rowIndex={index + 1} />
      ))}
    </>
  )
}
