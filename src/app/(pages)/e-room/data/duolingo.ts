import type { ScoreChartConfig } from '../types'
import { SKILL_COLORS } from './skillColors'

// Duolingo English Test スコアチャートの設定。
// 旧 page.tsx でコメントアウト済みの 11/30 データは描画対象外のため含めない。
export const DUOLINGO_CHART: ScoreChartConfig = {
  title: 'Duolingo English Test Score Progress',
  tests: [
    {
      date: '4/6',
      Overall: 71.25,
      Listening: 70,
      Reading: 85,
      Writing: 60,
      Speaking: 70,
    },
    {
      date: '11/1',
      Overall: 91.25,
      Listening: 85,
      Reading: 110,
      Writing: 90,
      Speaking: 80,
    },
  ],
  colors: SKILL_COLORS,
  minScore: 40,
  maxScore: 140,
  gridLines: [40, 50, 60, 70, 80, 90, 100, 110, 115, 120, 130, 140],
  labels: [40, 60, 80, 100, 120, 140],
  targetScore: 115,
  labelDecimals: 0,
}
