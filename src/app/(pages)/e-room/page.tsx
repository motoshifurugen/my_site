'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import {
  Beer,
  BookOpen,
  CloudRain,
  MessageCircle,
  Plane,
  Apple,
  Sparkles,
  Heart,
  Star,
} from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import { E_ROOM_PHOTOS } from './photos'
import { FaXTwitter, FaInstagram } from 'react-icons/fa6'

// --- Types ---
type SkillType = 'Overall' | 'Listening' | 'Reading' | 'Writing' | 'Speaking'
type DuolingoSkillType = 'Overall' | 'Listening' | 'Reading' | 'Writing' | 'Speaking'

// --- Data ---
const IELTS_TESTS = [
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
  // {
  //   date: '12/05',
  //   Overall: 6.0,
  //   Listening: 5.0,
  //   Reading: 6.0,
  //   Writing: 7.0,
  //   Speaking: 6.0,
  // },
]

const SKILL_COLORS: Record<SkillType, string> = {
  Overall: '#008080', // Teal
  Listening: '#4A90E2', // Blue
  Reading: '#50C878', // Green
  Writing: '#FF8C00', // Orange
  Speaking: '#9B59B6', // Purple
}

const DUOLINGO_TESTS = [
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
  // {
  //   date: '11/30',
  //   Overall: 91.25,
  //   Listening: 85,
  //   Reading: 110,
  //   Writing: 90,
  //   Speaking: 80,
  // },
]

const DUOLINGO_SKILL_COLORS: Record<DuolingoSkillType, string> = {
  Overall: '#008080', // Teal
  Listening: '#4A90E2', // Blue
  Reading: '#50C878', // Green
  Writing: '#FF8C00', // Orange
  Speaking: '#9B59B6', // Purple
}

// 画像を2つのグループに分ける
const PHOTOS_COUNT = E_ROOM_PHOTOS.length
const FIRST_SLIDESHOW_PHOTOS = E_ROOM_PHOTOS.slice(0, Math.floor(PHOTOS_COUNT / 2))
const SECOND_SLIDESHOW_PHOTOS = E_ROOM_PHOTOS.slice(Math.floor(PHOTOS_COUNT / 2))

const createPhotoRows = (photos: typeof E_ROOM_PHOTOS) =>
  Array.from({ length: 3 }, (_, rowIndex) =>
    photos.filter((_, idx) => idx % 3 === rowIndex)
  )

const FIRST_PHOTO_ROWS = createPhotoRows(FIRST_SLIDESHOW_PHOTOS)
const SECOND_PHOTO_ROWS = createPhotoRows(SECOND_SLIDESHOW_PHOTOS)

const STATS = [
  { icon: BookOpen, label: 'Classes Taken', value: '512 Hours' },
  { icon: Beer, label: 'Beers Consumed', value: '112 Bottles' },
  { icon: CloudRain, label: 'Typhoons Encountered', value: '3' },
  { icon: Apple, label: 'Watermelons Eaten', value: '34 Slices' },
  { icon: Sparkles, label: 'Favorite Phrase', value: '"once in a blue moon"' },
  { icon: MessageCircle, label: 'Hardest Word to Pronounce', value: '"walk / work"' },
]

// --- Components ---

const StatCard = ({ stat, index }: { stat: typeof STATS[0]; index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    if (!isFlipped) {
      setIsFlipped(true)
    }
  }

  return (
    <motion.div
      className="relative h-32 cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={handleClick}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front side */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white p-4 text-center shadow-sm dark:bg-night-gray dark:text-night-white"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <stat.icon className="mb-2 text-teal" size={28} />
          <div className="text-xs font-medium uppercase tracking-wider text-main-black/60 dark:text-night-white/80">
            {stat.label}
          </div>
        </motion.div>
        
        {/* Back side */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-teal p-4 text-center shadow-sm dark:bg-night-teal"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <stat.icon className="mb-2 text-white dark:text-night-white" size={28} />
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/90 dark:text-night-white/90">
            {stat.label}
          </div>
          <div className="text-lg font-bold text-white dark:text-night-white">
            {stat.value}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const IntroOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 113
    const intervalTime = duration / steps

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 113) {
          clearInterval(timer)
          return 113
        }
        return prev + 1
      })
    }, intervalTime)

    const completeTimer = setTimeout(() => {
      onComplete()
    }, 3500) // Wait a bit after counting finishes

    return () => {
      clearInterval(timer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-main-white text-main-black dark:bg-night-black dark:text-night-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="relative mb-8 w-64 text-main-black dark:text-night-white">
        <div className="flex justify-between text-xl font-bold tracking-widest">
          <span>JAPAN</span>
          <span>PH</span>
        </div>
        <div className="relative mt-2 h-1 w-full bg-gray dark:bg-night-gray">
          <motion.div
            className="absolute top-1/2 -mt-3 text-teal dark:text-night-teal"
            initial={{ left: '0%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            <Plane className="rotate-90" size={24} />
          </motion.div>
        </div>
      </div>
      <div className="font-mono text-6xl font-bold text-teal dark:text-night-teal">
        Day {count}
      </div>
      <motion.div
        className="mt-8 text-2xl font-medium opacity-0 text-main-black dark:text-night-white"
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        Thank You, the Philippines
      </motion.div>
    </motion.div>
  )
}

const Section = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`mb-16 px-6 ${className}`}
    >
      {children}
    </motion.section>
  )
}

