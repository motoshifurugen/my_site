'use client'

import * as THREE from 'three'
import { forwardRef } from 'react'

export const DirectionalLight = forwardRef<THREE.DirectionalLight>((_, ref) => {
  return (
    <directionalLight
      ref={ref}
      position={[-100, -100, 200]}
      up={[0, 0, 1]}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-400}
      shadow-camera-right={400}
      shadow-camera-top={400}
      shadow-camera-bottom={-400}
      shadow-camera-near={50}
      shadow-camera-far={400}
    />
  )
})
