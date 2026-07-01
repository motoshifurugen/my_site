'use client'

import { motion, useInView } from 'framer-motion'
import React, { useRef } from 'react'

// スクロールでビューに入ると下からフェードインする motion.section ラッパ。
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

export default Section
