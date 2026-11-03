// useCopyToClipboard のコピー処理 copyWithFeedback（Issue #250）の単体テスト。
// DOM のテストライブラリが無いため、フック本体ではなくコピー処理を
// globalThis.navigator の差し替えと node:test の mock.timers で確かめる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { mock, test } from 'node:test'
import { copyWithFeedback } from './useCopyToClipboard'

const COPIED_RESET_MS = 2000

const stubClipboard = (
  writeText: (text: string) => Promise<void>,
): { restore: () => void } => {
  Object.defineProperty(globalThis, 'navigator', {
    value: { clipboard: { writeText } },
    configurable: true,
  })
  return {
    restore: () => {
      Reflect.deleteProperty(globalThis, 'navigator')
    },
  }
}

test('copyWithFeedback: 渡した文字列をクリップボードに書く', async () => {
  // Given
  const written: string[] = []
  const { restore } = stubClipboard(async (text) => {
    written.push(text)
  })
  mock.timers.enable({ apis: ['setTimeout'] })
  try {
    // When
    await copyWithFeedback('https://example.com/blog/a', () => {})
    // Then
    assert.deepEqual(written, ['https://example.com/blog/a'])
  } finally {
    mock.timers.reset()
    restore()
  }
})

test('copyWithFeedback: 書けたらコピー済みにし、2 秒後に戻す', async () => {
  // Given
  const states: boolean[] = []
  const { restore } = stubClipboard(async () => {})
  mock.timers.enable({ apis: ['setTimeout'] })
  try {
    // When
    await copyWithFeedback('text', (copied) => states.push(copied))
    // Then: 書いた直後はコピー済み
    assert.deepEqual(states, [true])
    // When/Then: 2 秒経つ直前までは戻さない
    mock.timers.tick(COPIED_RESET_MS - 1)
    assert.deepEqual(states, [true])
    // When/Then: 2 秒経ったら戻す
    mock.timers.tick(1)
    assert.deepEqual(states, [true, false])
  } finally {
    mock.timers.reset()
    restore()
  }
})

test('copyWithFeedback: 書けなかったら reject し、コピー済みにしない', async () => {
  // Given
  const states: boolean[] = []
  const { restore } = stubClipboard(async () => {
    throw new Error('denied')
  })
  mock.timers.enable({ apis: ['setTimeout'] })
  try {
    // When/Then
    await assert.rejects(
      copyWithFeedback('text', (copied) => states.push(copied)),
      /denied/,
    )
    assert.deepEqual(states, [])
  } finally {
    mock.timers.reset()
    restore()
  }
})
