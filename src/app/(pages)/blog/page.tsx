import { getAllPostsMeta } from '@/app/api/utils/getPostData'
import ArticleList from '@/app/components/templates/ArticleList'

export default async function Blog() {
  const posts = await getAllPostsMeta()

  return <ArticleList initialPosts={posts} />
}
