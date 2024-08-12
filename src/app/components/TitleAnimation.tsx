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
      className="text-[7.5rem] text-left text-font-main custom-font-dm-sans font-bold tracking-widest mx-[100px] opacity-85"
      ref={textRef}
    ></p>
  );
}
