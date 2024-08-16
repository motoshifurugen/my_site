import Link from 'next/link'
import React from 'react'

interface HeaderLinkButtonProps {
  href: string
  text: string
  index: number
}

const HeaderLinkButton: React.FC<HeaderLinkButtonProps> = ({
  href,
  text,
  index,
}) => {
  return (
    <Link
      key={index}
      className="mt-8 flex animate-fade-in-up items-center hover:opacity-50 md:mr-10 md:mt-0"
      href={href}
    >
      <span className="noto-sans-jp text-lg font-bold md:text-base">
        {text}
      </span>
    </Link>
  )
}

export default HeaderLinkButton
