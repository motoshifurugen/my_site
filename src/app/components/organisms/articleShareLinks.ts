interface ShareTarget {
  title: string
  url: string
}

interface ShareLinks {
  x: string
  hatena: string
}

export const buildShareLinks = ({ title, url }: ShareTarget): ShareLinks => {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)
  return {
    x: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    hatena: `https://b.hatena.ne.jp/add?mode=confirm&url=${encodedUrl}&title=${encodedTitle}`,
  }
}
