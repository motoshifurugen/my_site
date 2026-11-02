export type Post = {
  slug: string
  title: string
  date: string
  tags: string[]
  content: string
}

export type PostMeta = {
  slug: string
  title: string
  date: string
  tags: string[]
}

export type PostSearchEntry = PostMeta & {
  excerpt: string
}

export type TagCount = {
  tag: string
  count: number
}
