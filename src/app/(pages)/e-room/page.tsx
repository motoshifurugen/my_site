'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import {
  Beer,
  BookOpen,
  Heart,
  Instagram,
  MessageCircle,
  Plane,
  Twitter,
} from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import { E_ROOM_PHOTOS } from './photos'

// --- Types ---
type SkillType = 'Overall' | 'Listening' | 'Reading' | 'Writing' | 'Speaking'

// --- Data ---
const IELTS_TESTS = [
  {
    date: '9/12',
    Overall: 5.0,
    Listening: 5.0,
    Reading: 5.0,
    Writing: 5.0,
    Speaking: 5.0,
  },
  {
    date: '9/26',
    Overall: 6.0,
    Listening: 6.0,
    Reading: 6.0,
    Writing: 6.0,
    Speaking: 6.0,
  },
  {
    date: '10/10',
    Overall: 6.0,
    Listening: 6.0,
    Reading: 6.0,
    Writing: 6.0,
    Speaking: 6.0,
  },
  {
    date: '10/24',
    Overall: 6.0,
    Listening: 6.0,
    Reading: 6.0,
    Writing: 6.0,
    Speaking: 6.0,
  },
  {
    date: '11/7',
    Overall: 6.0,
    Listening: 6.0,
    Reading: 6.0,
    Writing: 6.0,
    Speaking: 6.0,
  },
  {
    date: '11/21',
    Overall: 6.0,
    Listening: 6.0,
    Reading: 6.0,
    Writing: 6.0,
    Speaking: 6.0,
  },
  {
    date: '11/28',
    Overall: 6.0,
    Listening: 6.0,
    Reading: 6.0,
    Writing: 6.0,
    Speaking: 6.0,
  },
]

const SKILL_COLORS: Record<SkillType, string> = {
  Overall: '#008080', // Teal
  Listening: '#4A90E2', // Blue
  Reading: '#50C878', // Green
  Writing: '#FF8C00', // Orange
  Speaking: '#9B59B6', // Purple
}

const PHOTO_ROWS = Array.from({ length: 3 }, (_, rowIndex) =>
  E_ROOM_PHOTOS.filter((_, idx) => idx % 3 === rowIndex)
)

const STATS = [
  { icon: BookOpen, label: 'Classes Taken', value: '320 Hours' },
  { icon: Beer, label: 'San Miguel', value: '85 Bottles' },
  { icon: Heart, label: 'Favorite Phrase', value: '"No worries!"' },
  { icon: MessageCircle, label: 'Hardest Word', value: '"Squirrel"' },
]

