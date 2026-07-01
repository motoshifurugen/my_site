'use client'

import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'
import { useEffect, useState } from 'react'

// 初回表示のイントロ。滞在日数を 0→113 までカウントアップし、
// 完了後 onComplete で本編へゲート解除する。初回描画に含める（dynamic 化しない）。
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

export default IntroOverlay
