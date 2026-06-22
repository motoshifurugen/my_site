import type { TankaData, TankaResponse } from '@/types/tanka'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Supabase から返る行の形（snake_case・ネストした tanka_tags）。インフラの実装詳細のため
// ここに閉じ込め、ドメイン型（TankaData 等）とは分離する。
type SupabaseTagRelation = {
  score: number
  assigned_by: string
  assigned_at: string
  tags: {
    id: number
    name: string
    slug: string
    category: string
    description?: string
  }
}

type SupabaseTankaRow = {
  tweet_id: string
  author_id: string
  created_at: string
  extracted_at: string
  original_text: string
  tanka: string
  tanka_tags: SupabaseTagRelation[] | null
}

export async function GET(request: NextRequest) {
  try {
    // 環境変数チェック
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error: 'Supabase configuration is missing',
        },
        { status: 500 },
      )
    }

    // Supabaseクライアント初期化
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    )

    // クエリパラメータ取得
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // 短歌データを取得（作成日時の降順、タグ情報も含む）
    // tweet_idを文字列として取得するため、::textを使用
    const {
      data: tankaData,
      error,
      count,
    } = await supabase
      .from('tanka')
      .select(
        `
        tweet_id::text,
        author_id,
        created_at,
        extracted_at,
        original_text,
        tanka,
        tanka_tags (
          score,
          assigned_by,
          assigned_at,
          tags (
            id,
            name,
            slug,
            category,
            description
          )
        )
      `,
        { count: 'exact' },
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        {
          error: 'Failed to fetch tanka data',
        },
        { status: 500 },
      )
    }

    // レスポンスデータの整形（snake_case の行 → camelCase のドメイン形）
    // supabase-js は to-one リレーション（tanka_tags.tags）も配列として型推論するが、
    // この select の実体は単一オブジェクト。実データ形に合わせ、境界で一度だけ行型へ補正する。
    const rows = (tankaData ?? []) as unknown as SupabaseTankaRow[]
    const formattedData: TankaData[] = rows.map((tanka) => ({
      id: tanka.tweet_id, // 既に文字列として取得済み
      tanka: tanka.tanka,
      originalText: tanka.original_text,
      createdAt: tanka.created_at,
      extractedAt: tanka.extracted_at,
      tweetId: tanka.tweet_id, // 既に文字列として取得済み
      tags:
        tanka.tanka_tags?.map((tagRelation) => ({
          id: tagRelation.tags.id,
          name: tagRelation.tags.name,
          slug: tagRelation.tags.slug,
          category: tagRelation.tags.category,
          description: tagRelation.tags.description,
          score: tagRelation.score,
          assignedBy: tagRelation.assigned_by,
          assignedAt: tagRelation.assigned_at,
        })) || [],
    }))

    const totalPages = Math.ceil((count || 0) / limit)
    const body: TankaResponse = {
      tanka: formattedData,
      pagination: {
        currentPage: page,
        totalItems: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }

    return NextResponse.json(body)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 },
    )
  }
}
