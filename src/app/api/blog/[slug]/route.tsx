import { getAllSlugs, getPostBySlug } from '@/app/api/utils/getPostData'
import { NextRequest, NextResponse } from 'next/server'

const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } },
) => {
  const { slug } = params
  const blogArticle = await getPostBySlug(slug)

  if (!blogArticle) {
    return new NextResponse(null, { status: 404 })
  }

  return new NextResponse(JSON.stringify(blogArticle), { status: 200 })
}

// generateStaticParams 関数の追加
export const generateStaticParams = async () => {
  const slugs = await getAllSlugs()
  return slugs.map((slug: string) => ({ slug }))
}

export { GET }
