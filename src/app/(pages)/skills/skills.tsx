// インターフェースの定義
export interface Period {
  start: number
  end: number
}

export interface Skill {
  name: string
  periods: Period[]
  total: number
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
const max = 2025.6

const skills: Skill[] = [
  {
    name: 'PHP（Laravel、CakePHP）',
    periods: [{ start: 2020.4, end: 2024.6 }],
    total: 2024.6 - 2020.4,
  },
  {
    name: 'React',
    periods: [
      { start: 2020.7, end: 2020.8 },
      { start: 2024.6, end: max },
    ],
    total: max - 2024.6 + (2020.8 - 2020.7),
  },
  {
    name: 'Vue.js',
    periods: [
      { start: 2020.8, end: 2023.6 },
      { start: 2024.4, end: max },
    ],
    total: max - 2024.4 + (2023.6 - 2020.8),
  },
  {
    name: 'Unity',
    periods: [{ start: 2021.6, end: 2021.7 }],
    total: 2021.7 - 2021.6,
  },
  {
    name: 'Python',
    periods: [{ start: 2022.8, end: max }],
    total: max - 2022.8,
  },
  {
    name: 'Flutter',
    periods: [{ start: 2022.8, end: 2024.6 }],
    total: 2024.6 - 2022.8,
  },
  {
    name: 'React Native',
    periods: [{ start: 2025.5, end: max }],
    total: max - 2025.5,
  },
]

export const sortedSkills = skills.sort((a, b) => b.total - a.total)
