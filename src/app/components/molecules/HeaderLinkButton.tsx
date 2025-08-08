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
      className="mt-6 flex animate-fade-in-up items-center pr-8 hover:opacity-50 md:mr-10 md:mt-0 md:pr-0"
      href={href}
    >
      <span className="noto-sans-jp ml-auto select-none text-lg font-bold text-main-black dark:text-night-white md:ml-0 md:text-base">
        {text}
      </span>
    </Link>
  )
}

export default HeaderLinkButton
