import useGameStore from '@/app/components/game/stores/game'
import { state as player } from '@/app/components/game/stores/player'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function useHitDetection(
  vehicle: React.RefObject<THREE.Object3D | null>,
  rowIndex: number,
) {
  const endGame = useGameStore((state) => state.endGame)

  useFrame(() => {
    if (!vehicle.current) return
    if (!player.ref) return

    if (
      rowIndex === player.currentRow ||
      rowIndex === player.currentRow + 1 ||
      rowIndex === player.currentRow - 1
    ) {
      const vehicleBoundingBox = new THREE.Box3()
      vehicleBoundingBox.setFromObject(vehicle.current)

      const playerBoundingBox = new THREE.Box3()
      playerBoundingBox.setFromObject(player.ref)

      if (vehicleBoundingBox.intersectsBox(playerBoundingBox)) {
        endGame()
      }
    }
  })
}
