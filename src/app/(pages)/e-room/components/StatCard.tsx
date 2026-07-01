'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

import type { StatItem } from '../types'

// タップで表→裏に一度だけ反転するフリップカード。表にラベル、裏に値を表示する。
const StatCard = ({ stat, index }: { stat: StatItem; index: number }) => {
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
          <stat.icon
            className="mb-2 text-white dark:text-night-white"
            size={28}
          />
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

export default StatCard
