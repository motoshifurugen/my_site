'use client'

import { P5CanvasInstance } from '@p5-wrapper/react'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

const ReactP5Wrapper = dynamic(
  () => import('@p5-wrapper/react').then((mod) => mod.ReactP5Wrapper),
  {
    ssr: false,
  },
)

interface SketchNightSkyProps {
  mode: 'normal' | 'light'
}

const SketchNightSky: React.FC<SketchNightSkyProps> = ({ mode }) => {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  if (!isMounted) {
    return null
  }

  const sketch = (p: P5CanvasInstance) => {
    let stars: { x: number; y: number; size: number; alpha: number }[] = []
    let shootingStars: {
      x: number
      y: number
      alpha: number
      vx: number
      vy: number
    }[] = []
    let shootingStarTimer = 0

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: p.random(p.windowWidth),
          y: p.random(p.windowHeight),
          size: p.random(2, 10),
          alpha: p.random(100, 255),
        })
      }
    }

    p.draw = () => {
      if (mode === 'light' && p.frameCount % 4 !== 0) {
        return
      }

      p.background(10, 10, 30) // 夜空の色

      // 星の描画
      for (let star of stars) {
        p.fill(255, 250, 200, star.alpha)
        p.noStroke()
        p.circle(star.x, star.y, star.size)
        star.alpha = 100 + 155 * p.sin(p.frameCount * 0.02 + star.x * 0.1)
      }

      // ランダムなタイミングで流れ星を発生
      if (shootingStarTimer <= 0 && p.random() < 0.02) {
        shootingStars.push({
          x: p.random(p.windowWidth),
          y: p.random(p.windowHeight / 2),
          alpha: 255,
          vx: p.random(-5, -2),
          vy: p.random(2, 5),
        })
        shootingStarTimer = 100
      }

      // 流れ星の描画
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        let s = shootingStars[i]
        p.stroke(255, s.alpha)
        p.strokeWeight(2)
        p.line(s.x, s.y, s.x + s.vx * 5, s.y + s.vy * 5)
        s.x += s.vx
        s.y += s.vy
        s.alpha -= 5
        if (s.alpha <= 0) {
          shootingStars.splice(i, 1)
        }
      }
      shootingStarTimer--

      // クリックで星を追加
      if (p.mouseIsPressed || p.touches.length > 0) {
        const x = p.mouseIsPressed ? p.mouseX : p.touches[0].x
        const y = p.mouseIsPressed ? p.mouseY : p.touches[0].y
        stars.push({ x, y, size: p.random(5, 20), alpha: 255 })
      }
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  }

  return (
    <ReactP5Wrapper sketch={sketch} className="absolute inset-0 z-0 h-screen" />
  )
}

export default SketchNightSky
