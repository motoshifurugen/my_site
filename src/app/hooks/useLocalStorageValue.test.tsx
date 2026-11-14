// localStorage の文字列 1 つを読み書きする hook useLocalStorageValue（Issue #286）の単体テスト。
//
// useSyncExternalStore に渡す購読（subscribeLocalStorage）と書き込み（writeLocalStorage）を、
// globalThis.localStorage の差し替えで確かめる。DOM のテストライブラリが無いため、hook 本体は
// renderToStaticMarkup でサーバー側の値だけを確かめる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  subscribeLocalStorage,
  useLocalStorageValue,
  writeLocalStorage,
} from './useLocalStorageValue'

const createStorage = (initial: Record<string, string>): Storage => {
  const items = new Map(Object.entries(initial))
  return {
    get length() {
      return items.size
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => {
      items.delete(key)
    },
    setItem: (key, value) => {
      items.set(key, String(value))
    },
  }
}

const stubLocalStorage = (
  initial: Record<string, string>,
): { storage: Storage; restore: () => void } => {
  const storage = createStorage(initial)
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
  })
  return {
    storage,
    restore: () => {
      Reflect.deleteProperty(globalThis, 'localStorage')
    },
  }
}

type Mode = 'light' | 'dark'

const parseMode = (raw: string | null): Mode =>
  raw === 'dark' ? 'dark' : 'light'

function ModeProbe({ storageKey }: { storageKey: string }) {
  const [mode] = useLocalStorageValue<Mode>(storageKey, parseMode, 'light')
  return <p>{mode}</p>
}

// --- writeLocalStorage ---

test('writeLocalStorage: 値を key に保存する', () => {
  // Given
  const { storage, restore } = stubLocalStorage({})
  try {
    // When
    writeLocalStorage('test-save', 'dark')
    // Then
    assert.equal(storage.getItem('test-save'), 'dark')
  } finally {
    restore()
  }
})

test('writeLocalStorage: 同じ key の購読者すべてに 1 回ずつ通知する', () => {
  // Given
  const { restore } = stubLocalStorage({})
  let firstCalls = 0
  let secondCalls = 0
  const unsubscribeFirst = subscribeLocalStorage('test-notify', () => {
    firstCalls += 1
  })
  const unsubscribeSecond = subscribeLocalStorage('test-notify', () => {
    secondCalls += 1
  })
  try {
    // When
    writeLocalStorage('test-notify', 'dark')
    // Then
    assert.deepEqual([firstCalls, secondCalls], [1, 1])
  } finally {
    unsubscribeFirst()
    unsubscribeSecond()
    restore()
  }
})

test('writeLocalStorage: 通知を受けた購読者は新しい値を読める', () => {
  // Given: 通知を受けたら localStorage を読み直す購読者（getSnapshot と同じ読み方）
  const { storage, restore } = stubLocalStorage({ 'test-order': 'light' })
  const seen: (string | null)[] = []
  const unsubscribe = subscribeLocalStorage('test-order', () => {
    seen.push(storage.getItem('test-order'))
  })
  try {
    // When
    writeLocalStorage('test-order', 'dark')
    // Then: 保存してから通知している
    assert.deepEqual(seen, ['dark'])
  } finally {
    unsubscribe()
    restore()
  }
})

test('writeLocalStorage: 別の key の購読者には通知しない', () => {
  // Given
  const { restore } = stubLocalStorage({})
  let calls = 0
  const unsubscribe = subscribeLocalStorage('test-other-key', () => {
    calls += 1
  })
  try {
    // When
    writeLocalStorage('test-written-key', 'dark')
    // Then
    assert.equal(calls, 0)
  } finally {
    unsubscribe()
    restore()
  }
})

// --- subscribeLocalStorage ---

test('subscribeLocalStorage: 購読を解除したら通知しない', () => {
  // Given
  const { restore } = stubLocalStorage({})
  let calls = 0
  const unsubscribe = subscribeLocalStorage('test-unsubscribe', () => {
    calls += 1
  })
  try {
    // When
    unsubscribe()
    writeLocalStorage('test-unsubscribe', 'dark')
    // Then
    assert.equal(calls, 0)
  } finally {
    restore()
  }
})

test('subscribeLocalStorage: 1 つを解除しても同じ key の他の購読者には通知する', () => {
  // Given
  const { restore } = stubLocalStorage({})
  let leftCalls = 0
  let remainingCalls = 0
  const unsubscribeLeft = subscribeLocalStorage('test-partial', () => {
    leftCalls += 1
  })
  const unsubscribeRemaining = subscribeLocalStorage('test-partial', () => {
    remainingCalls += 1
  })
  try {
    // When
    unsubscribeLeft()
    writeLocalStorage('test-partial', 'dark')
    // Then
    assert.deepEqual([leftCalls, remainingCalls], [0, 1])
  } finally {
    unsubscribeRemaining()
    restore()
  }
})

// --- useLocalStorageValue（サーバー描画） ---

test('useLocalStorageValue: localStorage が無いサーバーではサーバー側の値で描く', () => {
  // Given: サーバーには localStorage が無い
  assert.equal('localStorage' in globalThis, false)
  // When
  const html = renderToStaticMarkup(<ModeProbe storageKey="test-ssr-none" />)
  // Then
  assert.equal(html, '<p>light</p>')
})

test('useLocalStorageValue: 保存済みの値があってもサーバー描画ではサーバー側の値で描く', () => {
  // Given: 保存済みの値があっても、hydration をそろえるためサーバーの値で描く
  const { restore } = stubLocalStorage({ 'test-ssr-stored': 'dark' })
  try {
    // When
    const html = renderToStaticMarkup(
      <ModeProbe storageKey="test-ssr-stored" />,
    )
    // Then
    assert.equal(html, '<p>light</p>')
  } finally {
    restore()
  }
})
