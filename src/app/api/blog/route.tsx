// import { getAllPosts } from '@/app/api/utils/getPostData'
// import { NextResponse } from 'next/server'

// const GET = async () => {
//   try {
//     const getAllPostsData = await getAllPosts()
//     return NextResponse.json(getAllPostsData)
//   } catch (error) {
//     console.error('Error fetching posts:', error)
//     return NextResponse.error()
//   }
// }

// export { GET }

import { NextRequest, NextResponse } from 'next/server'

const GET = async (
  req: NextRequest,
  context: { params?: { slug?: string } } = {},
) => {
  const { params } = context
  const slug = params?.slug || 'default-slug'
  return new NextResponse(`This is a placeholder response for slug: ${slug}`, {
    status: 200,
  })
}

export { GET }
