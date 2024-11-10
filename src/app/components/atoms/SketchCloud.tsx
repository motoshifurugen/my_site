'use client'

import { P5CanvasInstance } from '@p5-wrapper/react'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

// ReactP5Wrapperを動的に読み込み、SSRを無効化
const ReactP5Wrapper = dynamic(
  () => import('@p5-wrapper/react').then((mod) => mod.ReactP5Wrapper),
  {
    ssr: false,
  },
)

const SketchCloud: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  if (!isMounted) {
    return null
  }

  const sketch = (p: P5CanvasInstance) => {
    let cloud_box: { x: number; y: number; size: number; alpha: number }[] = []
    let contrail = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 255 }
    let contrailTimer = 0
    let clicked = false

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)
      p.noStroke() // 枠線を描かない
    }

    p.draw = () => {
      p.background(134, 179, 224) // 空色
      p.fill(246, 246, 246, 200)
      p.circle(p.mouseX, p.mouseY, 24)

      // ランダムなタイミングで飛行機雲を描画
      if (contrailTimer <= 0 && p.random() < 0.01) {
        if (p.random() < 0.5) {
          let position = p.random(100, p.windowHeight)
          contrail = { x1: 0, y1: position, x2: 0, y2: position, alpha: 255 }
        } else {
          let position = p.random(0, p.windowWidth - 100)
          contrail = {
            x1: position,
            y1: p.windowHeight,
            x2: position,
            y2: p.windowHeight,
            alpha: 255,
          }
        }
        contrailTimer = 500 // 飛行機雲の表示時間
      }

      if (contrailTimer > 0) {
        p.stroke(246, contrail.alpha) // 白色の線
        p.strokeWeight(4)
        p.line(contrail.x1, contrail.y1, contrail.x2, contrail.y2)
        contrail.x2 += 2
        contrail.y2 -= 2
        contrail.alpha -= 0.6
        contrailTimer--
      }

      p.noStroke()

      if (p.mouseIsPressed) {
        clicked = true
        cloud_box.push({ x: p.mouseX, y: p.mouseY, size: 75, alpha: 255 })
      }

      for (let i = 0; i < cloud_box.length; i++) {
        let cloud = cloud_box[i]
        p.fill(200, 200, 200, cloud.alpha * 0.25)
        p.circle(cloud.x, cloud.y + 5, cloud.size)
        p.fill(246, 246, 246, cloud.alpha)
        p.circle(cloud.x, cloud.y, cloud.size)
        cloud.x -= 0.5
        cloud.alpha -= 0.5
        cloud.size += 0.1
      }

      cloud_box = cloud_box.filter((cloud) => cloud.alpha > 0)

      p.filter(p.BLUR, 3)

      if (!clicked) {
        p.textAlign(p.CENTER, p.CENTER)
        p.textSize(32)
        p.textStyle(p.BOLD)
        p.fill(246)
        p.text('Click!', p.width / 2, p.height / 2)
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

export default SketchCloud