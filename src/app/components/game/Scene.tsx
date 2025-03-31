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
    >
      <ambientLight />
      {children}
    </Canvas>
  )
}
