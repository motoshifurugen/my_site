'use client'

import { P5CanvasInstance } from '@p5-wrapper/react'
import dynamic from 'next/dynamic'
import React from 'react'
import { pointerPosition } from './p5Pointer'

// p5 は import した時点で navigator などブラウザの API に触るので、サーバーでは読み込まない
const P5Canvas = dynamic(
  () => import('@p5-wrapper/react').then((mod) => mod.P5Canvas),
  {
    ssr: false,
  },
)

interface SketchCloudProps {
  mode: 'normal' | 'light'
}

const SketchCloud: React.FC<SketchCloudProps> = ({ mode }) => {
  const sketch = (p: P5CanvasInstance) => {
    let cloud_box: { x: number; y: number; size: number; alpha: number }[] = []
    let contrail = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 255 }
    let contrailTimer = 0
    let clicked = false

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)
      p.noStroke() // 枠線を描かない

      for (let i = 0; i < 3; i++) {
        const x = p.random(p.windowWidth)
        const y = p.random(p.windowHeight)
        cloud_box.push({ x, y, size: 180, alpha: 255 })
      }
    }

    p.draw = () => {
      // 描画の頻度をモードに応じて調整
      if (mode === 'light' && p.frameCount % 4 !== 0) {
        return
      }

      p.background(134, 179, 224) // 空色
      p.fill(246, 246, 246, 200)
      p.circle(p.mouseX, p.mouseY, 24)

      // ランダムなタイミングで飛行機雲を描画
      if (contrailTimer <= 0 && p.random() < 0.05) {
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

      const pointer = pointerPosition(p)
      if (pointer) {
        clicked = true
        cloud_box.push({ x: pointer.x, y: pointer.y, size: 75, alpha: 255 })
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

      // ぼかしは p5 の filter(BLUR) をやめ、下の CSS の blur で掛ける。
      // p5 の filter は全画面のピクセルを毎フレーム読み書きし、メインスレッドの
      // 8 割をこの 1 行が使っていた。CSS の filter は GPU の合成で済む。
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  }

  return (
    <P5Canvas
      sketch={sketch}
      className="absolute inset-0 z-0 h-screen blur-[6px]"
    />
  )
}

export default SketchCloud
