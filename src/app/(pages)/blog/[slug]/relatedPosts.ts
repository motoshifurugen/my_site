import { parseDateMs } from '@/app/api/utils/getPostData'
import type { PostMeta } from '@/types/posts'

const RELATED_POSTS_LIMIT = 3

const countSharedTags = (tags: Set<string>, candidate: PostMeta): number =>
  new Set(candidate.tags.filter((tag) => tags.has(tag))).size

// 一致数も日付も同じなら入力の順を保つ（Array.prototype.sort は安定）。Issue #14
export function selectRelatedPosts(
  current: PostMeta,
  posts: PostMeta[],
): PostMeta[] {
  const currentTags = new Set(current.tags)

  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({ post, sharedTags: countSharedTags(currentTags, post) }))
    .filter(({ sharedTags }) => sharedTags > 0)
    .sort(
      (a, b) =>
        b.sharedTags - a.sharedTags ||
        parseDateMs(b.post.date) - parseDateMs(a.post.date),
    )
    .slice(0, RELATED_POSTS_LIMIT)
    .map(({ post }) => post)
}
