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
      gsap.to(textRef.current, { duration: 2.5, text: "Furugen", delay: 0.25, ease: "power4.inOut"});
    }
  }, []);

  return (
    <p
      className="text-[10rem] text-left text-font-main font-dm-sans font-bold tracking-widest mx-[100px] opacity-85"
      ref={textRef}
    ></p>
  );
}
