'use client'

import { useState } from "react"
import { Piece, GameData } from "./type"
import { field } from "./constants"
import { getReach } from "./utils/pieceMove"
import { initialPieces } from "./constants"

const ShogiPage: React.FC = () => {
  const [gameData, setGameData] = useState<GameData>({
    time: 0,
    player: 'black',
    state: 'initial',
    moves: [],
    winner: null,
  })
  const [kingBlack, setKingBlack] = useState<Piece>(initialPieces[0])
  const [rookBlack, setRookBlack] = useState<Piece>(initialPieces[1])
  const [bishopBlack, setBishopBlack] = useState<Piece>(initialPieces[2])
  const [goldBlack1, setGoldBlack1] = useState<Piece>(initialPieces[3])
  const [goldBlack2, setGoldBlack2] = useState<Piece>(initialPieces[4])
  const [silverBlack1, setSilverBlack1] = useState<Piece>(initialPieces[5])
  const [silverBlack2, setSilverBlack2] = useState<Piece>(initialPieces[6])
  const [knightBlack1, setKnightBlack1] = useState<Piece>(initialPieces[7])
  const [knightBlack2, setKnightBlack2] = useState<Piece>(initialPieces[8])
  const [lanceBlack1, setLanceBlack1] = useState<Piece>(initialPieces[9])
  const [lanceBlack2, setLanceBlack2] = useState<Piece>(initialPieces[10])
  const [pawnBlack1, setPawnBlack1] = useState<Piece>(initialPieces[11])
  const [pawnBlack2, setPawnBlack2] = useState<Piece>(initialPieces[12])
  const [pawnBlack3, setPawnBlack3] = useState<Piece>(initialPieces[13])
  const [pawnBlack4, setPawnBlack4] = useState<Piece>(initialPieces[14])
  const [pawnBlack5, setPawnBlack5] = useState<Piece>(initialPieces[15])
  const [pawnBlack6, setPawnBlack6] = useState<Piece>(initialPieces[16])
  const [pawnBlack7, setPawnBlack7] = useState<Piece>(initialPieces[17])
  const [pawnBlack8, setPawnBlack8] = useState<Piece>(initialPieces[18])
  const [pawnBlack9, setPawnBlack9] = useState<Piece>(initialPieces[19])
  
  const [kingWhite, setKingWhite] = useState<Piece>(initialPieces[20])
  const [rookWhite, setRookWhite] = useState<Piece>(initialPieces[21])
  const [bishopWhite, setBishopWhite] = useState<Piece>(initialPieces[22])
  const [goldWhite1, setGoldWhite1] = useState<Piece>(initialPieces[23])
  const [goldWhite2, setGoldWhite2] = useState<Piece>(initialPieces[24])
  const [silverWhite1, setSilverWhite1] = useState<Piece>(initialPieces[25])
  const [silverWhite2, setSilverWhite2] = useState<Piece>(initialPieces[26])
  const [knightWhite1, setKnightWhite1] = useState<Piece>(initialPieces[27])
  const [knightWhite2, setKnightWhite2] = useState<Piece>(initialPieces[28])
  const [lanceWhite1, setLanceWhite1] = useState<Piece>(initialPieces[29])
  const [lanceWhite2, setLanceWhite2] = useState<Piece>(initialPieces[30])
  const [pawnWhite1, setPawnWhite1] = useState<Piece>(initialPieces[31])
  const [pawnWhite2, setPawnWhite2] = useState<Piece>(initialPieces[32])
  const [pawnWhite3, setPawnWhite3] = useState<Piece>(initialPieces[33])
  const [pawnWhite4, setPawnWhite4] = useState<Piece>(initialPieces[34])
  const [pawnWhite5, setPawnWhite5] = useState<Piece>(initialPieces[35])
  const [pawnWhite6, setPawnWhite6] = useState<Piece>(initialPieces[36])
  const [pawnWhite7, setPawnWhite7] = useState<Piece>(initialPieces[37])
  const [pawnWhite8, setPawnWhite8] = useState<Piece>(initialPieces[38])
  const [pawnWhite9, setPawnWhite9] = useState<Piece>(initialPieces[39])

  const [pieceList, setPieceList] = useState<Piece[]>([
    kingBlack,
    rookBlack,
    bishopBlack,
    goldBlack1, goldBlack2,
    silverBlack1, silverBlack2,
    knightBlack1, knightBlack2,
    lanceBlack1, lanceBlack2,
    pawnBlack1, pawnBlack2, pawnBlack3, pawnBlack4, pawnBlack5, pawnBlack6, pawnBlack7, pawnBlack8, pawnBlack9,
    kingWhite,
    rookWhite,
    bishopWhite,
    goldWhite1, goldWhite2,
    silverWhite1, silverWhite2,
    knightWhite1, knightWhite2,
    lanceWhite1, lanceWhite2,
    pawnWhite1, pawnWhite2, pawnWhite3, pawnWhite4, pawnWhite5, pawnWhite6, pawnWhite7, pawnWhite8, pawnWhite9,
  ])

  const setPiece = (piece: Piece): void => {
    switch (piece.type) {
      case 'K':
        switch (piece.id) {
          case 1:
            setKingBlack(piece)
            break
          case 20:
            setKingWhite(piece)
            break
          default:
            break
        }
        break
      case 'P':
        switch (piece.id) {
          case 12:
            setPawnBlack1(piece)
            break
          case 13:
            setPawnBlack2(piece)
            break
          case 14:
            setPawnBlack3(piece)
            break
          case 15:
            setPawnBlack4(piece)
            break
          case 16:
            setPawnBlack5(piece)
            break
          case 17:
            setPawnBlack6(piece)
            break
          case 18:
            setPawnBlack7(piece)
            break
          case 19:
            setPawnBlack8(piece)
            break
          case 20:
            setPawnBlack9(piece)
            break
          case 32:
            setPawnWhite1(piece)
            break
          case 33:
            setPawnWhite2(piece)
            break
          case 34:
            setPawnWhite3(piece)
            break
          case 35:
            setPawnWhite4(piece)
            break
          case 36:
            setPawnWhite5(piece)
            break
          case 37:
            setPawnWhite6(piece)
            break
          case 38:
            setPawnWhite7(piece)
            break
          case 39:
            setPawnWhite8(piece)
            break
          case 40:
            setPawnWhite9(piece)
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
    setKingWhite({
      ...kingWhite,
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
          {field.map((col: number[], colIndex: number) => {
            return (
            <div key={`col_${colIndex}`} id="col_${colIndex}" className="w-full h-full">
              {col.map((row: number, rowIndex: number) => {
                const cell: [number, number] = field[colIndex][rowIndex].toString().split('').map(Number) as [number, number]
                return (
                  <div key={`${colIndex}-${rowIndex}`} id="row_${rowIndex}" className="border-2 border-main-black w-1/9 aspect-square flex items-center justify-center">
                    {(() => {
                      const piece = pieceList.find((piece: Piece) => piece.position[0] === cell[0] && piece.position[1] === cell[1])
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
                        if (getReach(holdedPiece)[cell[0]].includes(cell[1])) {
                          return <button
                            className="w-full h-full font-bold text-night-teal"
                            onClick={() => movePiece(holdedPiece, cell)}>⚫︎</button>
                        }
                      }
                      return null
                    })()}
                  </div>
                )
              })}
            </div>
          )
        })}
        </div>
      </div>
    </div>
  )
}

export default ShogiPage
