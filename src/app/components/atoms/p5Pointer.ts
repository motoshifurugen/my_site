import type { P5CanvasInstance } from '@p5-wrapper/react'

type Point = { x: number; y: number }

// p5 2 系の型は touches を object[] としか宣言しない。実行時のタッチ点は {x, y, ...} なので、
// 座標の形はここで 1 回だけ明示する。
export function pointerPosition(p: P5CanvasInstance): Point | null {
  if (p.mouseIsPressed) {
    return { x: p.mouseX, y: p.mouseY }
  }
  const touch = p.touches[0] as Point | undefined
  if (!touch) {
    return null
  }
  return { x: touch.x, y: touch.y }
}
