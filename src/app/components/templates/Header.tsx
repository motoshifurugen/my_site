'use client'

import TitleLinkButton from '@/app/components/atoms/TitleLinkButton'
import GithubLinkButton from '@/app/components/molecules/GithubLinkButton'
import HeaderLinkButton from '@/app/components/molecules/HeaderLinkButton'
import ThemeSwitch from '@/app/components/organisms/ThemeSwitch'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import nextConfig from '../../../../next.config.mjs'

const BASE_PATH = nextConfig.basePath || ''

// ヘッダーリンク
const links = [
  { href: '/profile', text: 'Profile' },
  { href: '/blog', text: 'Blog' },
  { href: '/skills', text: 'Portfolio' },
  { href: '/game', text: 'Game' },
  { href: '/contact', text: 'Contact' },
]

const Header = () => {
  // ハンバーガーメニューの開閉
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(!menuOpen)
  const pathname = usePathname()
  const isMainPage = pathname === `${BASE_PATH}/` || pathname === '/'

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
			${!isMainPage ? 'bg-main-white dark:bg-night-black' : 'bg-transparent'}
		`}
    >
      <div className="container mx-auto flex flex-col py-6 md:flex-row">
        <div className="z-50 flex animate-fade-in-up items-center px-4">
          {/* タイトルボタン（トップページ以外で表示） */}
          {!isMainPage && (
            <TitleLinkButton href={`/`} text="Furugen's Island" />
          )}

          {/* ハンバーガーボタン（スマホ画面でのみ表示） */}
          <button
            className="ml-auto flex size-12 items-center justify-center rounded-full bg-white text-2xl text-main-black dark:bg-night-black dark:text-night-white md:hidden"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>
        </div>

        <div className="flex md:ml-auto md:justify-end">
          <nav
            className={`
            item-left fixed right-0 top-0 flex
            h-full flex-col flex-wrap transition-all duration-150 ease-in-out md:flex-row
            ${menuOpen ? 'translate-x-0 bg-white dark:bg-night-black' : 'translate-x-full bg-transparent'} w-full px-4 pt-16
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
            <div className="ml-auto mt-8 pr-7 md:m-0 md:pr-0">
              <GithubLinkButton />
            </div>
            <div className="mb-8 mt-auto flex w-full justify-end md:my-0 md:w-auto">
              <div className="ml-4 text-main-black dark:text-night-white">
                <ThemeSwitch />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
export default Header
