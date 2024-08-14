"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

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
        parse: true,
      });
    }
  }, []);

  return (
    <div
      className="
        text-6xl md:text-9xl text-left dm-sans font-bold tracking-widest
        max-w-full h-[180px]"
      ref={textRef}
    ></div>
  );
}
