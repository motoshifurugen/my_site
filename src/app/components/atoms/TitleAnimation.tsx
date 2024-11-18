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
      gsap.to(textRef.current, {
        duration: 2,
        text: "Furugen's<br />Island",
        delay: 1.5,
        ease: 'power4.inOut',
        parse: true,
      })
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
    <div className="relative mb-24 h-[70vh]">
      <div
        className="
          dm-sans mt-10 max-w-full text-left text-5xl font-bold
          tracking-widest md:text-9xl"
        ref={textRef}
      ></div>
      <div className="absolute bottom-10 right-0 flex flex-col items-center">
        <div
          className="text-lg tracking-widest md:text-2xl"
          style={{ writingMode: 'vertical-rl' }}
        >
          scroll
        </div>
        <div ref={arrowRef} className="mt-3 text-lg md:text-2xl">
          ↓
        </div>
      </div>
    </div>
  )
}
