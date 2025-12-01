'use client'

import { useEffect, useState } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'

const ThemeSwitch = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      setTheme('dark')
    } else {
      document.documentElement.classList.remove('dark')
      setTheme('light')
    }
  }, [])

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setTheme('dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setTheme('light')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-1 rounded-lg bg-gray-200 px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:space-x-2 sm:px-3"
      aria-label={
        theme === 'light' ? 'ダークモードをオン' : 'ダークモードをオフ'
      }
    >
      {theme === 'light' ? (
        <>
          <FiSun className="h-5 w-5" />
          <span className="sm:hidden">オフ</span>
        </>
      ) : (
        <>
          <FiMoon className="h-5 w-5" />
          <span className="sm:hidden">オン</span>
        </>
      )}
    </button>
  )
}

export default ThemeSwitch
