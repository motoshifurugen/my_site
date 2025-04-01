import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { state as player } from '@/app/components/game/stores/player'
import useGameStore from '@/app/components/game/stores/game'

export default function useHitDetection(
  vehicle: React.RefObject<THREE.Object3D | null>,
  rowIndex: number,
) {
  const endGame = useGameStore((state) => state.endGame);

  useFrame(() => {
    if (!vehicle.current) return;
    if (!player.ref) return;

    if (
      rowIndex === player.currentRow ||
      rowIndex === player.currentRow + 1 ||
      rowIndex === player.currentRow - 1
    ) {
      const vehicleBoundingBox = new THREE.Box3();
      vehicleBoundingBox.setFromObject(vehicle.current);

      const playerBoundingBox = new THREE.Box3();
      playerBoundingBox.setFromObject(player.ref);

      if (vehicleBoundingBox.intersectsBox(playerBoundingBox)) {
        endGame();
      }
    }
  })
}
