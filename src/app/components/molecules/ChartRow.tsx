import React from 'react'
import { useI18n } from '../../../i18n/context'

interface Period {
  start: number
  end: number
}

interface Skill {
  name: string
  periods: Period[]
  total: number
}

interface ChartRowProps {
  skill: Skill
  totalYears: number
}

const ChartRow: React.FC<ChartRowProps> = ({ skill, totalYears }) => {
  const { t } = useI18n()
  
  return (
    <div className="relative mb-6">
      <div className="relative rounded-lg bg-white p-3">
        <div className="dm-sans text-base font-bold">{skill.name}</div>
        <div className="dm-sans flex">
          {skill.total.toFixed(1)}{t.skills.timeline.year}
          {skill.periods.map((period, i) => {
            const startOffset = ((period.start - 2019) / totalYears) * 100
            const width = ((period.end - period.start + 0.1) / totalYears) * 100
            return (
              <div
                key={i}
                className="absolute h-3 rounded bg-teal bg-opacity-80"
                style={{
                  left: `${startOffset}%`,
                  width: `${width}%`,
                }}
              ></div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ChartRow
