// ProfileLink.tsx
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import nextConfig from '../../../../next.config.mjs'

const BASE_PATH = nextConfig.basePath || ''

interface TextArrowLinkButtonProps {
  text: string
  href: string
}

const TextArrowLinkButton: React.FC<TextArrowLinkButtonProps> = ({
  text,
  href,
}) => {
  return (
    <a
      href={`${BASE_PATH}${href}`}
      className="group mt-6 flex select-none items-center"
    >
      <h3 className="group-hover:underline">{text}</h3>

      {/* テキストの右につける矢印 */}
      <span
        aria-hidden="true"
        className="
          relative ml-5 size-8
          max-h-[32px] max-w-[32px]
          rounded-full border
          border-main-black border-opacity-20
          align-middle text-xs text-main-black
          dark:border-main-white dark:text-main-white"
      >
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          <FontAwesomeIcon icon={faArrowRight} />
        </span>
      </span>
    </a>
  )
}

export default TextArrowLinkButton
