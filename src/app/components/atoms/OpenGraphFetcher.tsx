import React, { useEffect } from 'react'

interface OpenGraphData {
  ogTitle?: string
  ogDescription?: string
  ogImage?: { url: string }
  ogUrl?: string
  requestUrl?: string
  favicon?: string
}

interface OpenGraphFetcherProps {
  url: string
  onFetch: (data: OpenGraphData | null) => void
}

const OpenGraphFetcher: React.FC<OpenGraphFetcherProps> = ({
  url,
  onFetch,
}) => {
  useEffect(() => {
    const fetchOgData = async () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/my_site/api'
      try {
        const response = await fetch(
          `${apiUrl}/og-fetch?url=${encodeURIComponent(url)}`,
        )
        const data = await response.json()
        onFetch(data)
      } catch (error) {
        console.error('Failed to fetch Open Graph data', error)
        onFetch(null)
      }
    }

    fetchOgData()
  }, [url, onFetch])

  return null
}

export default OpenGraphFetcher
