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
      className="flex items-center mt-8 md:mt-0 md:mr-10 animate-fade-in-up hover:opacity-50"
      href={href}
    >
      <span className="noto-sans-jp text-lg md:text-base font-bold">
        {text}
      </span>
    </Link>
  )
}

export default HeaderLinkButton
