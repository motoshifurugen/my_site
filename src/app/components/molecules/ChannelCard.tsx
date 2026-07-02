import React from 'react'
import { FiExternalLink } from 'react-icons/fi'

interface ChannelCardProps {
  href: string
  icon: React.ReactNode
  label: string
}

// 外部発信チャンネル（Zenn / note 等）への導線を 1 枚描画する汎用カード。
// 記事一覧より主張しないよう、hover 浮き上がりを付けず border 主体の控えめな装飾にする（#229）。
const ChannelCard: React.FC<ChannelCardProps> = ({ href, icon, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-gray bg-white p-4 text-main-black transition-colors duration-300 hover:border-teal dark:border-night-gray dark:bg-night-gray dark:text-night-white dark:hover:border-night-teal"
    >
      <span className="text-2xl">{icon}</span>
      <span className="flex-grow font-bold">{label}</span>
      <FiExternalLink className="opacity-60" aria-hidden />
    </a>
  )
}

export default ChannelCard
