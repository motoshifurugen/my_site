'use client'

import { useIsDarkMode } from '@/app/hooks/useIsDarkMode'
import { useEffect } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'

const THEME_STORAGE_KEY = 'theme'

// 表示は html の dark クラスから導く。ここではクラスと保存値を書き換えるだけ
const ThemeSwitch = () => {
  const theme = useIsDarkMode() ? 'dark' : 'light'

  useEffect(() => {
    const prefersDark =
      localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ||
      (!(THEME_STORAGE_KEY in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-1 rounded-lg p-2 text-sm font-medium transition-colors sm:space-x-2 sm:px-3"
      aria-label={
        theme === 'light' ? 'ダークモードをオン' : 'ダークモードをオフ'
      }
    >
      {theme === 'light' ? (
        <>
          <FiSun className="size-5" />
          <span className="sm:hidden">オフ</span>
        </>
      ) : (
        <>
          <FiMoon className="size-5" />
          <span className="sm:hidden">オン</span>
        </>
      )}
    </button>
  )
}

export default ThemeSwitch
