'use client'

import { useState } from 'react'
import { BiCheck, BiCopy } from 'react-icons/bi'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

type Props = {
  className?: string;
  children?: React.ReactNode;
  fileName?: string;
}

const CodeBlock: React.FC<Props> = ({ className, children = '', fileName }: Props) => {
  // コピー状態を管理するためのフック
  const [isCopied, setIsCopied] = useState(false)

  // クラス名から言語を抽出
  const match = className ? /language-(\w+)/.exec(className) : null
  const language = match ? match[1] : ''
  const code = String(children).replace(/\n$/, '')
  const syntaxHighlighterClass = fileName
    ? 'code-block-with-title'
    : 'code-block'

  // コードをクリップボードにコピーする関数
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <>
      <div className="code-block-wrapper">
        {fileName && <div className="code-block-title">{fileName}</div>}
        <div className="code-block-container">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            className={syntaxHighlighterClass}
          >
            {code}
          </SyntaxHighlighter>
          <button className="copy-button" onClick={handleCopy}>
            {isCopied ? <BiCheck /> : <BiCopy />}
          </button>
          {isCopied && <div className="copy-message">コピーしました</div>}
        </div>
      </div>
      <style jsx>{`
        .code-block-wrapper {
          position: relative;
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }
        .code-block-title {
          display: inline-block;
          border-radius: 0.3rem 0.3rem 0 0;
          background-color: #323e52;
          padding: 0.55rem 1rem;
          margin-top: 15px;
          color: white;
          font-size: 0.8rem;
          font-family: Inconsolata, Monaco, Consolas, 'Courier New', Courier,
            monospace;
        }
        .code-block-container {
          position: relative;
        }
        .copy-button {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background-color: #323e52;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.3rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .copy-button:hover {
          background-color: #3b4a63;
        }
        .copy-message {
          position: absolute;
          top: 0.5rem;
          right: 3rem;
          color: white;
          padding: 0.3rem 0.6rem;
          border-radius: 0.3rem;
          font-size: 0.8rem;
        }
      `}</style>
      <style jsx global>{`
        .code-block {
          border-radius: 0.3rem !important;
          padding: 1.5rem !important;
        }
        .code-block-with-title {
          border-radius: 0 0.3rem 0.3rem 0.3rem !important;
          padding: 1.5rem !important;
          margin-top: 0 !important;
        }
      `}</style>
    </>
  )
}

export default CodeBlock
