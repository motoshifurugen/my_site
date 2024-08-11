"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import AnimatedLine from './AnimatedLine';

export default function Footer() {
  return (
    <>
      <AnimatedLine />
      <footer className="p-2 mt-auto">
        <div className="container mx-auto flex h-32 py-6">
          <div className="rightFooter w-3/4">
            <p className="mb-3 text-lg">古堅 基史</p>
            <p>
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
          <div className="border-l-2 opacity-50 mx-8"></div>
          <div className="leftFooter w-1/4 flex flex-col justify-between">
            <div className="flex space-x-4">
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