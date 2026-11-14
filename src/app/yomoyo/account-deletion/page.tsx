'use client'

import Link from 'next/link'
import { useI18n } from '../../../i18n'
import LangToggle from '../LangToggle'

// Google Play が求める「アカウント削除の Web ページ」。
// 宛先は privacy・terms と同じ運営者の問い合わせ先にそろえる。
const CONTACT_EMAIL = 'furugenmotoshig@gmail.com'
const PRIVACY_PATH = '/yomoyo/privacy'
const LINK_CLASS = 'text-teal-500 hover:underline dark:text-night-teal'

export default function AccountDeletionPage() {
  const { locale } = useI18n()
  const isEn = locale === 'en'

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <LangToggle />
      <h1 className="mb-6 text-3xl font-bold">
        {isEn ? 'Yomoyo | Account Deletion' : 'Yomoyo | アカウント削除について'}
      </h1>

      {isEn ? (
        <section className="space-y-4 text-base leading-relaxed">
          <p>App name: Yomoyo / Operator: Furugen Island</p>
          <p>
            You can delete your Yomoyo account and its related data in either of
            the following ways.
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            1. Delete in the App (recommended)
          </h2>
          <ol className="mb-4 list-decimal space-y-1 pl-6">
            <li>Open the Yomoyo app and sign in.</li>
            <li>
              Tap the settings button at the top right of the screen to open
              Settings.
            </li>
            <li>Tap &quot;Delete account&quot;.</li>
            <li>Review the confirmation screen and tap &quot;Delete&quot;.</li>
          </ol>
          <p>The deletion takes effect immediately and cannot be undone.</p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            2. Request Deletion by Email
          </h2>
          <p>
            If you cannot delete your account in the app, for example because
            the app does not start or you have already uninstalled it, please
            send a deletion request to the address below.
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6">
            <li>
              To:
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={`ml-1 ${LINK_CLASS}`}
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>Subject: &quot;Yomoyo account deletion request&quot;</li>
            <li>
              Body: the email address of the Google or Apple account you used to
              sign in
            </li>
          </ul>
          <p>
            After verifying your identity, we will delete your account within a
            reasonable period (in principle, within 30 days).
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            3. Data That Is Deleted and Data That Remains
          </h2>
          <ul className="mb-4 list-disc space-y-1 pl-6">
            <li>
              Deleted: your account (authentication information), profile
              (display name and avatar), follow relationships, bookmarks, and
              push notification tokens and notification settings
            </li>
            <li>
              Kept anonymously: records of books you finished may remain in a
              form that does not identify you (shown as &quot;Deleted
              user&quot;).
            </li>
          </ul>
          <p>
            Information that the law requires us to keep may be retained only
            for the required period. For details, please see the
            <Link href={PRIVACY_PATH} className={`ml-1 ${LINK_CLASS}`}>
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      ) : (
        <section className="space-y-4 text-base leading-relaxed">
          <p>アプリ名: Yomoyo ／ 運営者: Furugen Island</p>
          <p>
            Yomoyo
            のアカウントと関連データは、以下のいずれかの方法で削除できます。
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            1. アプリ内で削除する（推奨）
          </h2>
          <ol className="mb-4 list-decimal space-y-1 pl-6">
            <li>Yomoyo アプリを開き、サインインします。</li>
            <li>画面右上の設定ボタンをタップして設定を開きます。</li>
            <li>「アカウントを削除」をタップします。</li>
            <li>確認画面の内容を確認し、「削除する」をタップします。</li>
          </ol>
          <p>削除はその場で実行され、元に戻すことはできません。</p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            2. メールで削除を依頼する
          </h2>
          <p>
            アプリが起動しない、すでにアンインストールしたなどの理由でアプリ内から削除できない場合は、以下の宛先にメールで削除をご依頼ください。
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6">
            <li>
              宛先:
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={`ml-1 ${LINK_CLASS}`}
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>件名: 「Yomoyo アカウント削除依頼」</li>
            <li>
              本文: サインインに使った Google または Apple
              アカウントのメールアドレス
            </li>
          </ul>
          <p>ご本人であることを確かめたうえで、原則 30 日以内に削除します。</p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            3. 削除されるデータ・残るデータ
          </h2>
          <ul className="mb-4 list-disc space-y-1 pl-6">
            <li>
              削除されるもの:
              アカウント（認証情報）、プロフィール（表示名・アバター）、フォロー関係、ブックマーク、プッシュ通知のトークンと通知設定
            </li>
            <li>
              匿名で残るもの:
              読み終えた本の記録は、個人を特定できない形（「退会したユーザー」と表示）で残る場合があります。
            </li>
          </ul>
          <p>
            法令で保存が義務付けられている情報は、その期間に限り保管することがあります。詳しくは
            <Link href={PRIVACY_PATH} className={LINK_CLASS}>
              プライバシーポリシー
            </Link>
            をご確認ください。
          </p>
        </section>
      )}
    </main>
  )
}
