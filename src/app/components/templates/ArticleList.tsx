import BlogGrid from '@/app/components/organism/BlogGrid'

const getBlogData = async () => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/my_site/api'
  console.log('API URL:', apiUrl) // 環境変数をコンソールに出力
  try {
    const res = await fetch(`${apiUrl}/blog/`, {
      cache: 'force-cache',
    })
    const blogData = await res.json()
    return blogData
  } catch (error) {
    console.error('Error fetching blog data:', error)
    throw new Error('Failed to fetch blog data')
  }
}

const ArticleList = async () => {
  const blogData = await getBlogData()
  return (
    <div className="flex justify-center">
      <div className="mt-20 flex min-h-screen justify-between px-9">
        <BlogGrid blogData={blogData} label={'最新記事'} />
      </div>
    </div>
  )
}

export default ArticleList
