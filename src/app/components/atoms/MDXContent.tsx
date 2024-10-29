import Highlight from '@/app/components/atoms/Highlight'
import CodeBlock from '@/app/components/molecules/CodeBlock'
import EmbedArticle from '@/app/components/molecules/EmbedArticle'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import React, { useEffect, useState } from 'react'

import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

const codeBlockComponents = {
  code: (
    props: JSX.IntrinsicAttributes & {
      className?: string
      children?: React.ReactNode
    },
  ) => {
    if (props.className) {
      return <CodeBlock {...props} />
    }
    return <code {...props} />
  },
  p: (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }) => (
    <div {...props} />
  ),
  a: (
    props: JSX.IntrinsicAttributes & {
      href?: string
      children?: React.ReactNode
    },
  ) => {
    const { href, children } = props
    if (href && href.startsWith('http')) {
      return <EmbedArticle url={href} />
    }
    return <a {...props}>{children}</a>
  },
}

interface MDXContentProps {
  content: string
}
const MDXContent: React.FC<MDXContentProps> = ({ content }) => {
  const [mdxSource, setMdxSource] = useState<any>(null)

  useEffect(() => {
    const getSource = async () => {
      const source = await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypePrism, rehypeKatex, rehypeSlug],
        },
      })
      setMdxSource(source)
    }
    getSource()
  }, [content])

  if (!mdxSource) return <div>Loading...</div>

  return (
    <MDXRemote
      {...mdxSource}
      components={{ ...codeBlockComponents, Highlight }}
    />
  )
}

export default MDXContent
