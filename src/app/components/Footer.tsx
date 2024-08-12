"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import AnimatedLine from './AnimatedLine';

export default function Footer() {
  return (
    <>
      <AnimatedLine />
      <footer className="p-4 md:p-2 mt-auto">
        <div className="container mx-auto md:flex h-32 py-6">
          <div className="rightFooter w-full md:w-3/4 mb-10 md:mb-0">
            <p className="mb-1 md:mb-3 text-lg">古堅 基史</p>
            <p className="text-sm md:text-base">
              沖縄
              <FontAwesomeIcon icon={faPlane} className="mx-3 opacity-70" />
              広島
              <FontAwesomeIcon icon={faPlane} className="mx-3 opacity-70" />
              埼玉
              <FontAwesomeIcon icon={faPlane} className="mx-3 opacity-70" />
              広島
              <FontAwesomeIcon icon={faPlane} className="mx-3 opacity-70" />
              横浜
            </p>
          </div>
          <div className="
            border-l-0 md:border-l-2
            border-t-2 md:border-t-0
            opacity-60
            md:mx-8 my-4 md:my-0
          "></div>
          <div className="leftFooter w-full md:w-1/4 flex flex-col justify-between my-8 md:my-0">
            <div className="flex space-x-4 mb-6 md:md-0">
              <a href="https://github.com/motoshifurugen" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} className="text-2xl" />
              </a>
              <a href="https://x.com/cocoahearts21" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faXTwitter} className="text-2xl" />
              </a>
            </div>
            <p className="self-end opacity-50">&copy; 2024 Furugen</p>
          </div>
        </div>
      </footer>
    </>
  )
}