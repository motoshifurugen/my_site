import React from 'react';
import WorkCard from '../molecules/WorkCard';
import { sortedWorks } from '../../skills/works';

const WorkList: React.FC = () => {
  return (
    <div className="work-list grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center items-center">
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
  );
};

export default WorkList;
