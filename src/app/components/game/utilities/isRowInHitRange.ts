export function isRowInHitRange(
  vehicleRow: number,
  playerRow: number,
): boolean {
  return (
    vehicleRow === playerRow ||
    vehicleRow === playerRow + 1 ||
    vehicleRow === playerRow - 1
  )
}
