import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// tsx は .css/.module.css を JS として解釈しようとして失敗する。
// CodeBlock はサーバーコンポーネント化に伴い CSS Module を import するため、
// .css 解決を空モジュールへ差し替えるローダを登録してから動的 import する。
register(
  'data:text/javascript,' +
    encodeURIComponent(
      "export async function resolve(s,c,n){if(s.endsWith('.css'))return{url:'data:text/javascript,export default {}',shortCircuit:true};return n(s,c)}",
    ),
  import.meta.url,
)

// tsx は classic JSX runtime（React.createElement）へ変換するため React をグローバルに渡す。
;(globalThis as Record<string, unknown>).React = React

type CodeBlockComponent = React.FC<{
  language?: string
  fileName?: string
  children?: React.ReactNode
}>

let CodeBlock: CodeBlockComponent
before(async () => {
  CodeBlock = (await import('./CodeBlock')).default as CodeBlockComponent
})

function render(node: React.ReactElement): string {
  return renderToStaticMarkup(node)
}

test('CodeBlock: コア言語(javascript)は prism トークンでハイライトされる', () => {
  // Given: javascript のコード
  // When: CodeBlock を描画する
  const html = render(
    <CodeBlock language="javascript">{'const x = 1'}</CodeBlock>,
  )
  // Then: prism のトークン span が含まれる（サーバー側ハイライトが効いている）
  assert.match(html, /class="token /)
})

test('CodeBlock: 非コア言語(bash)も言語集約モジュール経由でハイライトされる', () => {
  // Given: bash のコード（投稿で最頻出。prismjs コアには含まれない）
  // When: CodeBlock を描画する
  const html = render(<CodeBlock language="bash">{'echo hello'}</CodeBlock>)
  // Then: bash が登録されトークンが付与される
  assert.match(html, /class="token /)
})

test('CodeBlock: 言語キーは小文字化して解決する(HTML→markup)', () => {
  // Given: 大文字の言語キー HTML（投稿に HTML:html 形式が存在）
  // When: CodeBlock を描画する
  const html = render(<CodeBlock language="HTML">{'<div></div>'}</CodeBlock>)
  // Then: markup として解決されハイライトされる
  assert.match(html, /class="token /)
})

test('CodeBlock: react-syntax-highlighter 由来のインラインスタイルを出力しない', () => {
  // Given: 任意のコード
  // When: CodeBlock を描画する
  const html = render(
    <CodeBlock language="javascript">{'const x = 1'}</CodeBlock>,
  )
  // Then: oneDark のような color インラインスタイルが含まれない（外部 CSS クラスのみで着色）
  assert.doesNotMatch(html, /style="[^"]*color/i)
})

test('CodeBlock: 出力要素に language- クラスが付与される', () => {
  // Given: 既知言語のコード
  // When: CodeBlock を描画する
  const html = render(
    <CodeBlock language="javascript">{'const x = 1'}</CodeBlock>,
  )
  // Then: prism-tomorrow.css を効かせるための language- クラスが付く
  assert.match(html, /class="[^"]*language-/)
})

test('CodeBlock: 未対応言語(zsh)は HTML エスケープした素テキストで出力する', () => {
  // Given: prism に文法のない zsh、かつ HTML 特殊文字を含むコード
  // When: CodeBlock を描画する
  const html = render(
    <CodeBlock language="zsh">{'echo "<tag> & done"'}</CodeBlock>,
  )
  // Then: 特殊文字はエスケープされ、生のタグとして解釈されない（XSS / タグ崩れ防止）
  assert.match(html, /&lt;tag&gt;/)
  assert.match(html, /&amp;/)
  assert.doesNotMatch(html, /<tag>/)
})

test('CodeBlock: 未対応言語(zsh)はハイライトトークンを付与しない', () => {
  // Given: prism に文法のない zsh
  // When: CodeBlock を描画する
  const html = render(<CodeBlock language="zsh">{'echo hello'}</CodeBlock>)
  // Then: token span は付かない（現状の react-syntax-highlighter でも非ハイライトのため退行なし）
  assert.doesNotMatch(html, /class="token /)
})

test('CodeBlock: fileName 指定時はタイトルとしてファイル名を表示する', () => {
  // Given: fileName を指定
  // When: CodeBlock を描画する
  const html = render(
    <CodeBlock language="typescript" fileName="Header.tsx">
      {'const x = 1'}
    </CodeBlock>,
  )
  // Then: ファイル名が出力される
  assert.match(html, /Header\.tsx/)
})

test('CodeBlock: fileName 未指定時は不要なタイトル文字列を出力しない', () => {
  // Given: fileName を指定しない
  // When: CodeBlock を描画する
  const html = render(
    <CodeBlock language="javascript">{'const x = 1'}</CodeBlock>,
  )
  // Then: 別ケースで使うファイル名は現れない
  assert.doesNotMatch(html, /Header\.tsx/)
})

test('CodeBlock: コピーボタン(button要素)を内包する', () => {
  // Given: 任意のコード
  // When: CodeBlock を描画する
  const html = render(
    <CodeBlock language="javascript">{'const x = 1'}</CodeBlock>,
  )
  // Then: コピー機能の button が配線されている
  assert.match(html, /<button/)
})

test('CodeBlock: 末尾改行は除去してコードを表示する', () => {
  // Given: 末尾に改行を含むコード
  // When: CodeBlock を描画する
  const html = render(<CodeBlock language="zsh">{'echo hello\n'}</CodeBlock>)
  // Then: 余分な末尾改行で空行が生じない
  assert.doesNotMatch(html, /echo hello\n\s*<\/code>/)
})
