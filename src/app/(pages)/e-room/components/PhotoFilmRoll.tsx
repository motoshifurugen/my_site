'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

import type { PhotoRows } from '../types'

// 3 行の写真を左右交互に無限スクロールさせるフィルムロール。
// rAF でスクロール位置を更新する（重い演出のため親側で dynamic import される）。
const PhotoFilmRoll = ({ photoRows }: { photoRows: PhotoRows }) => {
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

export default PhotoFilmRoll
