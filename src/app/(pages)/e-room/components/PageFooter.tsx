'use client'

import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'
import { FaInstagram, FaXTwitter } from 'react-icons/fa6'

// ページ末尾の締め（帰路の飛行機演出 + 締め文 + SNS リンク）。
const PageFooter = () => (
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
    <h2 className="mb-2 text-2xl font-bold text-teal">See you again.</h2>
    <p className="mb-8 text-sm text-main-black/60 dark:text-night-white/80">
      Wishing you beautiful days ahead.
    </p>
    <div className="flex justify-center space-x-6 text-teal dark:text-night-teal">
      <a
        href="https://www.instagram.com/motoshi_cocoa"
        rel="noopener noreferrer"
        target="_blank"
        className="transition-transform hover:scale-110"
      >
        <FaInstagram size={24} />
      </a>
      <a
        href="https://x.com/cocoahearts21"
        rel="noopener noreferrer"
        target="_blank"
        className="transition-transform hover:scale-110"
      >
        <FaXTwitter size={24} />
      </a>
    </div>
  </footer>
)

export default PageFooter
