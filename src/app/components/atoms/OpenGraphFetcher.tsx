import ogs from 'open-graph-scraper'
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
      try {
        const { result, error } = await ogs({ url })
        if (error) {
          console.error('Failed to fetch Open Graph data', error)
          onFetch(null)
        } else {
          onFetch(result as OpenGraphData)
        }
      } catch (error) {
        console.error('Error fetching Open Graph data:', error)
        onFetch(null)
      }
    }

    fetchOgData()
  }, [url, onFetch])

  return null
}

export default OpenGraphFetcher
