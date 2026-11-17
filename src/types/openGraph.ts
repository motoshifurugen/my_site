type OgImageItem = {
  url: string
}

// open-graph-scraper は ogImage を配列で返すが、単体のオブジェクトで来る場合も扱う
export type OgImage = OgImageItem | OgImageItem[]

// /api/og-fetch の応答（open-graph-scraper の result）のうち、埋め込みリンクが読む項目
export type OpenGraphData = {
  ogTitle?: string
  ogDescription?: string
  ogImage?: OgImage
  ogUrl?: string
  requestUrl?: string
  favicon?: string
}
