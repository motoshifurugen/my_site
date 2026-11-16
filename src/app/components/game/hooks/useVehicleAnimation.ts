import { calculateVehiclePosition } from '@/app/components/game/utilities/calculateVehiclePosition'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function useVehicleAnimation(
  ref: React.RefObject<THREE.Group | null>,
  direction: boolean,
  speed: number,
) {
  useFrame((state, delta) => {
    if (!ref.current) return
    const vehicle = ref.current

    vehicle.position.x = calculateVehiclePosition(
      vehicle.position.x,
      direction,
      speed,
      delta,
    )
  })
}
