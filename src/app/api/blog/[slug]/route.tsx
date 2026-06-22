import {
  getAllSlugs,
  getPostBySlug,
  isValidSlug,
} from '@/app/api/utils/getPostData'
import { NextRequest, NextResponse } from 'next/server'

const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } },
) => {
  const { slug } = params

  // パストラバーサル対策: 不正な slug は 404
  if (!isValidSlug(slug)) {
    return new NextResponse(null, { status: 404 })
  }

  try {
    const blogArticle = await getPostBySlug(slug)

    if (!blogArticle) {
      return new NextResponse(null, { status: 404 })
    }

    return new NextResponse(JSON.stringify(blogArticle), { status: 200 })
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}

// generateStaticParams 関数の追加
export const generateStaticParams = async () => {
  const slugs = await getAllSlugs()
  return slugs.map((slug: string) => ({ slug }))
}

export { GET }
