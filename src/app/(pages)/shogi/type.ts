export type Piece = {
  id: number,
  color: 'black' | 'white',
  type:
    'K' // 王将
    | 'R' // 飛車
    | 'B' // 角行
    | 'G' // 金将
    | 'S' // 銀将
    | 'N' // 桂馬
    | 'L' // 香車
    | 'P', // 歩
  name: string,
  promoted: boolean,
  position: [number, number],
  reach: number[][],
  hold: boolean
}

export type GameData = {
  time: number,
  player: 'black' | 'white'
  state: 'initial' | 'playing' | 'finished'
  moves: Piece[],
  winner: 'black' | 'white' | null
}