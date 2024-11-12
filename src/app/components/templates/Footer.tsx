'use client'

import { faPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import AnimatedLine from '../atoms/AnimatedLine'

export default function Footer() {
  return (
    <>
      <div className="relative z-20 bg-main-white py-10">
        <AnimatedLine />
        <footer>
          <div className="container mx-auto p-4">
            <div className="container mt-4 h-32 md:flex">
              <div className="rightFooter w-full md:w-3/4">
                <p className="mb-1 text-lg md:mb-3">Motoshi Furugen</p>
                <p className="flex items-center">
                  Okinawa
                  <FontAwesomeIcon
                    icon={faPlane}
                    className="mx-1 text-xxs opacity-70"
                  />
                  Hiroshima
                  <FontAwesomeIcon
                    icon={faPlane}
                    className="mx-1 text-xxs opacity-70"
                  />
                  Saitama
                  <FontAwesomeIcon
                    icon={faPlane}
                    className="mx-1 text-xxs opacity-70"
                  />
                  Hiroshima
                  <FontAwesomeIcon
                    icon={faPlane}
                    className="mx-1 text-xxs opacity-70"
                  />
                  Yokohama
                </p>
              </div>
              <div
                className="
              my-4 border-l-0
              border-t-2 opacity-40
              md:mx-8
              md:my-0 md:border-l-2 md:border-t-0
            "
              ></div>
              <div className="leftFooter flex w-full flex-col justify-between md:w-1/4">
                <div className="mb-6 flex space-x-6 md:mb-0">
                  <Link
                    href="https://github.com/motoshifurugen"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="text-main-black">
                      <FaGithub size={24} />
                    </div>
                  </Link>
                  <Link
                    href="https://x.com/cocoahearts21"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="text-main-black">
                      <FaXTwitter size={24} />
                    </div>
                  </Link>
                </div>
                <p className="self-end opacity-50">&copy; 2024 furugen</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
