'use client'

import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(TextPlugin)

export default function TitleAnimation() {
  // アニメーション
  const textRef = useRef<HTMLParagraphElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0 },
        {
          duration: 1.5,
          text: "Furugen's<br />Island",
          ease: 'power4.inOut',
          parse: true,
          opacity: 1,
        },
      )
    }

    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        duration: 0.8,
      })
    }
  }, [])

  return (
    <div className="relative mb-24 h-[80vh]">
      <div
        className="
          dm-sans mt-10 max-w-full select-none text-left text-5xl
          font-bold tracking-widest text-main-black dark:text-night-white md:text-9xl"
        ref={textRef}
      ></div>
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
          ↓
        </div>
      </div>
    </div>
  )
}
