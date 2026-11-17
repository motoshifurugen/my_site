'use client'

import OpenGraphFetcher from '@/app/components/atoms/OpenGraphFetcher'
import type { OpenGraphData } from '@/types/openGraph'
import Image from 'next/image'
import React, { useState } from 'react'

import styles from './EmbedArticle.module.css'
import {
  embedFaviconUrl,
  embedLinkUrl,
  embedOgImageUrl,
} from './embedArticleUrls'

interface EmbedArticleProps {
  url: string
}

const EmbedArticle: React.FC<EmbedArticleProps> = ({ url }) => {
  const [ogData, setOgData] = useState<OpenGraphData | null>(null)

  const srcUrl = embedLinkUrl(ogData?.ogUrl, ogData?.requestUrl)
  const faviconUrl = embedFaviconUrl(ogData?.favicon, srcUrl)
  const ogImageUrl = embedOgImageUrl(ogData?.ogImage)

  return (
    <>
      <OpenGraphFetcher url={url} onFetch={setOgData} />
      <div className={`${styles.embedArticle_container}`}>
        <a
          href={srcUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.embedArticleCard_link}`}
        >
          <div className={`${styles.embedArticle_main}`}>
            <div className={`${styles.embedArticle_title}`}>
              {ogData?.ogTitle}
            </div>
            <div className={`${styles.embedArticle_description}`}>
              {ogData?.ogDescription}
            </div>
            <div className={`${styles.embedArticle_meta}`}>
              {faviconUrl && (
                <Image
                  src={faviconUrl}
                  alt={ogData?.ogTitle || 'Image'}
                  width={14}
                  height={14}
                  className={`${styles.embedArticle_favicon}`}
                />
              )}
              {srcUrl}
            </div>
          </div>
          <div className={`${styles.embedArticle_img}`}>
            {ogImageUrl && (
              <Image
                src={ogImageUrl}
                alt={ogData?.ogTitle || 'Image'}
                width={230}
                height={120}
                className={`${styles.embedArticle_img}`}
              />
            )}
          </div>
        </a>
      </div>
    </>
  )
}

export default EmbedArticle
