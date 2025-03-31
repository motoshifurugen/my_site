import { tileSize } from '@/app/components/game/const'
import { state, stepCompleted } from '@/app/components/game/store/player'
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

    if (!moveClock.running) moveClock.start()

    const stepTime = 0.2
    const progress = Math.min(1, moveClock.getElapsedTime() / stepTime)

    setPosition(player, progress)
    setRotation(player, progress)

    if (progress >= 1) {
      stepCompleted()
      moveClock.stop()
    }
  })
}

function setPosition(player: THREE.Group, progress: number) {
  const startX = state.currentTile * tileSize
  const startY = state.currentRow * tileSize
  let endX = startX
  let endY = startY

  if (state.movesQueue[0] == 'left') endX -= tileSize
  if (state.movesQueue[0] == 'right') endX += tileSize
  if (state.movesQueue[0] == 'forward') endY += tileSize
  if (state.movesQueue[0] == 'backward') endY -= tileSize

  player.position.x = THREE.MathUtils.lerp(startX, endX, progress)
  player.position.y = THREE.MathUtils.lerp(startY, endY, progress)
  player.position.z = Math.sin(progress * Math.PI) * 8
}

function setRotation(player: THREE.Group, progress: number) {
  let endRotation = 0
  if (state.movesQueue[0] == 'forward') endRotation = 0
  if (state.movesQueue[0] == 'left') endRotation = Math.PI / 2
  if (state.movesQueue[0] == 'backward') endRotation = Math.PI
  if (state.movesQueue[0] == 'right') endRotation = -Math.PI / 2

  player.rotation.z = THREE.MathUtils.lerp(
    player.rotation.z,
    endRotation,
    progress,
  )
}
