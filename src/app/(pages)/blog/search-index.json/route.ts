import { NextResponse } from 'next/server'
import { buildPostSearchIndex } from '../searchIndex'

// output: export ではビルド時に out/blog/search-index.json として書き出す。
// Pages 向けビルドは src/app/api の route を消すため、この route は api の外に置く。
export const dynamic = 'force-static'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(await buildPostSearchIndex())
}
