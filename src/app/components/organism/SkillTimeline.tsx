import { sortedSkills } from '../../(pages)/skills/skills'
import ChartHeader from '../molecules/ChartHeader'
import ChartRow from '../molecules/ChartRow'

const SkillTimeline: React.FC = () => {
  const max = 2024.6
  const totalYears = max - 2019 + 1 // グラフの長さ（2024年8月現在は6.6）
  const years = Array.from(
    { length: Math.ceil(totalYears) },
    (_, i) => 2019 + i,
  )

  return (
    <div className="relative w-full border-l-4 border-gray p-4">
      <ChartHeader years={years} totalYears={totalYears} />
      {sortedSkills.map((skill, index) => (
        <ChartRow key={index} skill={skill} totalYears={totalYears} />
      ))}
    </div>
  )
}

export default SkillTimeline