const PhotoFilmRoll = ({ photoRows }: { photoRows: typeof FIRST_PHOTO_ROWS }) => {
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  const row3Ref = useRef<HTMLDivElement>(null)
  const row1X = useRef(0)
  const row2X = useRef(0)
  const row3X = useRef(0)

  useEffect(() => {
    // Initialize row2 position for reverse scroll
    const itemWidth = 208
    const setWidth = photoRows[1].length * itemWidth
    row2X.current = -setWidth
    if (row2Ref.current) {
      row2Ref.current.style.transform = `translateX(${row2X.current}px)`
    }

    const speed = 0.5 // pixels per frame
    let animationFrameId: number

    const animate = () => {
      if (row1Ref.current) {
        const itemWidth = 208 // 192px (w-48) + 16px (mx-2)
        const setWidth = photoRows[0].length * itemWidth
        row1X.current -= speed
        if (Math.abs(row1X.current) >= setWidth) {
          row1X.current += setWidth
        }
        row1Ref.current.style.transform = `translateX(${row1X.current}px)`
      }

      if (row2Ref.current) {
        const itemWidth = 208
        const setWidth = photoRows[1].length * itemWidth
        row2X.current += speed
        if (row2X.current >= 0) {
          row2X.current -= setWidth
        }
        row2Ref.current.style.transform = `translateX(${row2X.current}px)`
      }

      if (row3Ref.current) {
        const itemWidth = 208
        const setWidth = photoRows[2].length * itemWidth
        row3X.current -= speed
        if (Math.abs(row3X.current) >= setWidth) {
          row3X.current += setWidth
        }
        row3Ref.current.style.transform = `translateX(${row3X.current}px)`
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [photoRows])

  return (
    <div className="mb-16 w-full space-y-4 overflow-hidden py-4">
      {/* First Row - Scroll Left */}
      <div className="relative flex" ref={row1Ref}>
        {[...photoRows[0], ...photoRows[0]].map((photo, i) => (
          <div
            key={i}
            className="relative mx-2 h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg shadow-md"
          >
            <Image
              src={photo}
              alt={`Memory ${i + 1}`}
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>
        ))}
      </div>
      {/* Second Row - Scroll Right */}
      <div className="relative flex" ref={row2Ref}>
        {[...photoRows[1], ...photoRows[1]].map((photo, i) => (
          <div
            key={`reverse-${i}`}
            className="relative mx-2 h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg shadow-md"
          >
            <Image
              src={photo}
              alt={`Memory reverse ${i + 1}`}
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>
        ))}
      </div>
      {/* Third Row - Scroll Left */}
      <div className="relative flex" ref={row3Ref}>
        {[...photoRows[2], ...photoRows[2]].map((photo, i) => (
          <div
            key={`third-${i}`}
            className="relative mx-2 h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg shadow-md"
          >
            <Image
              src={photo}
              alt={`Memory third ${i + 1}`}
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const Chart = () => {
  const skills: SkillType[] = [
    'Overall',
    'Listening',
    'Reading',
    'Writing',
    'Speaking',
  ]
  const minScore = 3.0
  const maxScore = 9.0
  const width = 320
  const height = 200
  const paddingLeft = 35
  const paddingRight = 20
  const paddingTop = 20
  const paddingBottom = 30

  // Calculate points for each skill
  const getPathForSkill = (skill: SkillType) => {
    return IELTS_TESTS.map((test, index) => {
      const x =
        (index / (IELTS_TESTS.length - 1)) *
        (width - paddingLeft - paddingRight) +
        paddingLeft
      const y =
        height -
        ((test[skill] - minScore) / (maxScore - minScore)) *
        (height - paddingTop - paddingBottom) -
        paddingBottom
      return `${x},${y}`
    }).join(' ')
  }

  // Y-axis grid lines (0.5 increments)
  const yAxisGridLines = [3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0]
  // Y-axis labels (1.0 increments)
  const yAxisLabels = [3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0]

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm dark:bg-night-gray dark:text-night-white">
      <h3 className="mb-4 text-center text-xl font-bold text-main-black dark:text-night-white">
        IELTS Score Progress
      </h3>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap justify-center gap-3 text-main-black dark:text-night-white">
        {skills.map((skill) => {
          const isOverall = skill === 'Overall'
          return (
            <div key={skill} className="flex items-center gap-1">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: SKILL_COLORS[skill],
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
          width={width}
          height={height}
          className="overflow-visible text-main-black dark:text-night-white"
        >
          {/* Y-axis grid lines (0.5 increments) */}
          {yAxisGridLines.map((score) => {
            // Skip 6.5 as it will be shown as a target line
            if (score === 6.5) return null
            const y =
              height -
              ((score - minScore) / (maxScore - minScore)) *
              (height - paddingTop - paddingBottom) -
              paddingBottom
            return (
              <line
                key={`grid-${score}`}
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#E5E7E6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            )
          })}

          {/* Y-axis labels (1.0 increments) */}
          {yAxisLabels.map((score) => {
            const y =
              height -
              ((score - minScore) / (maxScore - minScore)) *
              (height - paddingTop - paddingBottom) -
              paddingBottom
            return (
              <text
                key={`label-${score}`}
                x={paddingLeft - 8}
                y={y + 4}
                fontSize="10"
                fill="currentColor"
                textAnchor="end"
              >
                {score.toFixed(1)}
              </text>
            )
          })}

          {/* Target line at 6.5 */}
          {(() => {
            const targetScore = 6.5
            const y =
              height -
              ((targetScore - minScore) / (maxScore - minScore)) *
              (height - paddingTop - paddingBottom) -
              paddingBottom
            return (
              <g>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#FF6B6B"
                  strokeWidth="1.5"
                  strokeDasharray="0"
                  opacity={0.4}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fontSize="10"
                  fill="#FF6B6B"
                  fontWeight="normal"
                  textAnchor="end"
                  opacity={0.6}
                >
                  goal
                </text>
              </g>
            )
          })()}

          {/* Data Lines */}
          {skills.map((skill) => (
            <motion.path
              key={skill}
              d={`M ${getPathForSkill(skill)}`}
              fill="none"
              stroke={SKILL_COLORS[skill]}
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
          {skills.map((skill) => {
            return IELTS_TESTS.map((test, index) => {
              const x =
                (index / (IELTS_TESTS.length - 1)) *
                (width - paddingLeft - paddingRight) +
                paddingLeft
              const y =
                height -
                ((test[skill] - minScore) / (maxScore - minScore)) *
                (height - paddingTop - paddingBottom) -
                paddingBottom
              const isOverall = skill === 'Overall'
              return (
                <motion.circle
                  key={`${skill}-${index}`}
                  cx={x}
                  cy={y}
                  r={isOverall ? '3' : '2'}
                  fill="#fff"
                  stroke={SKILL_COLORS[skill]}
                  strokeWidth={isOverall ? '2' : '1.5'}
                  opacity={isOverall ? 1 : 0.4}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * index + 1.5, duration: 0.3 }}
                />
              )
            })
          })}

          {/* X-axis labels (dates) */}
          {IELTS_TESTS.map((test, index) => {
            const x =
              (index / (IELTS_TESTS.length - 1)) *
              (width - paddingLeft - paddingRight) +
              paddingLeft
            return (
              <text
                key={test.date}
                x={x}
                y={height - paddingBottom + 20}
                fontSize="9"
                fill="currentColor"
                textAnchor="middle"
              >
                {test.date}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

const DuolingoChart = () => {
  const skills: DuolingoSkillType[] = [
    'Overall',
    'Listening',
    'Reading',
    'Writing',
    'Speaking',
  ]
  const minScore = 40
  const maxScore = 140
  const width = 320
  const height = 200
  const paddingLeft = 35
  const paddingRight = 20
  const paddingTop = 20
  const paddingBottom = 30

  // Calculate points for each skill
  const getPathForSkill = (skill: DuolingoSkillType) => {
    return DUOLINGO_TESTS.map((test, index) => {
      const x =
        (index / (DUOLINGO_TESTS.length - 1)) *
        (width - paddingLeft - paddingRight) +
        paddingLeft
      const y =
        height -
        ((test[skill] - minScore) / (maxScore - minScore)) *
        (height - paddingTop - paddingBottom) -
        paddingBottom
      return `${x},${y}`
    }).join(' ')
  }

  // Y-axis grid lines (10 increments)
  const yAxisGridLines = [40, 50, 60, 70, 80, 90, 100, 110, 115, 120, 130, 140]
  // Y-axis labels (20 increments)
  const yAxisLabels = [40, 60, 80, 100, 120, 140]

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm dark:bg-night-gray dark:text-night-white">
      <h3 className="mb-4 text-center text-xl font-bold text-main-black dark:text-night-white">
        Duolingo English Test Score Progress
      </h3>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap justify-center gap-3 text-main-black dark:text-night-white">
        {skills.map((skill) => {
          const isOverall = skill === 'Overall'
          return (
            <div key={skill} className="flex items-center gap-1">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: DUOLINGO_SKILL_COLORS[skill],
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
          width={width}
          height={height}
          className="overflow-visible text-main-black dark:text-night-white"
        >
          {/* Y-axis grid lines (10 increments) */}
          {yAxisGridLines.map((score) => {
            // Skip 115 as it will be shown as a target line
            if (score === 115) return null
            const y =
              height -
              ((score - minScore) / (maxScore - minScore)) *
              (height - paddingTop - paddingBottom) -
              paddingBottom
            return (
              <line
                key={`grid-${score}`}
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#E5E7E6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            )
          })}

          {/* Y-axis labels (20 increments) */}
          {yAxisLabels.map((score) => {
            const y =
              height -
              ((score - minScore) / (maxScore - minScore)) *
              (height - paddingTop - paddingBottom) -
              paddingBottom
            return (
              <text
                key={`label-${score}`}
                x={paddingLeft - 8}
                y={y + 4}
                fontSize="10"
                fill="currentColor"
                textAnchor="end"
              >
                {score}
              </text>
            )
          })}

          {/* Target line at 115 */}
          {(() => {
            const targetScore = 115
            const y =
              height -
              ((targetScore - minScore) / (maxScore - minScore)) *
              (height - paddingTop - paddingBottom) -
              paddingBottom
            return (
              <g>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#FF6B6B"
                  strokeWidth="1.5"
                  strokeDasharray="0"
                  opacity={0.4}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fontSize="10"
                  fill="#FF6B6B"
                  fontWeight="normal"
                  textAnchor="end"
                  opacity={0.6}
                >
                  goal
                </text>
              </g>
            )
          })()}

          {/* Data Lines */}
          {skills.map((skill) => (
            <motion.path
              key={skill}
              d={`M ${getPathForSkill(skill)}`}
              fill="none"
              stroke={DUOLINGO_SKILL_COLORS[skill]}
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
          {skills.map((skill) => {
            return DUOLINGO_TESTS.map((test, index) => {
              const x =
                (index / (DUOLINGO_TESTS.length - 1)) *
                (width - paddingLeft - paddingRight) +
                paddingLeft
              const y =
                height -
                ((test[skill] - minScore) / (maxScore - minScore)) *
                (height - paddingTop - paddingBottom) -
                paddingBottom
              const isOverall = skill === 'Overall'
              return (
                <motion.circle
                  key={`${skill}-${index}`}
                  cx={x}
                  cy={y}
                  r={isOverall ? '3' : '2'}
                  fill="#fff"
                  stroke={DUOLINGO_SKILL_COLORS[skill]}
                  strokeWidth={isOverall ? '2' : '1.5'}
                  opacity={isOverall ? 1 : 0.4}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * index + 1.5, duration: 0.3 }}
                />
              )
            })
          })}

          {/* X-axis labels (dates) */}
          {DUOLINGO_TESTS.map((test, index) => {
            const x =
              (index / (DUOLINGO_TESTS.length - 1)) *
              (width - paddingLeft - paddingRight) +
              paddingLeft
            return (
              <text
                key={test.date}
                x={x}
                y={height - paddingBottom + 20}
                fontSize="9"
                fill="currentColor"
                textAnchor="middle"
              >
                {test.date}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <div className="min-h-screen bg-main-white font-sans text-main-black dark:bg-night-black dark:text-night-white">
      <AnimatePresence>
        {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <main className="mx-auto max-w-md overflow-hidden pb-20 pt-12">
          {/* Header */}
          <Section className="text-center !mb-4">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-teal">
              <div>
                {'Memories'.split('').map((char, index) => (
                  <motion.span
                    key={`line1-${index}`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 12,
                      delay: index * 0.1,
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
              <div>
                {'in the Philippines'.split('').map((char, index) => (
                  <motion.span
                    key={`line2-${index}`}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 12,
                      delay: ('Memories'.length + 1 + index) * 0.1,
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>
            </h1>
            <p className="text-lg text-main-black/80 dark:text-night-white/80">
              A record of my 113-day treasure.
            </p>
          </Section>

          {/* Message Card */}
          <Section className="!px-0">
            <div className="relative px-6 py-8 md:px-8">
              <div className="relative">
                <h2 className="mb-6 text-xl font-bold text-teal dark:text-night-teal">
                  Dear Teachers & Friends
                </h2>
                
                <div className="space-y-4 leading-relaxed text-main-black dark:text-night-white">
                  <p>
                    Time has flown by so quickly, and my four months of studying abroad in the Philippines are already coming to an end. Thank you so much for everything.
                  </p>
                  <p>
                    Since it was my first time going abroad, I had many worries:<br></br> 
                    ・whether I could adapt to the climate and culture.<br></br>
                    ・whether I could build good relationships with teachers and friends.<br></br>
                    ・whether I could actually learn English, a subject I had always struggled with.<br></br>
                    Also There were moments when I felt like throwing in the towel because learning a language can be so challenging.
                    <strong>
                      But everyone at E-ROOM was incredibly warm and supportive,
                    </strong>
                    even when I put my foot in my mouth. Thanks to that, I realized that this experience was fun and meaningful.
                  </p>
                  <p>
                    Now, I don't feel nervous about English anymore.<br />
                    <strong>
                      Not only do I enjoy learning it, but I also feel in seventh heaven because of the people I've met and the experiences I've gained.
                    </strong>
                  </p>
                  <p>
                    I'll keep hitting the books and continue working toward my goals.
                    Wishing you all good health and continued success.
                  </p>
                </div>
                
                {/* Signature */}
                <div className="mt-8 flex items-center justify-end gap-2">
                  <div className="h-px w-24 bg-gradient-to-l from-teal/40 to-transparent dark:from-night-teal/40"></div>
                  <div className="text-sm font-medium italic text-teal/80 dark:text-night-teal/80">
                    Toshi
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Photo Film Roll */}
          <PhotoFilmRoll photoRows={FIRST_PHOTO_ROWS} />

          {/* Growth Journey */}
          <Section className="mb-4">
            <Chart />
          </Section>

          {/* Duolingo English Test Progress */}
          <Section>
            <DuolingoChart />
          </Section>

          {/* Second Photo Film Roll */}
          <PhotoFilmRoll photoRows={SECOND_PHOTO_ROWS} />

          {/* Fun Stats */}
          <Section>
            <p className="mb-4 text-center text-xs text-main-black/40 dark:text-night-white/40">
              Tap the cards
            </p>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <StatCard key={i} stat={stat} index={i} />
              ))}
            </div>
          </Section>

          {/* Footer */}
          <footer className="mt-36 text-center text-main-black dark:text-night-white">
            <div className="mb-8 flex justify-center">
              <div className="relative w-48">
                <div className="flex justify-between text-sm font-bold tracking-widest text-main-black/60 dark:text-night-white/80">
                  <span>PH</span>
                  <span>JAPAN</span>
                </div>
                <div className="relative mt-2 h-0.5 w-full bg-gray dark:bg-night-gray">
                  <motion.div
                    className="absolute top-1/2 -mt-3 text-teal dark:text-night-teal"
                    initial={{ left: '0%' }}
                    whileInView={{ left: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  >
                    <Plane className="rotate-90" size={20} />
                  </motion.div>
                </div>
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-teal">
              See you again.
            </h2>
            <p className="mb-8 text-sm text-main-black/60 dark:text-night-white/80">
              Future commitments.
            </p>
            <div className="flex justify-center space-x-6 text-teal dark:text-night-teal">
              <a href="https://www.instagram.com/motoshi_cocoa" rel="noopener noreferrer" target="_blank" className="transition-transform hover:scale-110">
                <FaInstagram size={24} />
              </a>
              <a href="https://x.com/cocoahearts21" rel="noopener noreferrer" target="_blank" className="transition-transform hover:scale-110">
                <FaXTwitter size={24} />
              </a>
            </div>
          </footer>
        </main>
      )}
    </div>
  )
}
