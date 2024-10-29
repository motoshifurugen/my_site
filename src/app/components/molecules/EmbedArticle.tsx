'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

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

  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/my_site/api'
    const fetchOgData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/blog/og-fetch?url=${encodeURIComponent(url)}`,
          {
            cache: 'force-cache',
          },
        )
        const data = await response.json()
        setOgData(data)
      } catch (error) {
        console.error('Failed to fetch Open Graph data', error)
      }
    }

    fetchOgData()
  }, [url])

  if (!ogData) {
    return <div>Loading...</div>
  }

  const srcUrl = ogData.ogUrl || ogData.requestUrl
  const faviconUrl = ogData.favicon
    ? new URL(ogData.favicon, srcUrl).toString()
    : null
  const ogImageUrl = Array.isArray(ogData.ogImage)
    ? ogData.ogImage[0].url
    : ogData.ogImage?.url

  return (
    <>
      <div className={`${styles.embedArticle_container}`}>
        <a
          href={srcUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.embedArticleCard_link}`}
        >
          <div className={`${styles.embedArticle_main}`}>
            <div className={`${styles.embedArticle_title}`}>
              {ogData.ogTitle}
            </div>
            <div className={`${styles.embedArticle_description}`}>
              {ogData.ogDescription}
            </div>
            <div className={`${styles.embedArticle_meta}`}>
              {faviconUrl && (
                <Image
                  src={faviconUrl || ''}
                  alt={ogData.ogTitle || 'Image'}
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
                alt={ogData.ogTitle || 'Image'}
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
