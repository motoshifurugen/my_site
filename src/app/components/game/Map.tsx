'use client'

import { Grass } from '@/app/components/game/Grass'
import { Row } from '@/app/components/game/Row'
import { rows } from '@/app/components/game/metadata'

export function Map() {
  return (
    <>
      <Grass rowIndex={0} />
      <Grass rowIndex={-1} />
      <Grass rowIndex={-2} />
      <Grass rowIndex={-3} />
      <Grass rowIndex={-4} />

      {rows.map((rowData, index) => (
        <Row key={index} rowIndex={index + 1} rowData={rowData} />
      ))}
    </>
  )
}
