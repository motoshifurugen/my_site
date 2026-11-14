import { useCallback, useSyncExternalStore } from 'react'

const listenersByKey = new Map<string, Set<() => void>>()

export const subscribeLocalStorage = (
  key: string,
  listener: () => void,
): (() => void) => {
  const listeners = listenersByKey.get(key) ?? new Set<() => void>()
  listeners.add(listener)
  listenersByKey.set(key, listeners)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      listenersByKey.delete(key)
    }
  }
}

export const writeLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value)
  listenersByKey.get(key)?.forEach((listener) => listener())
}

// サーバーと hydration の初回描画は serverValue で描き、その後に保存済みの値へ切り替える
export const useLocalStorageValue = <T extends string>(
  key: string,
  parse: (raw: string | null) => T,
  serverValue: T,
): [T, (value: T) => void] => {
  const subscribe = useCallback(
    (listener: () => void) => subscribeLocalStorage(key, listener),
    [key],
  )
  const value = useSyncExternalStore(
    subscribe,
    () => parse(localStorage.getItem(key)),
    () => serverValue,
  )
  const setValue = useCallback((next: T) => writeLocalStorage(key, next), [key])
  return [value, setValue]
}
