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
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // タグデータを取得
    let query = supabase
      .from('tags')
      .select(`
        *,
        tag_dictionary (
          keyword,
          match_type,
          priority
        )
      `)
      .order('name', { ascending: true })

    // カテゴリフィルタ
    if (category) {
      query = query.eq('category', category)
    }

    // 検索フィルタ
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: tagsData, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch tags data' 
      }, { status: 500 })
    }

    // レスポンスデータの整形
    const formattedData = tagsData?.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      category: tag.category,
      description: tag.description,
      createdAt: tag.created_at,
      keywords: tag.tag_dictionary?.map((dict: any) => ({
        keyword: dict.keyword,
        matchType: dict.match_type,
        priority: dict.priority
      })) || []
    })) || []

    return NextResponse.json({
      tags: formattedData
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 })
  }
}

