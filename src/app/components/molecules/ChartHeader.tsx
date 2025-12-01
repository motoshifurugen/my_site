import React from 'react'
import { useI18n } from '../../../i18n/context'

interface ChartHeaderProps {
  years: number[]
  totalYears: number
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ years, totalYears }) => {
  const { t } = useI18n()

  return (
    <div>
      <div className="flex items-center">
        <div className="h-3 w-10 rounded bg-teal bg-opacity-80"></div>
        <p className="ml-2">{t.skills.timeline.experiencePeriod}</p>
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
              {t.skills.timeline.year}
            </p>
          )
        })}
      </div>
    </div>
  )
}

export default ChartHeader
