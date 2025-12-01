'use client'

import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { useState } from 'react'

interface SubMenuItem {
  href: string
  text: string
}

interface HeaderDropdownButtonProps {
  text: string
  subItems: SubMenuItem[]
  index: number
}

const HeaderDropdownButton: React.FC<HeaderDropdownButtonProps> = ({
  text,
  subItems,
  index,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-6 flex animate-fade-in-up items-center pr-8 md:mr-10 md:mt-0 md:pr-0">
      <div
        className="relative inline-block ml-auto md:ml-0 cursor-pointer"
        onMouseEnter={() => window.innerWidth >= 768 && setIsOpen(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsOpen(false)}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center cursor-pointer"
        >
          <span className="noto-sans-jp select-none text-lg font-bold text-main-black dark:text-night-white md:text-base">
            {text}
          </span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`ml-2 text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 min-w-[120px] rounded-lg bg-white shadow-lg dark:bg-night-black">
            <div className="py-1">
              {subItems.map((item, subIndex) => (
                <Link
                  key={subIndex}
                  href={item.href}
                  className="block w-full px-4 py-3 text-right md:text-center text-base font-bold text-black dark:text-night-white hover:bg-gray-100 dark:hover:bg-night-gray"
                  onClick={() => setIsOpen(false)}
                >
                  {item.text}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* クリック外でメニューを閉じるためのオーバーレイ */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  )
}

export default HeaderDropdownButton
