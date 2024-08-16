import React from 'react'

interface ChartHeaderProps {
  years: number[]
  totalYears: number
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ years, totalYears }) => {
  return (
    <div>
      <div className="flex items-center">
        <div className="h-3 w-10 rounded bg-teal bg-opacity-80"></div>
        <p className="ml-2">経験期間</p>
      </div>
      <div className="relative p-6">
        {years.map((year, index) => {
          const left = ((year - 2019) / totalYears) * 100
          return (
            <p
              key={index}
              className="absolute"
              style={{ left: `${left}%`, top: '0' }}
            >
              {year}
            </p>
          )
        })}
      </div>
    </div>
  )
}

export default ChartHeader
