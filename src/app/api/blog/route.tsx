import { getAllPosts } from '@/app/api/utils/getPostData'
import { NextResponse } from 'next/server'

const GET = async () => {
  try {
    const getAllPostsData = await getAllPosts()
    return NextResponse.json(getAllPostsData)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.error()
  }
}

export { GET }
