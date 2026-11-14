// GA4 の計測タグを1回だけ読み込むことを固定する静的検査テスト。
// 以前は同じ測定 ID を GoogleTagManager と GoogleAnalytics の両方に渡し、gtm.js と gtag を二重に読んでいた。
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const layout = readFileSync(new URL('./layout.tsx', import.meta.url), 'utf8')

test('GA4 は GoogleAnalytics で1回だけ読み込む', () => {
  assert.equal(layout.includes('GoogleTagManager'), false)
  assert.equal(layout.match(/<GoogleAnalytics /g)?.length, 1)
})
