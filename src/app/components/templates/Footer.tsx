'use client'

import { faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { faPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname } from 'next/navigation'
import nextConfig from '../../../../next.config.mjs'
import AnimatedLine from '../atoms/AnimatedLine'

const BASE_PATH = nextConfig.basePath || ''

export default function Footer() {
  const pathname = usePathname()
  const isMainPage = pathname === `${BASE_PATH}/` || pathname === '/'

  return (
    <>
      {!isMainPage && <AnimatedLine />}
      <footer>
        <section>
          <div className="container mt-4 h-32 md:flex">
            <div className="rightFooter w-full md:w-3/4">
              <p className="mb-1 text-lg md:mb-3">古堅 基史</p>
              <p>
                沖縄
                <FontAwesomeIcon icon={faPlane} className="mx-2 opacity-70" />
                広島
                <FontAwesomeIcon icon={faPlane} className="mx-2 opacity-70" />
                埼玉
                <FontAwesomeIcon icon={faPlane} className="mx-2 opacity-70" />
                広島
                <FontAwesomeIcon icon={faPlane} className="mx-2 opacity-70" />
                横浜
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
                <a
                  href="https://github.com/motoshifurugen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faGithub} className="text-2xl" />
                </a>
                <a
                  href="https://x.com/cocoahearts21"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faXTwitter} className="text-2xl" />
                </a>
              </div>
              <p className="self-end opacity-50">&copy; 2024 Furugen</p>
            </div>
          </div>
        </section>
      </footer>
    </>
  )
}
