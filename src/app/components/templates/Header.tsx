'use client'

import TitleLinkButton from '@/app/components/atoms/TitleLinkButton'
import GithubLinkButton from '@/app/components/molecules/GithubLinkButton'
import HeaderDropdownButton from '@/app/components/molecules/HeaderDropdownButton'
import HeaderLinkButton from '@/app/components/molecules/HeaderLinkButton'
import LanguageSwitcher from '@/app/components/molecules/LanguageSwitcher'
import ThemeSwitch from '@/app/components/organisms/ThemeSwitch'
import { useI18n } from '@/i18n'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
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
  const entertainmentItems = [{ href: '/game', text: t.common.game }]

  useEffect(() => {
    // ページ遷移後にスクロール位置をトップにリセット
    window.scrollTo(0, 0)
  }, [pathname])

  // ページ遷移時にメニューを閉じる
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // メニューを開いている間は背後のスクロールをロックする
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

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
              <TitleLinkButton href={`/`} text="Furugen Island" />
            )}
          </div>

          {/* スマホ画面でのハンバーガーボタンのみ */}
          <div className="flex items-center md:hidden">
            <button
              className="flex size-12 items-center justify-center rounded-full bg-white text-2xl text-main-black dark:bg-night-black dark:text-night-white"
              onClick={toggleMenu}
              aria-label={
                menuOpen ? t.navigation.closeMenu : t.navigation.toggleMenu
              }
            >
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>

        <div className="flex md:ml-auto md:justify-end">
          <nav
            data-open={menuOpen ? 'true' : 'false'}
            className={`
            item-left group fixed right-0 top-0 flex
            size-full flex-col flex-wrap px-4 pt-20 ease-out md:flex-row
            ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}
            md:pointer-events-auto md:relative md:bg-transparent md:p-0
          `}
          >
            {/* 半透明＋backdrop-blur の背景（backdrop-filter 非対応時は不透明度を上げる）。
                項目・背景ともに open で同時にフェードイン/アウトする。 */}
            <div
              aria-hidden="true"
              className={`
              absolute inset-0 -z-10 bg-white/60 backdrop-blur-md transition-opacity duration-200
              ease-out supports-[backdrop-filter]:bg-white/50
              dark:bg-night-black/60 dark:supports-[backdrop-filter]:bg-night-black/50
              ${menuOpen ? 'opacity-100' : 'opacity-0'}
              motion-reduce:transition-none md:hidden
            `}
            />

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

            {/* スマホメニュー内のコントロール群（横並び）。項目と同じく open で表示する */}
            <div className="mt-6 flex items-center justify-end space-x-4 pr-8 opacity-0 transition-opacity duration-200 ease-out group-data-[open=true]:opacity-100 motion-reduce:transition-none md:hidden">
              <ThemeSwitch />
              <LanguageSwitcher />
            </div>

            <div className="ml-auto mt-6 pr-8 md:m-0 md:pr-0">
              <GithubLinkButton
                index={links.length + 1}
                onClick={() => setMenuOpen(false)}
              />
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