// --- Components ---

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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-main-white text-main-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="relative mb-8 w-64">
        <div className="flex justify-between text-xl font-bold tracking-widest">
          <span>JAPAN</span>
          <span>PH</span>
        </div>
        <div className="relative mt-2 h-1 w-full bg-gray">
          <motion.div
            className="absolute top-1/2 -mt-3 text-teal"
            initial={{ left: '0%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            <Plane className="rotate-90" size={24} />
          </motion.div>
        </div>
      </div>
      <div className="font-mono text-6xl font-bold text-teal">Day {count}</div>
      <motion.div
        className="mt-8 text-2xl font-medium opacity-0"
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

const Chart = () => {
  const skills: SkillType[] = [
    'Overall',
    'Listening',
    'Reading',
    'Writing',
    'Speaking',
  ]
  const minScore = 4.0
  const maxScore = 8.0
  const width = 320
  const height = 200
  const paddingLeft = 35
  const paddingRight = 20
  const paddingTop = 20
  const paddingBottom = 30

  // Calculate points for each skill with offset
  const getPathForSkill = (skill: SkillType, skillIndex: number) => {
    const offsetPerSkill = 2 // Small horizontal offset in pixels
    const offset = (skillIndex - 2) * offsetPerSkill // Center around middle skill

    return IELTS_TESTS.map((test, index) => {
      const x =
        (index / (IELTS_TESTS.length - 1)) *
          (width - paddingLeft - paddingRight) +
        paddingLeft +
        offset
      const y =
        height -
        ((test[skill] - minScore) / (maxScore - minScore)) *
          (height - paddingTop - paddingBottom) -
        paddingBottom
      return `${x},${y}`
    }).join(' ')
  }

  // Y-axis labels (0.5 increments)
  const yAxisLabels = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0]

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-center text-xl font-bold text-main-black">
        Growth Journey
      </h3>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {skills.map((skill) => (
          <div key={skill} className="flex items-center gap-1">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: SKILL_COLORS[skill] }}
            />
            <span className="text-xs text-main-black/80">{skill}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="relative flex justify-center">
        <svg width={width} height={height} className="overflow-visible">
          {/* Y-axis labels */}
          {yAxisLabels.map((score) => {
            const y =
              height -
              ((score - minScore) / (maxScore - minScore)) *
                (height - paddingTop - paddingBottom) -
              paddingBottom
            return (
              <g key={score}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#E5E7E6"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fontSize="10"
                  fill="#4A4A4A"
                  textAnchor="end"
                >
                  {score.toFixed(1)}
                </text>
              </g>
            )
          })}

          {/* Data Lines */}
          {skills.map((skill, skillIndex) => (
            <motion.path
              key={skill}
              d={`M ${getPathForSkill(skill, skillIndex)}`}
              fill="none"
              stroke={SKILL_COLORS[skill]}
              strokeWidth={skill === 'Overall' ? '4' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={skill === 'Overall' ? '0' : '5,5'}
              opacity={skill === 'Overall' ? 1 : 0.6}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.1 }}
            />
          ))}

          {/* Data Points */}
          {skills.map((skill, skillIndex) => {
            const offsetPerSkill = 2
            const offset = (skillIndex - 2) * offsetPerSkill

            return IELTS_TESTS.map((test, index) => {
              const x =
                (index / (IELTS_TESTS.length - 1)) *
                  (width - paddingLeft - paddingRight) +
                paddingLeft +
                offset
              const y =
                height -
                ((test[skill] - minScore) / (maxScore - minScore)) *
                  (height - paddingTop - paddingBottom) -
                paddingBottom
              return (
                <motion.circle
                  key={`${skill}-${index}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#fff"
                  stroke={SKILL_COLORS[skill]}
                  strokeWidth="2"
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
                fill="#4A4A4A"
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
    <div className="min-h-screen bg-main-white font-sans text-main-black">
      <AnimatePresence>
        {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <main className="mx-auto max-w-md overflow-hidden pb-20 pt-12">
          {/* Header */}
          <Section className="text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-teal">
              Memories in the Philippines
            </h1>
            <p className="text-lg text-main-black/80">
              A record of my 113-day treasure.
            </p>
          </Section>

          {/* Message Card */}
          <Section>
            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-main-white opacity-50"></div>
              <h2 className="mb-4 text-xl font-bold text-teal">
                Dear Teachers & Friends
              </h2>
              <p className="leading-relaxed text-main-black">
                Thank you for your endless patience with my English. I'll never
                forget the laughter when I said "Rural" wrong, or our weekend
                trips to the beach. You made this place feel like home.
              </p>
              <div className="mt-6 flex justify-end">
                <Heart className="text-teal" fill="#008080" size={24} />
              </div>
            </div>
          </Section>

          {/* Photo Film Roll */}
          <div className="mb-16 w-full space-y-4 overflow-hidden py-4">
            {/* First Row - Scroll Left */}
            <div className="relative flex w-[200%] animate-scroll">
              {[...PHOTO_ROWS[0], ...PHOTO_ROWS[0]].map((photo, i) => (
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
            <div className="relative flex w-[200%] animate-scroll-reverse">
              {[...PHOTO_ROWS[1], ...PHOTO_ROWS[1]].map((photo, i) => (
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
            <div className="relative flex w-[200%] animate-scroll">
              {[...PHOTO_ROWS[2], ...PHOTO_ROWS[2]].map((photo, i) => (
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
            <style jsx>{`
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              @keyframes scroll-reverse {
                0% {
                  transform: translateX(-50%);
                }
                100% {
                  transform: translateX(0);
                }
              }
              .animate-scroll {
                animation: scroll 20s linear infinite;
              }
              .animate-scroll-reverse {
                animation: scroll-reverse 20s linear infinite;
              }
            `}</style>
          </div>

          {/* Growth Journey */}
          <Section>
            <Chart />
          </Section>

          {/* Fun Stats */}
          <Section>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 text-center shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <stat.icon className="mb-2 text-teal" size={28} />
                  <div className="text-xs font-medium uppercase tracking-wider text-main-black/60">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-lg font-bold text-main-black">
                    {stat.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Footer */}
          <footer className="mt-20 text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative w-48">
                <div className="flex justify-between text-sm font-bold tracking-widest text-main-black/60">
                  <span>PH</span>
                  <span>JAPAN</span>
                </div>
                <div className="relative mt-2 h-0.5 w-full bg-gray">
                  <motion.div
                    className="absolute top-1/2 -mt-3 text-teal"
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
            <p className="mb-8 text-sm text-main-black/60">
              Future commitments.
            </p>
            <div className="flex justify-center space-x-6 text-teal">
              <a href="#" className="transition-transform hover:scale-110">
                <Instagram size={24} />
              </a>
              <a href="#" className="transition-transform hover:scale-110">
                <Twitter size={24} />
              </a>
            </div>
          </footer>
        </main>
      )}
    </div>
  )
}
