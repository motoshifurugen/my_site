import React from 'react'

interface TitleButtonProps {
  href: string
  text: string
}

const TitleLinkButton: React.FC<TitleButtonProps> = ({ href, text }) => {
  return (
    <a href={href}>
      <span className="dm-sans text-2xl font-bold">{text}</span>
    </a>
  )
}

export default TitleLinkButton
