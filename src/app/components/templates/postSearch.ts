import type { PostMeta, PostSearchEntry, TagCount } from '@/types/posts'

// インデックスを読み込む前と読み込みに失敗したときは excerpt の無い PostMeta で検索する
type SearchablePost = PostMeta & Partial<Pick<PostSearchEntry, 'excerpt'>>

export interface PostSearchCriteria {
  query: string
  tag: string | null
}

// NFKC で全角英数字・全角スペースを半角にそろえる
const normalize = (text: string): string => text.normalize('NFKC').toLowerCase()

const splitTerms = (query: string): string[] =>
  normalize(query)
    .split(/\s+/)
    .filter((term) => term !== '')

const searchTargetsOf = (post: SearchablePost): string[] =>
  [
    post.title,
    ...post.tags,
    ...(post.excerpt === undefined ? [] : [post.excerpt]),
  ].map(normalize)

const matchesAllTerms = (post: SearchablePost, terms: string[]): boolean => {
  const targets = searchTargetsOf(post)
  return terms.every((term) => targets.some((target) => target.includes(term)))
}

export function searchPosts<T extends SearchablePost>(
  posts: T[],
  { query, tag }: PostSearchCriteria,
): T[] {
  const terms = splitTerms(query)
  return posts.filter(
    (post) =>
      (tag === null || post.tags.includes(tag)) && matchesAllTerms(post, terms),
  )
}

// Array.prototype.sort は安定なので、同数のタグは Map に入った順（初出順）のまま残る
export function countTags(posts: PostMeta[]): TagCount[] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of Array.from(new Set(post.tags))) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(counts, ([tag, count]) => ({ tag, count })).sort(
    (a, b) => b.count - a.count,
  )
}
