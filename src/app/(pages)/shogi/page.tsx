'use client'

import { useState } from "react"

type GameData = {
  time: number,
  player: 'black' | 'white'
  state: 'initial' | 'playing' | 'finished'
  moves: Piece[],
  winner: 'black' | 'white' | null
}

// 9 x 9 のマップを作成
const field: number[][] = [
  [91, 92, 93, 94, 95, 96, 97, 98, 99],
  [81, 82, 83, 84, 85, 86, 87, 88, 89],
  [71, 72, 73, 74, 75, 76, 77, 78, 79],
  [61, 62, 63, 64, 65, 66, 67, 68, 69],
  [51, 52, 53, 54, 55, 56, 57, 58, 59],
  [41, 42, 43, 44, 45, 46, 47, 48, 49],
  [31, 32, 33, 34, 35, 36, 37, 38, 39],
  [21, 22, 23, 24, 25, 26, 27, 28, 29],
  [11, 12, 13, 14, 15, 16, 17, 18, 19]
]

// 駒を定義
type Piece = {
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

// 君たちの行けるところを計算する
const getReach = (piece: Piece): number[][] => {
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

// 将棋盤の表示のために整形
const rowPosition = (row: number): number => {
  return row + 1
}
const colPosition = (col: number): number => {
  return col + 1
}

const ShogiPage: React.FC = () => {
  const [gameData, setGameData] = useState<GameData>({
    time: 0,
    player: 'black',
    state: 'initial',
    moves: [],
    winner: null,
  })
  const [kingA, setKingA] = useState<Piece>({
    color: 'black',
    type: 'K',
    name: '王',
    promoted: false,
    position: [5, 9],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [kingB, setKingB] = useState<Piece>({
    color: 'white',
    type: 'K',
    name: '王',
    promoted: false,
    position: [5, 1],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  // 歩を定義
  const [pawnA1, setPawnA1] = useState<Piece>({
    color: 'black',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [1, 7],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnA2, setPawnA2] = useState<Piece>({
    color: 'black',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [2, 7],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnA3, setPawnA3] = useState<Piece>({
    color: 'black',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [3, 7],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnA4, setPawnA4] = useState<Piece>({
    color: 'black',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [4, 7],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnA5, setPawnA5] = useState<Piece>({
    color: 'black',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [5, 7],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnA6, setPawnA6] = useState<Piece>({
    color: 'black',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [6, 7],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnA7, setPawnA7] = useState<Piece>({
    color: 'black',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [7, 7],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnA8, setPawnA8] = useState<Piece>({
    color: 'black',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [8, 7],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnA9, setPawnA9] = useState<Piece>({
    color: 'black',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [9, 7],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })

  const [pawnB1, setPawnB1] = useState<Piece>({
    color: 'white',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [1, 3],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnB2, setPawnB2] = useState<Piece>({
    color: 'white',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [2, 3],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnB3, setPawnB3] = useState<Piece>({
    color: 'white',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [3, 3],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnB4, setPawnB4] = useState<Piece>({
    color: 'white',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [4, 3],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnB5, setPawnB5] = useState<Piece>({
    color: 'white',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [5, 3],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnB6, setPawnB6] = useState<Piece>({
    color: 'white',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [6, 3],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnB7, setPawnB7] = useState<Piece>({
    color: 'white',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [7, 3],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnB8, setPawnB8] = useState<Piece>({
    color: 'white',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [8, 3],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })
  const [pawnB9, setPawnB9] = useState<Piece>({
    color: 'white',
    type: 'P',
    name: '歩',
    promoted: false,
    position: [9, 3],
    reach: [[], [], [], [], [], [], [], [], [], []],
    hold: false,
  })

  const [pieceList, setPieceList] = useState<Piece[]>([
    kingA, kingB,
    pawnA1, pawnA2, pawnA3, pawnA4, pawnA5, pawnA6, pawnA7, pawnA8, pawnA9,
    pawnB1, pawnB2, pawnB3, pawnB4, pawnB5, pawnB6, pawnB7, pawnB8, pawnB9,
  ])

  const setPiece = (piece: Piece): void => {
    switch (piece.type) {
      case 'K':
        switch (piece) {
          case kingA:
            setKingA(piece)
            break
          case kingB:
            setKingB(piece)
            break
          default:
            break
        }
        break
      case 'P':
        switch (piece) {
          case pawnA1:
            setPawnA1(piece)
            break
          case pawnA2:
            setPawnA2(piece)
            break
          case pawnA3:
            setPawnA3(piece)
            break
          case pawnA4:
            setPawnA4(piece)
            break
          case pawnA5:
            setPawnA5(piece)
            break
          case pawnA6:
            setPawnA6(piece)
            break
          case pawnA7:
            setPawnA7(piece)
            break
          case pawnA8:
            setPawnA8(piece)
            break
          case pawnA9:
            setPawnA9(piece)
            break
          case pawnB1:
            setPawnB1(piece)
            break
          case pawnB2:
            setPawnB2(piece)
            break
          case pawnB3:
            setPawnB3(piece)
            break
          case pawnB4:
            setPawnB4(piece)
            break
          case pawnB5:
            setPawnB5(piece)
            break
          case pawnB6:
            setPawnB6(piece)
            break
          case pawnB7:
            setPawnB7(piece)
            break
          case pawnB8:
            setPawnB8(piece)
            break
          case pawnB9:
            setPawnB9(piece)
            break
          default:
            break
        }
        break
    }
    setPieceList([...pieceList])
  }

  // 移動
  const movePiece = (piece: Piece, position: [number, number]): void => {
    piece.hold = false
    piece.position = position
    setPiece(piece)
    changePlayer('white')
    setTimeout(() => {
      getComputerHand()
      changePlayer('black')
    }, 2000)
  }

  const getComputerHand = (): void => {
    setKingB({
      ...kingB,
      position: [5, 2],
    })
  }

  const changePlayer = (player: 'black' | 'white'): void => {
    setGameData({
      ...gameData,
      time: 0,
      player: player,
    })
  }

  // 駒を持ち上げたとき・離した時
  const selectPiece = (piece: Piece): void => {
    if (gameData.state !== 'playing') gameData.state = 'playing'
    if (gameData.player !== 'black') return
    pieceList.forEach((p: Piece) => {
      if (p == piece) {
        p.hold = !p.hold
      } else {
        p.hold = false
      }
    })
    setPiece(piece)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold">
        <span>
          {gameData.player === 'black' ? 'あなたの' : 'コンピューターの'}番です
        </span>
        <span>
          （時間：{gameData.time}秒）
        </span>
      </div>
      <div className="flex h-screen w-full items-start justify-center p-8">
        <div className="grid grid-cols-9 w-full">
          {field.map((row: number[], rowIndex: number) => (
            <div id="row_${rowIndex}" className="w-full h-full">
              {row.map((cell: number, cellIndex: number) => (
                <div id="cell_${cellIndex}" className="border-2 border-main-black w-1/9 aspect-square flex items-center justify-center">
                  {(() => {
                    const piece = pieceList.find((piece: Piece) => piece.position[0] === rowPosition(rowIndex) && piece.position[1] === colPosition(cellIndex))
                    if (piece) {
                      if (piece.color === 'white') {
                        return <span className="font-bold rotate-180">{piece.name}</span>
                      }
                      if (piece.hold) {
                        return <button
                          className="w-full h-full font-bold bg-night-teal text-white"
                          onClick={() => selectPiece(piece)}>{piece.name}</button>
                      } else {
                        return <button
                          className="w-full h-full font-bold"
                          onClick={() => selectPiece(piece)}>{piece.name}</button>
                      }
                    }
                    const holdedPiece = pieceList.find((piece: Piece) => piece.hold)
                    if (holdedPiece) {
                      if (getReach(holdedPiece)[rowPosition(rowIndex)].includes(colPosition(cellIndex))) {
                        return <button
                          className="w-full h-full font-bold text-night-teal"
                          onClick={() => movePiece(holdedPiece, [rowPosition(rowIndex), colPosition(cellIndex)])}>⚫︎</button>
                      }
                    }
                    return null
                  })()}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShogiPage
