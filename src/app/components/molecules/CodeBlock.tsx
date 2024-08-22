import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Props {
  className?: string
  children?: React.ReactNode
}

const CodeBlock: React.FC<Props> = ({ className, children = '' }: Props) => {
  const match = /language-(\w+)(:?.*)/.exec(className || '')
  const language = match && match[1] ? match[1] : ''
  const fileName = match && match[2] ? match[2].slice(1) : ''
  const code = String(children).replace(/\n$/, '')
  const syntaxHighlighterClass = fileName
    ? 'code-block-with-title'
    : 'code-block'

  return (
    <>
      <div className="mb-8 text-sm">
        {fileName && (
          <div className="inline-block rounded-t bg-gray px-4 py-2 font-sans text-xs text-white">
            {fileName}
          </div>
        )}
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          className={syntaxHighlighterClass}
        >
          {code}
        </SyntaxHighlighter>
      </div>
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
