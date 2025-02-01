import Link from 'next/link'
import React from 'react'

interface TitleLinkButtonProps {
  href: string
  text: string
}

const TitleLinkButton: React.FC<TitleLinkButtonProps> = ({ href, text }) => {
  return (
    <Link href={href}>
      <span className="dm-sans text-2xl font-bold text-main-black dark:text-main-white">
        {text}
      </span>
    </Link>
  )
}

export default TitleLinkButton
