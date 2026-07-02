import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'
import { headerMenuItemMotionClass } from './headerMenuItemMotion'
import { staggerStyle } from './staggerStyle'

interface GithubLinkButtonProps {
  index: number
  onClick?: () => void
}

const GithubLinkButton: React.FC<GithubLinkButtonProps> = ({
  index,
  onClick,
}) => {
  return (
    <Link
      className={`mr-auto mt-8 md:mt-0 ${headerMenuItemMotionClass}`}
      style={staggerStyle(index)}
      href="https://github.com/motoshifurugen/my_site"
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      <div className="group/github flex select-none items-center rounded border border-main-black px-4 py-2 text-main-black hover:bg-main-black hover:text-main-white dark:border-main-white dark:text-night-white dark:hover:bg-main-white dark:hover:text-main-black">
        <FontAwesomeIcon
          icon={faGithub}
          className="mr-2 group-hover/github:text-main-white dark:group-hover/github:text-main-black"
        />
        <span className="noto-sans-jp bg-transparent text-lg font-bold text-main-black group-hover/github:text-main-white dark:text-night-white dark:group-hover/github:text-main-black md:text-base">
          Repository
        </span>
      </div>
    </Link>
  )
}

export default GithubLinkButton
