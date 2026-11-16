import { state, stepCompleted } from '@/app/components/game/stores/player'
import { calculatePlayerPosition } from '@/app/components/game/utilities/calculatePlayerPosition'
import { calculatePlayerRotation } from '@/app/components/game/utilities/calculatePlayerRotation'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function usePlayerAnimation(
  ref: React.RefObject<THREE.Group | null>,
) {
  const moveClock = new THREE.Clock(false)

  useFrame(() => {
    if (!ref.current) return
    if (!state.movesQueue.length) return
    const player = ref.current
    const body = player.children[0]
    const direction = state.movesQueue[0]

    if (!moveClock.running) moveClock.start()

    const stepTime = 0.2
    const progress = Math.min(1, moveClock.getElapsedTime() / stepTime)

    const position = calculatePlayerPosition(
      { rowIndex: state.currentRow, tileIndex: state.currentTile },
      direction,
      progress,
    )
    player.position.x = position.x
    player.position.y = position.y
    body.position.z = position.z
    body.rotation.z = calculatePlayerRotation(
      body.rotation.z,
      direction,
      progress,
    )

    if (progress >= 1) {
      stepCompleted()
      moveClock.stop()
    }
  })
}
