'use client'

import OpenGraphFetcher from '@/app/components/atoms/OpenGraphFetcher'
import Image from 'next/image'
import React, { useState } from 'react'

import styles from './EmbedArticle.module.css'

interface EmbedArticleProps {
  url: string
}

interface OpenGraphData {
  ogTitle?: string
  ogDescription?: string
  ogImage?: { url: string }
  ogUrl?: string
  requestUrl?: string
  favicon?: string
}

const EmbedArticle: React.FC<EmbedArticleProps> = ({ url }) => {
  const [ogData, setOgData] = useState<OpenGraphData | null>(null)

  const srcUrl = ogData?.ogUrl || ogData?.requestUrl
  const faviconUrl =
    ogData?.favicon && srcUrl
      ? (() => {
          try {
            return new URL(ogData.favicon, srcUrl).toString()
          } catch (error) {
            // Base URLが無効な場合、faviconが絶対URLかチェック
            try {
              return new URL(ogData.favicon).toString()
            } catch {
              // 両方とも失敗した場合はnullを返す
              return null
            }
          }
        })()
      : null
  const ogImageUrl = Array.isArray(ogData?.ogImage)
    ? ogData?.ogImage[0].url
    : ogData?.ogImage?.url

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
                  src={faviconUrl || ''}
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
