'use client'

import CopyLinkButton from '@/app/components/molecules/CopyLinkButton'
import { useI18n } from '@/i18n'
import React, { useId } from 'react'
import { FaXTwitter } from 'react-icons/fa6'
import { SiHatenabookmark } from 'react-icons/si'
import { buildShareLinks } from './articleShareLinks'

interface ArticleShareProps {
  title: string
  url: string
}

const SHARE_ITEM_CLASS =
  'flex items-center gap-2 rounded-lg border border-gray bg-white px-4 py-2 font-bold text-main-black transition-colors duration-300 hover:border-teal dark:border-night-black dark:bg-night-gray dark:text-night-white dark:hover:border-night-teal'

// 親の .articleContent ul に list-style が当たるため ul / li を使わない。
const ArticleShare: React.FC<ArticleShareProps> = ({ title, url }) => {
  const { t } = useI18n()
  const headingId = useId()
  const links = buildShareLinks({ title, url })

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId}>{t.blog.share.heading}</h2>
      <p>{t.blog.share.message}</p>
      <div className="flex flex-wrap gap-3">
        <a
          href={links.x}
          target="_blank"
          rel="noopener noreferrer"
          className={SHARE_ITEM_CLASS}
        >
          <FaXTwitter aria-hidden />
          <span>{t.blog.share.x}</span>
        </a>
        <a
          href={links.hatena}
          target="_blank"
          rel="noopener noreferrer"
          className={SHARE_ITEM_CLASS}
        >
          <SiHatenabookmark aria-hidden />
          <span>{t.blog.share.hatena}</span>
        </a>
        <CopyLinkButton url={url} className={SHARE_ITEM_CLASS} />
      </div>
    </section>
  )
}

export default ArticleShare
