export default function LegalPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">
        特定商取引法に基づく表記（わたしの台所図鑑）
      </h1>
      <section className="space-y-4 text-base leading-relaxed">
        <div className="space-y-4">
          <div>
            <h2 className="mb-2 mt-6 text-xl font-semibold">販売事業者名</h2>
            <p>Motoshi Furugen（個人）</p>
          </div>

          <div>
            <h2 className="mb-2 mt-6 text-xl font-semibold">お問い合わせ</h2>
            <p>
              メール：
              <a
                href="mailto:my-kitchen-support@furugen-island.com"
                className="ml-1 text-teal-500 hover:underline dark:text-night-teal"
              >
                my-kitchen-support@furugen-island.com
              </a>
            </p>
            <p className="mt-2">※お問い合わせはメールにてお願いいたします。</p>
          </div>

          <div>
            <h2 className="mb-2 mt-6 text-xl font-semibold">販売価格</h2>
            <p>
              アプリ内の購入画面（サブスクリプション画面）に表示される金額をご確認ください。
            </p>
          </div>

          <div>
            <h2 className="mb-2 mt-6 text-xl font-semibold">
              商品代金以外の必要料金
            </h2>
            <p>インターネット接続に必要な通信料はお客様のご負担となります。</p>
          </div>

          <div>
            <h2 className="mb-2 mt-6 text-xl font-semibold">お支払い方法</h2>
            <ul className="mb-4 list-disc space-y-1 pl-6">
              <li>Apple App Store 決済</li>
              <li>Google Play 決済</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 mt-6 text-xl font-semibold">お支払い時期</h2>
            <p>
              各ストアの決済時点で課金されます。以後、契約期間ごとに自動更新されます。
            </p>
          </div>

          <div>
            <h2 className="mb-2 mt-6 text-xl font-semibold">
              提供時期（役務の提供時期）
            </h2>
            <p>購入手続き完了後、直ちに利用可能になります。</p>
          </div>

          <div>
            <h2 className="mb-2 mt-6 text-xl font-semibold">
              解約（定期購入の停止）について
            </h2>
            <p>
              定期購入の解約は、各ストアのサブスクリプション管理画面から行えます。
            </p>
            <p className="mt-2">アプリ内から解約手続きはできません。</p>
            <p className="mt-2">
              解約後も、契約期間の終了まではプレミアム機能をご利用いただけます。
            </p>
          </div>

          <div>
            <h2 className="mb-2 mt-6 text-xl font-semibold">
              返金・キャンセルについて
            </h2>
            <p>デジタルコンテンツの性質上、原則として返金はできません。</p>
            <p className="mt-2">
              返金の可否・手続きは各ストアの規定に従います。
            </p>
          </div>

          <div>
            <h2 className="mb-2 mt-6 text-xl font-semibold">動作環境</h2>
            <p>
              iOS / Android
              の対応バージョンは、各ストアのアプリページをご確認ください。
            </p>
          </div>

          <div>
            <h2 className="mb-2 mt-6 text-xl font-semibold">事業者所在地</h2>
            <p>請求があった場合に遅滞なく開示いたします。</p>
          </div>
        </div>
      </section>
    </main>
  )
}
