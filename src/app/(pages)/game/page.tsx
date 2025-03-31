'use client'

import { Map } from '@/app/components/organism/Map'
import { Player } from '@/app/components/organism/Player'
import { Scene } from '@/app/components/templates/Scene'

export default function GamePage() {
  return (
    <div className="mx-auto h-[calc(100vh-160px)] max-w-screen-lg">
      <Scene>
        <Player />
        <Map />
      </Scene>
    </div>
  )
}
