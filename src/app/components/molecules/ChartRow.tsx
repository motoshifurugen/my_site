import React from 'react';

interface Period {
  start: number;
  end: number;
}

interface Skill {
  name: string;
  periods: Period[];
  total: number;
}

interface ChartRowProps {
  skill: Skill;
  totalYears: number;
}

const ChartRow: React.FC<ChartRowProps> = ({ skill, totalYears }) => {
  return (
    <div className="mb-6 relative">
      <div className="bg-white p-3 rounded-lg relative">
        <div className="dm-sans font-bold text-base">{skill.name}</div>
        <div className="dm-sans flex">
          {skill.total.toFixed(1)} 年
          {skill.periods.map((period, i) => {
            const startOffset = ((period.start - 2019) / totalYears) * 100;
            const width = ((period.end - period.start + 0.1) / totalYears) * 100;
            return (
              <div
                key={i}
                className="absolute bg-teal bg-opacity-80 h-3 rounded"
                style={{
                  left: `${startOffset}%`,
                  width: `${width}%`
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartRow;
