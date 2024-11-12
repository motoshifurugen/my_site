'use client'

import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import nextConfig from '../../../../next.config.mjs'
import TitleLinkButton from '../atoms/TitleLinkButton'
import GithubLinkButton from '../molecules/GithubLinkButton'
import HeaderLinkButton from '../molecules/HeaderLinkButton'

const BASE_PATH = nextConfig.basePath || ''

// ヘッダーリンク
const links = [
  { href: '/profile', text: 'Profile' },
  { href: '/blog', text: 'Blog' },
  { href: '/skills', text: 'Portfolio' },
  { href: '/contact', text: 'Contact' },
]

const Header = () => {
  // ハンバーガーメニューの開閉
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(!menuOpen)
  const pathname = usePathname()
  const isMainPage = pathname === `${BASE_PATH}/` || pathname === '/'
  const isBlogPage = pathname.startsWith('/blog/')

  useEffect(() => {
    // ページ遷移後にスクロール位置をトップにリセット
    window.scrollTo(0, 0)
  }, [pathname])

  // ページ遷移時にメニューを閉じる
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`
			fixed left-0 top-0 z-50 w-full
			${!isMainPage ? 'bg-main-white' : 'bg-transparent'}
		`}
    >
      <div className="container mx-auto flex flex-col py-6 md:flex-row">
        <div className="z-50 flex animate-fade-in-up items-center px-4">
          {/* タイトルボタン（トップページ以外で表示） */}
          {!isMainPage && (
            <TitleLinkButton href={`${BASE_PATH}/`} text="Furugen's Island" />
          )}

          {/* ハンバーガーボタン（スマホ画面でのみ表示） */}
          <button
            className="ml-auto flex size-12 items-center justify-center rounded-full bg-white text-2xl md:hidden"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>
        </div>

        <div className="flex md:ml-auto md:justify-end">
          {!isBlogPage && (
            <nav
              className={`
            item-left fixed right-0 top-0 flex
            h-full flex-col flex-wrap bg-white transition-transform duration-300 ease-in-out md:flex-row
            ${menuOpen ? 'translate-x-0' : 'translate-x-full'} w-full px-4 pt-32
            md:relative md:translate-x-0 md:bg-transparent md:p-0
          `}
            >
              {links.map((link, index) => (
                <HeaderLinkButton
                  key={index}
                  href={link.href}
                  text={link.text}
                  index={index}
                />
              ))}
              <GithubLinkButton />
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
export default Header
