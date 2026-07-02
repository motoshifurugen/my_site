'use client'

import { externalLinks } from '@/config/links'
import { useI18n } from '@/i18n'
import { faPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { SiZenn } from 'react-icons/si'
import AnimatedLine from '../atoms/AnimatedLine'
import BeachDecorations from '../atoms/BeachDecorations'

const iconLinks = [
  { href: externalLinks.github, Icon: FaGithub, label: 'GitHub' },
  { href: externalLinks.x, Icon: FaXTwitter, label: 'X' },
  { href: externalLinks.zenn, Icon: SiZenn, label: 'Zenn' },
]

export default function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <div className="relative z-20 bg-sand py-10 dark:bg-night-black">
      <BeachDecorations />
      {/* 砂浜と干渉するため AnimatedLine はダークのみ表示（#228） */}
      <div className="hidden dark:block">
        <AnimatedLine />
      </div>
      <footer>
        <div className="container mx-auto p-4">
          <div className="container mt-4 h-auto md:flex md:h-32">
            <div className="rightFooter w-full select-none md:w-3/4">
              <p className="mb-1 text-lg md:mb-3">Motoshi Furugen</p>
              <p className="flex items-center">
                {t.footer.cities.oka}
                <FontAwesomeIcon
                  icon={faPlane}
                  className="mx-1 text-xs opacity-70"
                />
                {t.footer.cities.hij}
                <FontAwesomeIcon
                  icon={faPlane}
                  className="mx-1 text-xs opacity-70"
                />
                {t.footer.cities.tyo}
                <FontAwesomeIcon
                  icon={faPlane}
                  className="mx-1 text-xs opacity-70"
                />
                {t.footer.cities.bcd}
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
              <div className="mb-6 flex items-center space-x-6 md:mb-0">
                {iconLinks.map(({ href, Icon, label }) => (
                  <Link
                    key={label}
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="text-main-black dark:text-night-white">
                      <Icon size={24} />
                    </div>
                  </Link>
                ))}
                {/* note は react-icons に SiNote が無くテキスト表示のため構造が異なり個別に描画する */}
                <Link
                  href={externalLinks.note}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="text-lg font-bold text-main-black dark:text-night-white">
                    note
                  </div>
                </Link>
              </div>
              <p className="select-none self-end opacity-50">
                © {year} {t.footer.copyright}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
