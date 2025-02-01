'use client'

import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import tocbot from 'tocbot'

const Toc: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  })
  useEffect(() => {
    tocbot.init({
      tocSelector: `.toc`,
      contentSelector: '.target-toc',
      headingSelector: 'h2, h3, h4',
      headingsOffset: 100, // ヘッダーの高さに応じて調整
      scrollSmoothOffset: -100,
    })

    // 不要となった tocbot インスタンスを削除
    return () => tocbot.destroy()
  }, [])

  return (
    <>
      <div ref={ref} className="mt-5"></div> {/* スクロール監視用 */}
      <div
        className={`rounded-lg bg-white p-4 shadow-sm transition-all duration-300 ${
          !inView ? 'fixed top-20 z-50 w-[312px]' : ''
        }`}
      >
        <span className="text-xl font-bold text-main-black dark:text-main-black">
          目次
        </span>
        <nav className="toc m-1 p-1" />
      </div>
    </>
  )
}

export default Toc
