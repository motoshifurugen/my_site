import { createClient } from '@supabase/supabase-js'

// Issue #158: (IP, endpoint) 単位の書込みレート制限。
// Supabase の plpgsql 関数 check_api_rate_limit を RPC 経由で呼び、
// ウィンドウ内の書込み回数が上限未満かを判定する（scripts/migrations/007_api_rate_limits.sql）。

// RPC 関数名。契約文字列は 1 箇所で定義する。
const RATE_LIMIT_RPC = 'check_api_rate_limit'

export interface RateLimitRule {
  max: number
  windowSeconds: number
}

// endpoint ごとの閾値を 1 箇所へ集約する。
export const RATE_LIMITS = {
  likes: { max: 30, windowSeconds: 60 },
  highscore: { max: 10, windowSeconds: 60 },
} satisfies Record<string, RateLimitRule>

export type RateLimitEndpoint = keyof typeof RATE_LIMITS

// ウィンドウ内で上限未満なら true（許可）、上限到達なら false（拒否）。
// Supabase 未設定 / RPC エラー / 例外時はコア機能を落とさないためフェイルオープン（true）。
// ただしエラーは握りつぶさず console.warn で可視化する。
export async function checkRateLimit(
  ip: string,
  endpoint: RateLimitEndpoint,
): Promise<boolean> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.warn(
      'レート制限をスキップします: Supabase の環境変数が未設定です（フェイルオープン）',
    )
    return true
  }

  const rule = RATE_LIMITS[endpoint]

  try {
    const supabase = createClient(url, key)
    const { data, error } = await supabase.rpc(RATE_LIMIT_RPC, {
      ip_param: ip,
      endpoint_param: endpoint,
      max_requests: rule.max,
      window_seconds: rule.windowSeconds,
    })

    if (error) {
      console.warn(
        'レート制限チェックに失敗しました（フェイルオープン）:',
        error,
      )
      return true
    }

    return data === true
  } catch (error) {
    console.warn(
      'レート制限チェックで例外が発生しました（フェイルオープン）:',
      error,
    )
    return true
  }
}
