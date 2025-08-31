import { NextRequest, NextResponse } from 'next/server'
import ogs from 'open-graph-scraper'

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    const { result, error } = await ogs({ url })
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch Open Graph data' },
        { status: 500 },
      )
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching Open Graph data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Open Graph data' },
      { status: 500 },
    )
  }
}
