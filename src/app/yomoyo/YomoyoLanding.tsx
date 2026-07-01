'use client'

import Link from 'next/link'
import nextConfig from '../../../next.config.mjs'
import { useI18n } from '../../i18n'
import LangToggle from './LangToggle'

const BASE_PATH = nextConfig.basePath || ''

const CONTACT_EMAIL = 'furugenmotoshig@gmail.com'
const OPERATOR_NAME = 'Furugen Island'
const TERMS_PATH = '/yomoyo/terms'
const PRIVACY_PATH = '/yomoyo/privacy'
const LINK_CLASS = 'text-teal-500 hover:underline dark:text-night-teal'

const SCREENSHOT_SRCS = [
  '/images/yomoyo/screenshot-01.png',
  '/images/yomoyo/screenshot-02.png',
  '/images/yomoyo/screenshot-03.png',
]

const CONTENT = {
  ja: {
    intro:
      'Yomoyo は、読み終えた本を記録し、フォロー中の仲間と読書を共有できる読書記録・共有アプリです。',
    features: [
      '「読み終えた」本を登録して、自分だけの読書記録を残せます',
      'フォロー中の利用者へ「読み終えた」を通知し、読書を共有できます',
      'Google Books API による書籍検索と、バーコード（ISBN）スキャンで簡単登録',
      'Google / Apple サインインに対応。フォロー・ブックマーク・プッシュ通知も利用できます',
      'iOS / Android に対応。無料で利用できます（広告あり）',
    ],
    screenshotsHeading: 'スクリーンショット',
    screenshotAlts: [
      '読み終えた本を登録するYomoyoの画面',
      'フォロー中の利用者の読書記録を見るYomoyoの画面',
      'バーコードで書籍を検索するYomoyoの画面',
    ],
    contactHeading: 'お問い合わせ',
    contactLead: 'ご質問・ご要望は、以下までお気軽にご連絡ください。',
    operatorLabel: '運営者',
    emailLabel: 'メールアドレス',
    legalHeading: '規約・ポリシー',
    termsLabel: '利用規約',
    privacyLabel: 'プライバシーポリシー',
  },
  en: {
    intro:
      "Yomoyo is a reading log and sharing app that lets you record the books you've finished and share your reading with the people you follow.",
    features: [
      "Add books you've finished to build a reading log that's all your own",
      'Notify the people you follow when you finish a book and share your reading with them',
      'Effortless logging with book search powered by the Google Books API and barcode (ISBN) scanning',
      'Sign in with Google or Apple, and enjoy following, bookmarks, and push notifications',
      'Available on iOS and Android, free to use (contains ads)',
    ],
    screenshotsHeading: 'Screenshots',
    screenshotAlts: [
      "Yomoyo screen for adding a book you've finished",
      'Yomoyo screen showing the reading logs of people you follow',
      'Yomoyo screen for searching books by barcode',
    ],
    contactHeading: 'Contact',
    contactLead:
      'If you have any questions or requests, please feel free to reach out below.',
    operatorLabel: 'Operator',
    emailLabel: 'Email',
    legalHeading: 'Terms & Policies',
    termsLabel: 'Terms of Service',
    privacyLabel: 'Privacy Policy',
  },
}

export default function YomoyoLanding() {
  const { locale } = useI18n()
  const c = CONTENT[locale] ?? CONTENT.ja

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <LangToggle />
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Yomoyo</h1>
        <p className="text-base leading-relaxed">{c.intro}</p>
        <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed">
          {c.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold">{c.screenshotsHeading}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {SCREENSHOT_SRCS.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={`${BASE_PATH}${src}`}
              alt={c.screenshotAlts[index]}
              className="w-full rounded-lg border border-teal-100 dark:border-night-gray"
            />
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold">{c.contactHeading}</h2>
        <p className="text-base leading-relaxed">{c.contactLead}</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            {c.operatorLabel}: {OPERATOR_NAME}
          </li>
          <li>
            {c.emailLabel}:
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
        <h2 className="text-xl font-semibold">{c.legalHeading}</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <Link href={TERMS_PATH} className={LINK_CLASS}>
              {c.termsLabel}
            </Link>
          </li>
          <li>
            <Link href={PRIVACY_PATH} className={LINK_CLASS}>
              {c.privacyLabel}
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
