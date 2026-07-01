// セクションラッパ（components/Section.tsx）の表示契約を固定する単体テスト
// （Issue #162 / TDD 先行）。
//
// 現行 page.tsx:310-331 の Section（in-view で表示する motion.section）を抽出する。
// props は { children: ReactNode; className?: string }。子要素を描画し、渡した
// className を反映することを固定する（useInView は SSR では走らないため安全）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は components/Section.tsx が未存在のため RED、実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
;(globalThis as Record<string, unknown>).React = React

type SectionProps = { children: React.ReactNode; className?: string }

let Section: React.FC<SectionProps>
before(async () => {
  Section = (await import('./Section'))
    .default as unknown as React.FC<SectionProps>
})

test('Section: 例外なく描画される（className 省略時も可）', () => {
  // Given/When/Then: className を省略しても throw しない（既定は付加クラスなし）
  assert.doesNotThrow(() =>
    renderToStaticMarkup(
      <Section>
        <span>content</span>
      </Section>,
    ),
  )
})

test('Section: 子要素を描画する', () => {
  // Given/When: 子要素を渡して描画
  const html = renderToStaticMarkup(
    <Section>
      <span>child-content</span>
    </Section>,
  )
  // Then: 子が出力される
  assert.ok(html.includes('child-content'))
})

test('Section: 渡した className を反映する', () => {
  // Given/When: 実ページで使われる修飾クラス（page.tsx:921 等）を渡して描画
  const html = renderToStaticMarkup(
    <Section className="text-center">
      <span>x</span>
    </Section>,
  )
  // Then: class 属性に指定クラスを含む（基底クラスに加えて追記される）
  assert.ok(html.includes('text-center'))
})

test('Section: <section> 要素として描画する', () => {
  // Given/When: 描画
  const html = renderToStaticMarkup(
    <Section>
      <span>x</span>
    </Section>,
  )
  // Then: motion.section は section タグを出力する
  assert.ok(html.includes('<section'))
})
