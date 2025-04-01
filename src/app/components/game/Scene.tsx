'use client'

import { Canvas } from '@react-three/fiber'

export const Scene = ({ children }: { children: React.ReactNode }) => {
  return (
    <Canvas
      orthographic={true}
      shadows={true}
      camera={{
        up: [0, 0, 1],
        position: [300, -300, 300],
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      <ambientLight />
      {children}
    </Canvas>
  )
}
