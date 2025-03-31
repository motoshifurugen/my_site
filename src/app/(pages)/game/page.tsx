'use client'

import { Controls } from '@/app/components/game/controls'
import { Map } from '@/app/components/game/Map'
import { Player } from '@/app/components/game/Player'
import { Scene } from '@/app/components/game/Scene'
import './Game.css'

export default function GamePage() {
  return (
    <div className="mx-auto h-[calc(100vh-160px)] max-w-screen-lg">
      <Scene>
        <Player />
        <Map />
      </Scene>
      <Controls />
    </div>
  )
}
