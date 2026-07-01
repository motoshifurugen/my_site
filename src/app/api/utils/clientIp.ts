import type { NextRequest } from 'next/server'

// クライアント IP を解決する。レート制限のキーとして likes/highscore/tanka-likes から共用する。
// x-forwarded-for 先頭（クライアント）→ x-real-ip → ローカルホストの順で解決する。
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  return '127.0.0.1'
}
