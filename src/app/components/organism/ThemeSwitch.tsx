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
    <button onClick={toggleTheme} className="ml-4 p-2 pr-6 md:pr-0">
      <div className="block dark:hidden">
        <div className="flex">
          <span className="mr-4 md:hidden">ダークモード：オフ</span>
          <FiSun className="text-2xl" />
        </div>
      </div>
      <div className="hidden dark:block">
        <div className="flex">
          <span className="mr-4 md:hidden">ダークモード：オン</span>
          <FiMoon className="text-2xl" />
        </div>
      </div>
    </button>
  )
}

export default ThemeSwitch
