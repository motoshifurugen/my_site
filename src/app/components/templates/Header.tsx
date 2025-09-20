'use client'

import TitleLinkButton from '@/app/components/atoms/TitleLinkButton'
import GithubLinkButton from '@/app/components/molecules/GithubLinkButton'
import HeaderLinkButton from '@/app/components/molecules/HeaderLinkButton'
import HeaderDropdownButton from '@/app/components/molecules/HeaderDropdownButton'
import LanguageSwitcher from '@/app/components/molecules/LanguageSwitcher'
import ThemeSwitch from '@/app/components/organisms/ThemeSwitch'
import { useI18n } from '@/i18n'
import { faBars, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import nextConfig from '../../../../next.config.mjs'

const BASE_PATH = nextConfig.basePath || ''

const Header = () => {
  const { t } = useI18n()
  // ハンバーガーメニューの開閉
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(!menuOpen)
  const pathname = usePathname()
  const isMainPage = pathname === `${BASE_PATH}/` || pathname === '/'

  // ヘッダーリンク（国際化対応）
  const links = [
    { href: '/profile', text: t.common.about },
    { href: '/blog', text: t.common.blog },
    { href: '/skills', text: t.common.portfolio },
    { href: '/contact', text: t.common.contact },
  ]

  // エンタメドロップダウンメニュー
  const entertainmentItems = [
    { href: '/game', text: t.common.game },
    { href: '/tanka', text: t.common.tanka },
  ]

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
        <div className="z-50 flex animate-fade-in-up items-center justify-between px-4">
          {/* タイトルボタン（トップページ以外で表示） */}
          <div className="flex-1">
            {!isMainPage && (
              <TitleLinkButton href={`/`} text="Furugen's Island" />
            )}
          </div>

          {/* スマホ画面でのハンバーガーボタンのみ */}
          <div className="flex items-center md:hidden">
            <button
              className="flex size-12 items-center justify-center rounded-full bg-white text-2xl text-main-black dark:bg-night-black dark:text-night-white"
              onClick={toggleMenu}
              aria-label={menuOpen ? t.navigation.closeMenu : t.navigation.toggleMenu}
            >
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>

        <div className="flex md:ml-auto md:justify-end">
          <nav
            className={`
            item-left fixed right-0 top-0 flex
            h-full flex-col flex-wrap transition-all duration-150 ease-in-out md:flex-row
            ${menuOpen ? 'translate-x-0 bg-white dark:bg-night-black' : 'translate-x-full bg-transparent'} w-full px-4 pt-20
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
            
            {/* 遊びドロップダウンメニュー */}
            <HeaderDropdownButton
              text={t.common.play}
              subItems={entertainmentItems}
              index={links.length}
            />
            
            {/* スマホメニュー内のコントロール群（横並び） */}
            <div className="mt-6 pr-7 flex items-center justify-end space-x-4 md:hidden">
              <ThemeSwitch />
              <LanguageSwitcher />
            </div>

            <div className="ml-auto mt-6 pr-7 md:m-0 md:pr-0">
              <GithubLinkButton />
            </div>
            
            {/* デスクトップでのテーマ・言語切り替え */}
            <div className="mb-8 mt-auto hidden w-full justify-end md:my-0 md:flex md:w-auto">
              <div className="ml-4 text-main-black dark:text-night-white">
                <ThemeSwitch />
              </div>
              <div className="ml-4 text-main-black dark:text-night-white">
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
export default Header
