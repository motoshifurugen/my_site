import React, { useEffect, useRef } from 'react'

const AnimatedLine: React.FC = () => {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target instanceof HTMLElement) {
              entry.target.classList.remove('w-0')
              entry.target.classList.add('w-full')
            }
            observer.unobserve(entry.target) // アニメーションが実行されたらオブザーバーを停止
          }
        })
      },
      { threshold: 0.1 }, // 要素が10%表示されたらコールバックを実行
    )

    const currentLineRef = lineRef.current
    if (currentLineRef) {
      observer.observe(currentLineRef)
    }

    return () => {
      if (currentLineRef) {
        observer.unobserve(currentLineRef)
      }
    }
  }, [])

  return (
    <div
      ref={lineRef}
      className="h-0.5 my-6 bg-main-black transition-all duration-1000 ease-in-out w-0"
    ></div>
  )
}

export default AnimatedLine
