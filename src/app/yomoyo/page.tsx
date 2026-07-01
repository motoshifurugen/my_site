import type { Metadata } from 'next'
import YomoyoLanding from './YomoyoLanding'

export const metadata: Metadata = {
  title: 'Yomoyo | 読書記録・共有アプリ',
  description:
    '読み終えた本を記録し、フォロー中の仲間と読書を共有できるモバイルアプリ「Yomoyo」の紹介・サポートページです。',
}

// 言語切替え（JA/EN）は client 側で行うため、本体は client コンポーネントに委譲する。
// metadata は Server Component からのみ export できるため、この page は server のまま維持する。
export default function YomoyoPage() {
  return <YomoyoLanding />
}
