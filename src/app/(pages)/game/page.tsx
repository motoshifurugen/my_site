'use client'

import { Controls } from '@/app/components/game/Controls'
import { Map } from '@/app/components/game/Map'
import { Player } from '@/app/components/game/Player'
import { Result } from '@/app/components/game/Result'
import { Scene } from '@/app/components/game/Scene'
import { Score } from '@/app/components/game/Score'
import './Game.css'

export default function GamePage() {
  return (
    <div className="mx-auto h-[calc(100vh-160px)] max-w-screen-lg">
      <div className="game">
        <Scene>
          <Player />
          <Map />
        </Scene>
        <Score />
        <Controls />
        <Result />
      </div>
    </div>
  )
}
