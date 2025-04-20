'use client'

import { Grass } from '@/app/components/game/Grass'
import { Row } from '@/app/components/game/Row'
import useStore from '@/app/components/game/stores/map'

export function Map() {
  const rows = useStore((state) => state.rows)

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
