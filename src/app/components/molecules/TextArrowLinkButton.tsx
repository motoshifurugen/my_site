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
    <>
      <a href={`${BASE_PATH}${href}`} className="group mt-6 flex items-center">
        <h3>{text}</h3>

        {/* テキストの右につける矢印 */}
        <button
          className="
            relative ml-5 size-8
            max-h-[32px] max-w-[32px]
            rounded-full border
            border-main-black
            border-opacity-20 align-middle text-xs transition-all
            group-hover:bg-main-white"
          type="button"
        >
          <span>
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </button>
      </a>
    </>
  )
}

export default TextArrowLinkButton
