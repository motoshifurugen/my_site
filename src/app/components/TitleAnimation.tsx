"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export default function TitleAnimation() {

  // 文字を一文字ずつ表示するアニメーション
  const textRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        duration: 2,
        text: "Furugen's<br />Island",
        delay: 0.5,
        ease: "power4.inOut",
        parse: true
      });
    }
  }, []);

  return (
    <p
      className="
        text-6xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-[7.5rem]
        text-left
        text-font-main custom-font-dm-sans font-bold tracking-widest
        mx-8 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32
        max-w-full"
      ref={textRef}
    ></p>
  );
}
