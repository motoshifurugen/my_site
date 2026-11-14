import { useSyncExternalStore } from 'react'

// テーマ切替（ThemeSwitch）は html の class を直接書き換えるので class の変化を見る
const subscribeRootClass = (onChange: () => void): (() => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  return () => observer.disconnect()
}

const readIsDarkMode = (): boolean =>
  document.documentElement.classList.contains('dark')

// サーバーではテーマが分からないので、ライトモードとして描いて hydration をそろえる
const readServerIsDarkMode = (): boolean => false

export const useIsDarkMode = (): boolean =>
  useSyncExternalStore(subscribeRootClass, readIsDarkMode, readServerIsDarkMode)
