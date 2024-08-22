'use client'

import React, { useEffect } from 'react'
import tocbot from 'tocbot'

const Toc: React.FC = () => {
  useEffect(() => {
    tocbot.init({
      tocSelector: '.toc',
      contentSelector: '.target-toc',
      headingSelector: 'h2, h3, h4',
      headingsOffset: 100,
      scrollSmoothOffset: -40,
    })

    // 不要となった tocbot インスタンスを削除
    return () => tocbot.destroy()
  }, [])

  return <nav className="toc rounded-lg bg-gray p-4 shadow-lg"></nav>
}

export default Toc
