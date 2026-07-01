import type { ScoreChartConfig } from '../types'
import { SKILL_COLORS } from './skillColors'

// IELTS スコアチャートの設定（データ・軸・目標線）。
// 値の出所は旧 page.tsx の IELTS_TESTS / Chart 軸設定。描画結果は不変。
export const IELTS_CHART: ScoreChartConfig = {
  title: 'IELTS Score Progress',
  tests: [
    {
      date: '8/28',
      Overall: 4.38,
      Listening: 4.5,
      Reading: 4.0,
      Writing: 4.5,
      Speaking: 4.5,
    },
    {
      date: '9/12',
      Overall: 5.0,
      Listening: 4.5,
      Reading: 5.0,
      Writing: 5.0,
      Speaking: 5.5,
    },
    {
      date: '9/26',
      Overall: 5.63,
      Listening: 5.0,
      Reading: 5.5,
      Writing: 6.0,
      Speaking: 6.0,
    },
    {
      date: '10/10',
      Overall: 6.0,
      Listening: 5.0,
      Reading: 7.5,
      Writing: 6.0,
      Speaking: 5.5,
    },
    {
      date: '10/24',
      Overall: 5.75,
      Listening: 5.0,
      Reading: 6.0,
      Writing: 6.5,
      Speaking: 5.5,
    },
    {
      date: '11/7',
      Overall: 5.25,
      Listening: 4.0,
      Reading: 4.5,
      Writing: 6.5,
      Speaking: 6.0,
    },
    {
      date: '11/21',
      Overall: 6.0,
      Listening: 5.0,
      Reading: 6.0,
      Writing: 7.0,
      Speaking: 6.0,
    },
    {
      date: '12/05',
      Overall: 6.38,
      Listening: 7.0,
      Reading: 5.5,
      Writing: 6.5,
      Speaking: 6.5,
    },
  ],
  colors: SKILL_COLORS,
  minScore: 3.0,
  maxScore: 9.0,
  gridLines: [3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0],
  labels: [3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0],
  targetScore: 6.5,
  labelDecimals: 1,
}
