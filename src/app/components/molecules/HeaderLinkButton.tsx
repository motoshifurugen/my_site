import Link from 'next/link'
import React from 'react'
import { staggerStyle } from './staggerStyle'

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
      className="mt-6 flex animate-fade-in-up items-center pr-8 hover:opacity-50 motion-reduce:animate-none md:mr-10 md:mt-0 md:pr-0"
      style={staggerStyle(index)}
      href={href}
    >
      <span className="noto-sans-jp ml-auto select-none text-lg font-bold text-main-black dark:text-night-white md:ml-0 md:text-base">
        {text}
      </span>
    </Link>
  )
}

export default HeaderLinkButton
