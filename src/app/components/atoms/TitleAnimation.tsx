'use client'

import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import gsap from 'gsap'
import { useEffect, useLayoutEffect, useRef } from 'react'

// タイトルは 2 行構成。JSX から直接描画し、no-JS / reduced-motion でも即時表示する。
const TITLE_LINES = ['Furugen', 'Island']

// フェード開始状態（opacity:0）をペイント前に確定させ初回フラッシュ（FOUC）を防ぐ。
// SSR では useLayoutEffect が警告を出すため、サーバー側は useEffect にフォールバックする。
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function TitleAnimation() {
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const arrowRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    // prefers-reduced-motion: reduce の場合はアニメーションせず即時表示のままにする。
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const lines = lineRefs.current.filter(
      (line): line is HTMLSpanElement => line !== null,
    )
    gsap.fromTo(
      lines,
      { opacity: 0, y: 16, filter: 'blur(8px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power2.out',
        stagger: 0.15,
      },
    )

    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        y: -6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 1.6,
      })
    }
  }, [])

  return (
    <div className="relative mb-24 h-[80vh]">
      <div
        className="dm-sans mt-10 max-w-full select-none text-left text-5xl
          font-bold tracking-widest text-main-black dark:text-night-white md:text-9xl"
      >
        {TITLE_LINES.map((line, index) => (
          <span
            key={line}
            ref={(el) => {
              lineRefs.current[index] = el
            }}
            className="block"
          >
            {line}
          </span>
        ))}
      </div>
      <div className="absolute bottom-10 right-0 flex flex-col items-center">
        <div
          className="select-none text-lg tracking-widest text-main-black dark:text-night-white md:text-2xl"
          style={{ writingMode: 'vertical-rl' }}
        >
          scroll
        </div>
        <div
          ref={arrowRef}
          className="mt-3 select-none text-lg text-main-black dark:text-night-white md:text-2xl"
        >
          <FontAwesomeIcon
            icon={faArrowDown}
            className="text-sm md:text-base"
          />
        </div>
      </div>
    </div>
  )
}
