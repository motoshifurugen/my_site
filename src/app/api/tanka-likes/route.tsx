import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// クライアントIPアドレスを取得する関数
function getClientIP(request: NextRequest): string {
  // Vercelの場合
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  // その他のプロキシ
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  // フォールバック
  return '127.0.0.1'
}

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

    const url = new URL(request.url)
    const tweetId = url.searchParams.get('tweetId')
    const userIP = getClientIP(request)

    if (!tweetId) {
      return NextResponse.json({ error: 'tweetIdが必要です' }, { status: 400 })
    }

    // いいね数を取得
    const { count: likeCount, error: likeCountError } = await supabase
      .from('tanka_likes')
      .select('*', { count: 'exact', head: true })
      .eq('tweet_id', tweetId)

    if (likeCountError) {
      console.error('いいね数取得エラー:', likeCountError)
      return NextResponse.json(
        { error: 'いいね数の取得に失敗しました' },
        { status: 500 }
      )
    }

    // ユーザーのいいね状態を確認
    const { data: userLikeData, error: userLikeError } = await supabase
      .from('tanka_likes')
      .select('id')
      .eq('tweet_id', tweetId)
      .eq('user_ip', userIP)
      .maybeSingle()

    const isLiked = !userLikeError && userLikeData !== null

    return NextResponse.json({
      tweetId: parseInt(tweetId),
      likeCount: likeCount || 0,
      isLiked
    })
  } catch (error) {
    console.error('いいね取得エラー:', error)
    return NextResponse.json(
      { error: 'いいね情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const { tweetId, liked } = await request.json()
    const userIP = getClientIP(request)

    if (!tweetId) {
      return NextResponse.json({ error: 'tweetIdが必要です' }, { status: 400 })
    }

    if (typeof liked !== 'boolean') {
      return NextResponse.json({ error: 'likedパラメータが必要です' }, { status: 400 })
    }

    // 短歌が存在するか確認
    const { data: tankaData, error: tankaError } = await supabase
      .from('tanka')
      .select('tweet_id')
      .eq('tweet_id', tweetId)
      .single()

    if (tankaError || !tankaData) {
      return NextResponse.json(
        { error: '指定された短歌が見つかりません' },
        { status: 404 }
      )
    }

    if (liked) {
      // いいねを追加
      const { data: insertData, error: insertError } = await supabase
        .from('tanka_likes')
        .insert({
          tweet_id: tweetId,
          user_ip: userIP
        })
        .select()

      if (insertError) {
        // 重複エラーの場合は無視
        if (insertError.code !== '23505') {
          console.error('いいね追加エラー:', insertError)
          return NextResponse.json(
            { error: 'いいねの追加に失敗しました' },
            { status: 500 }
          )
        }
      }
    } else {
      // いいねを削除
      const { error: deleteError } = await supabase
        .from('tanka_likes')
        .delete()
        .eq('tweet_id', tweetId)
        .eq('user_ip', userIP)

      if (deleteError) {
        console.error('いいね削除エラー:', deleteError)
        return NextResponse.json(
          { error: 'いいねの削除に失敗しました' },
          { status: 500 }
        )
      }
    }

    // 更新後のいいね数を取得
    const { count: updatedLikeCount, error: likeCountError } = await supabase
      .from('tanka_likes')
      .select('*', { count: 'exact', head: true })
      .eq('tweet_id', tweetId)

    if (likeCountError) {
      console.error('いいね数取得エラー:', likeCountError)
      return NextResponse.json(
        { error: 'いいね数の取得に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      tweetId: parseInt(tweetId),
      likeCount: updatedLikeCount || 0,
      isLiked: liked
    })
  } catch (error) {
    console.error('いいね更新エラー:', error)
    return NextResponse.json(
      { error: 'いいねの更新に失敗しました' },
      { status: 500 }
    )
  }
}
