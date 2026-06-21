import {
  assertPublicUrl,
  UnsafeUrlError,
} from '@/app/api/utils/validatePublicUrl'
import { NextRequest, NextResponse } from 'next/server'
import ogs from 'open-graph-scraper'

export const dynamic = 'force-dynamic'

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // SSRF 対策: http/https のみ許可し、プライベート/メタデータ宛先を拒否
    try {
      await assertPublicUrl(url)
    } catch (e) {
      if (e instanceof UnsafeUrlError) {
        return NextResponse.json({ error: e.message }, { status: 400 })
      }
      throw e
    }

    const { result, error } = await ogs({ url, timeout: 5 })
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
