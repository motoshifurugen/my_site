import React from 'react'

interface TitleButtonProps {
  href: string
  text: string
}

const TitleLinkButton: React.FC<TitleButtonProps> = ({ href, text }) => {
  return (
    <a href={href}>
      <span className="dm-sans font-bold text-2xl">{text}</span>
    </a>
  )
}

export default TitleLinkButton
