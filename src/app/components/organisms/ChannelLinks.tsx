'use client'

import ChannelCard from '@/app/components/molecules/ChannelCard'
import { externalLinks } from '@/config/links'
import { useI18n } from '@/i18n'
import React from 'react'
import { SiZenn } from 'react-icons/si'

// ブログ index の「他の場所でも書いています」枠。Zenn / note への外部導線を常設する（#229）。
// URL は src/config/links.ts の externalLinks、文言は i18n（t.blog.channels）を出所とする。
const ChannelLinks: React.FC = () => {
  const { t } = useI18n()

  return (
    <section aria-label={t.blog.channels.heading}>
      <h2 className="mb-4 text-lg font-bold text-main-black dark:text-night-white">
        {t.blog.channels.heading}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ChannelCard
          href={externalLinks.zenn}
          icon={<SiZenn />}
          label={t.blog.channels.zenn}
        />
        {/* note は react-icons に該当アイコンが無いためテキスト "note" で表現する（Footer と同方針） */}
        <ChannelCard
          href={externalLinks.note}
          icon={<span className="text-lg font-bold">note</span>}
          label={t.blog.channels.note}
        />
      </div>
    </section>
  )
}

export default ChannelLinks
