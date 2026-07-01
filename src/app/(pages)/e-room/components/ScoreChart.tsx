'use client'

import { motion } from 'framer-motion'

import type { ScoreChartConfig, SkillType } from '../types'

const SKILLS: SkillType[] = [
  'Overall',
  'Listening',
  'Reading',
  'Writing',
  'Speaking',
]

const WIDTH = 320
const HEIGHT = 200
const PADDING_LEFT = 35
const PADDING_RIGHT = 20
const PADDING_TOP = 20
const PADDING_BOTTOM = 30

// 設定駆動の折れ線スコアチャート。IELTS / Duolingo を同一実装で描き分ける。
// 旧 page.tsx の Chart / DuolingoChart（ほぼ同一の SVG）を config で統合したもの。
const ScoreChart = ({ config }: { config: ScoreChartConfig }) => {
  const { title, tests, colors, minScore, maxScore, gridLines, labels } = config

  const xForIndex = (index: number) =>
    (index / (tests.length - 1)) * (WIDTH - PADDING_LEFT - PADDING_RIGHT) +
    PADDING_LEFT

  const yForScore = (score: number) =>
    HEIGHT -
    ((score - minScore) / (maxScore - minScore)) *
      (HEIGHT - PADDING_TOP - PADDING_BOTTOM) -
    PADDING_BOTTOM

  const getPathForSkill = (skill: SkillType) =>
    tests
      .map((test, index) => `${xForIndex(index)},${yForScore(test[skill])}`)
      .join(' ')

  const targetY = yForScore(config.targetScore)

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm dark:bg-night-gray dark:text-night-white">
      <h3 className="mb-4 text-center text-xl font-bold text-main-black dark:text-night-white">
        {title}
      </h3>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap justify-center gap-3 text-main-black dark:text-night-white">
        {SKILLS.map((skill) => {
          const isOverall = skill === 'Overall'
          return (
            <div key={skill} className="flex items-center gap-1">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: colors[skill],
                  opacity: isOverall ? 1 : 0.4,
                }}
              />
              <span className="text-xs text-main-black/80 dark:text-night-white/80">
                {skill}
              </span>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <div className="relative flex justify-center">
        <svg
          width={WIDTH}
          height={HEIGHT}
          className="overflow-visible text-main-black dark:text-night-white"
        >
          {/* Y-axis grid lines */}
          {gridLines.map((score) => {
            // Skip the target score line; it is drawn separately below.
            if (score === config.targetScore) return null
            const y = yForScore(score)
            return (
              <line
                key={`grid-${score}`}
                x1={PADDING_LEFT}
                y1={y}
                x2={WIDTH - PADDING_RIGHT}
                y2={y}
                stroke="#E5E7E6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            )
          })}

          {/* Y-axis labels */}
          {labels.map((score) => {
            const y = yForScore(score)
            return (
              <text
                key={`label-${score}`}
                x={PADDING_LEFT - 8}
                y={y + 4}
                fontSize="10"
                fill="currentColor"
                textAnchor="end"
              >
                {score.toFixed(config.labelDecimals)}
              </text>
            )
          })}

          {/* Target (goal) line */}
          <g>
            <line
              x1={PADDING_LEFT}
              y1={targetY}
              x2={WIDTH - PADDING_RIGHT}
              y2={targetY}
              stroke="#FF6B6B"
              strokeWidth="1.5"
              strokeDasharray="0"
              opacity={0.4}
            />
            <text
              x={PADDING_LEFT - 8}
              y={targetY + 4}
              fontSize="10"
              fill="#FF6B6B"
              fontWeight="normal"
              textAnchor="end"
              opacity={0.6}
            >
              goal
            </text>
          </g>

          {/* Data Lines */}
          {SKILLS.map((skill) => (
            <motion.path
              key={skill}
              d={`M ${getPathForSkill(skill)}`}
              fill="none"
              stroke={colors[skill]}
              strokeWidth={skill === 'Overall' ? '4' : '1.5'}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={skill === 'Overall' ? '0' : '8,4'}
              opacity={skill === 'Overall' ? 1 : 0.35}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.1 }}
            />
          ))}

          {/* Data Points */}
          {SKILLS.map((skill) =>
            tests.map((test, index) => {
              const isOverall = skill === 'Overall'
              return (
                <motion.circle
                  key={`${skill}-${index}`}
                  cx={xForIndex(index)}
                  cy={yForScore(test[skill])}
                  r={isOverall ? '3' : '2'}
                  fill="#fff"
                  stroke={colors[skill]}
                  strokeWidth={isOverall ? '2' : '1.5'}
                  opacity={isOverall ? 1 : 0.4}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * index + 1.5, duration: 0.3 }}
                />
              )
            }),
          )}

          {/* X-axis labels (dates) */}
          {tests.map((test, index) => (
            <text
              key={test.date}
              x={xForIndex(index)}
              y={HEIGHT - PADDING_BOTTOM + 20}
              fontSize="9"
              fill="currentColor"
              textAnchor="middle"
            >
              {test.date}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}

export default ScoreChart
