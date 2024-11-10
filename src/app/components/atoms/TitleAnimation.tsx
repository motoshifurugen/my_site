'use client'

import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(TextPlugin)

export default function TitleAnimation() {
  // 文字を一文字ずつ表示するアニメーション
  const textRef = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        duration: 2,
        text: "Furugen's<br />Island",
        delay: 0.5,
        ease: 'power4.inOut',
        parse: true,
      })
    }
  }, [])

  return (
    <div
      className="
        dm-sans h-[180px] max-w-full text-left text-6xl font-bold
        tracking-widest md:h-screen md:text-9xl"
      ref={textRef}
    ></div>
  )
}
