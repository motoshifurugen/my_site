// 短歌ドメインの共有型。producer は api/tanka/route（Supabase 行を整形して返す）、
// consumer は (pages)/tanka/page（描画・キャッシュ）と TankaCard（タグ描画）。
// レスポンス契約をここで一元化し、各所の any を排除する。

export type TankaTag = {
  id: number
  name: string
  slug: string
  category: string
  description?: string
  score: number
  assignedBy: string
  assignedAt: string
}

export type TankaData = {
  id: string
  tanka: string
  originalText: string
  createdAt: string
  extractedAt: string
  tags: TankaTag[]
  tweetId?: string
}

export type TankaPagination = {
  currentPage: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type TankaResponse = {
  tanka: TankaData[]
  pagination: TankaPagination
}
