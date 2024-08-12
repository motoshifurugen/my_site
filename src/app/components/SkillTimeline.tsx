interface Period {
  start: number;
  end: number;
}

interface Skill {
  name: string;
  periods: Period[];
  total: number;
}

// 月と目盛りの対応メモ
// 1月：
// 2月：+0.1
// 3月：+0.2
// 4月：+0.3
// 5月：+0.4
// 6月：+0.5
// 7月：+0.6
// 8月：+0.6
// 9月：+0.7
// 10月：+0.8
// 11月：+0.9
// 12月：+1.0
const max = 2024.6;
const skills: Skill[] = [
  {
    name: 'PHP（Laravel、CakePHP）',
    periods: [
      { start: 2020.4, end: max },
    ],
    total: max - 2020.4,
  },
  {
    name: 'React',
    periods: [
      { start: 2020.7, end: 2020.8 },
      { start: 2024.6, end: max }
    ],
    total: (max - 2024.6) + (2020.8 - 2020.7),
  },
  {
    name: 'Vue.js',
    periods: [
      { start: 2020.8, end: 2023.6 },
      { start: 2024.4, end: max }
    ],
    total: (max - 2024.4) + (2023.6 - 2020.8),
  },
  {
    name: 'Unity',
    periods: [
      { start: 2021.6, end: 2021.7 }
    ],
    total: 2021.7 - 2021.6,
  },
  {
    name: 'Python',
    periods: [
      { start: 2022.8, end: max }
    ],
    total: max - 2022.8,
  },
  {
    name: 'Flutter',
    periods: [
      { start: 2022.8, end: max }
    ],
    total: max - 2022.8,
  },
];

const SkillTimeline: React.FC = () => {
  const totalYears = max - 2019 + 1; // グラフの長さ（2024年8月現在は6.6）
  const sortedSkills = skills.sort((a, b) => b.total - a.total);
  const years = Array.from({ length: Math.ceil(totalYears) }, (_, i) => 2019 + i);

  return (
    <div className="w-full md:w-4/5 mx-auto p-2 md:p-10 border-l-4 border-gray relative my-5 md:my-10">
      <div className="flex items-center">
        <div className="bg-teal bg-opacity-80 h-3 rounded w-8"></div>
        <p className="ml-2 text-sm md:text-base">経験時期</p>
      </div>
      <div className="relative mb-5 md:mb-10 py-4">
        {years.map((year, index) => {
          const left = ((year - 2019) / totalYears) * 100;
          return (
            <span
              key={index}
              className="absolute text-xs md:text-md"
              style={{ left: `${left}%`}}
            >
              {year}
            </span>
          );
        })}
      </div>
      {sortedSkills.map((skill, index) => (
        <div key={index} className="mb-5 pl-1 md:pl-5 relative">
          <div className="bg-white p-3 md:p-4 rounded-lg relative">
            <h3 className="font-bold text-base">{skill.name}</h3>
            <div className="flex">
              {skill.total.toFixed(1)}年
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
      ))}
    </div>
  );
};

export default SkillTimeline;
