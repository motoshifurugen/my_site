'use client'

import React, { useEffect } from 'react'
import tocbot from 'tocbot'

const Toc: React.FC = () => {
  useEffect(() => {
    tocbot.init({
      tocSelector: `.toc`,
      contentSelector: '.target-toc',
      headingSelector: 'h2, h3, h4',
      headingsOffset: 100,
      scrollSmoothOffset: -40,
    })

    // 不要となった tocbot インスタンスを削除
    return () => tocbot.destroy()
  }, [])

  return (
    <div className="mt-5 bg-white p-4 shadow-lg">
      <span className="text-xl font-bold">目次</span>
      <nav className="toc m-1 p-1" />
    </div>
  )
}

export default Toc
