import { Piece } from "../type"

export const getReach = (piece: Piece): number[][] => {
  const currentPosition: [number, number] = piece.position
  const reach: number[][] = piece.reach
  const row = currentPosition[0]
  const col = currentPosition[1]
  piece.reach = [[], [], [], [], [], [], [], [], [], []]

  switch (piece.type) {
    case 'K':
      if(row - 1 >= 0){
        if (col - 1 >= 0) reach[row - 1].push(col - 1)
        reach[row - 1].push(col)
        if (col + 1 <= 9) reach[row - 1].push(col + 1)
      }
      if (col - 1 >= 0) reach[row].push(col - 1)
      reach[row].push(col)
      if (col + 1 <= 9) reach[row].push(col + 1)
      if (row + 1 <= 9) {
        if (col - 1 >= 0) reach[row + 1].push(col - 1)
        reach[row + 1].push(col)
        if (col + 1 <= 9) reach[row + 1].push(col + 1)
      }
      break
    case 'P':
      if (col - 1 >= 0) reach[row].push(col - 1)
      break
  }
  return reach
}
