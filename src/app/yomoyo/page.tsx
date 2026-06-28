import type { Metadata } from 'next'
import Link from 'next/link'
import nextConfig from '../../../next.config.mjs'

const BASE_PATH = nextConfig.basePath || ''

const CONTACT_EMAIL = 'furugenmotoshig@gmail.com'
const OPERATOR_NAME = 'Furugen Island'
const TERMS_PATH = '/yomoyo/terms'
const PRIVACY_PATH = '/yomoyo/privacy'

const FEATURES = [
  '「読み終えた」本を登録して、自分だけの読書記録を残せます',
  'フォロー中の利用者へ「読み終えた」を通知し、読書を共有できます',
  'Google Books API による書籍検索と、バーコード（ISBN）スキャンで簡単登録',
  'Google / Apple サインインに対応。フォロー・ブックマーク・プッシュ通知も利用できます',
  'iOS / Android に対応。無料で利用できます（広告あり）',
]

const SCREENSHOTS = [
  {
    src: '/images/yomoyo/screenshot-01.png',
    alt: '読み終えた本を登録するYomoyoの画面',
  },
  {
    src: '/images/yomoyo/screenshot-02.png',
    alt: 'フォロー中の利用者の読書記録を見るYomoyoの画面',
  },
  {
    src: '/images/yomoyo/screenshot-03.png',
    alt: 'バーコードで書籍を検索するYomoyoの画面',
  },
]

const LINK_CLASS = 'text-teal-500 hover:underline dark:text-night-teal'

export const metadata: Metadata = {
  title: 'Yomoyo | 読書記録・共有アプリ',
  description:
    '読み終えた本を記録し、フォロー中の仲間と読書を共有できるモバイルアプリ「Yomoyo」の紹介・サポートページです。',
}

export default function YomoyoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Yomoyo</h1>
        <p className="text-base leading-relaxed">
          Yomoyo
          は、読み終えた本を記録し、フォロー中の仲間と読書を共有できる読書記録・共有アプリです。
        </p>
        <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed">
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold">スクリーンショット</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {SCREENSHOTS.map((screenshot) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={screenshot.src}
              src={`${BASE_PATH}${screenshot.src}`}
              alt={screenshot.alt}
              className="w-full rounded-lg border border-teal-100 dark:border-night-gray"
            />
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold">お問い合わせ</h2>
        <p className="text-base leading-relaxed">
          ご質問・ご要望は、以下までお気軽にご連絡ください。
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>運営者: {OPERATOR_NAME}</li>
          <li>
            メールアドレス:
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={`ml-1 ${LINK_CLASS}`}
            >
              {CONTACT_EMAIL}
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold">規約・ポリシー</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <Link href={TERMS_PATH} className={LINK_CLASS}>
              利用規約
            </Link>
          </li>
          <li>
            <Link href={PRIVACY_PATH} className={LINK_CLASS}>
              プライバシーポリシー
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
