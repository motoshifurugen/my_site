import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // 環境変数チェック
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'Supabase configuration is missing' 
      }, { status: 500 })
    }

    // Supabaseクライアント初期化
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // クエリパラメータ取得
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // 短歌データを取得（作成日時の降順、タグ情報も含む）
    const { data: tankaData, error, count } = await supabase
      .from('tanka')
      .select(`
        *,
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
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch tanka data' 
      }, { status: 500 })
    }

    // レスポンスデータの整形
    const formattedData = tankaData?.map(tanka => ({
      id: String(tanka.tweet_id),
      tanka: tanka.tanka,
      originalText: tanka.original_text,
      createdAt: tanka.created_at,
      extractedAt: tanka.extracted_at,
      tags: tanka.tanka_tags?.map((tagRelation: any) => ({
        id: tagRelation.tags.id,
        name: tagRelation.tags.name,
        slug: tagRelation.tags.slug,
        category: tagRelation.tags.category,
        description: tagRelation.tags.description,
        score: tagRelation.score,
        assignedBy: tagRelation.assigned_by,
        assignedAt: tagRelation.assigned_at
      })) || []
    })) || []

    return NextResponse.json({
      tanka: formattedData,
      pagination: {
        currentPage: page,
        totalItems: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: page < Math.ceil((count || 0) / limit),
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 })
  }
}