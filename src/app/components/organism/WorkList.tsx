import React from 'react'
import { sortedWorks } from '../../skills/works'
import WorkCard from '../molecules/WorkCard'

const WorkList: React.FC = () => {
  return (
    <div className="work-list grid grid-cols-1 items-center justify-items-center gap-8 md:grid-cols-3">
      {sortedWorks.map((work, index) => (
        <WorkCard
          key={index}
          src={work.src}
          alt={work.alt}
          title={work.title}
          description={work.description}
          tags={work.tags}
          date={work.date}
        />
      ))}
    </div>
  )
}

export default WorkList
