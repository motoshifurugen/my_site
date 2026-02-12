export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>
      <section className="space-y-4 text-base leading-relaxed">
        <p>
          本プライバシーポリシーは、アプリ「わたしの台所図鑑」（以下「本アプリ」）における、ユーザー情報の取り扱いについて定めるものです。
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">1. 取得する情報</h2>
        <p>
          本アプリでは、以下の情報を取得する場合があります。
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>ユーザーが入力する情報：料理名、メモ、カテゴリ補助選択、その他ユーザーが本アプリ内で入力する内容</li>
          <li>画像/写真（任意）：ユーザーが記録に添付する写真（端末のカメラ/フォトライブラリ機能を利用する場合）</li>
          <li>通知に関する情報（任意）：通知許可の状態（通知自体はOSが管理します）</li>
          <li>課金に関する情報：サブスクリプションの購入状況、レシート/取引識別子等（Apple/Googleおよび課金基盤を通じて取得されます。クレジットカード番号等は本アプリが取得しません）</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. 利用目的</h2>
        <p>取得した情報は、以下の目的で利用します。</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>本アプリの提供、維持、改善のため</li>
          <li>料理記録・表示・図鑑登録など、本アプリの主要機能を実現するため</li>
          <li>サブスクリプション（プレミアム機能）の提供、購入状況の確認、復元対応のため</li>
          <li>不具合対応・お問い合わせ対応のため</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. 外部サービスの利用</h2>
        <p>
          本アプリでは、サブスクリプション管理のために RevenueCat を利用します。RevenueCat および Apple / Google は、購入状況の確認等のために必要な情報を取り扱います。RevenueCat の取り扱いについては同社のプライバシーポリシーもあわせてご確認ください。
        </p>
        <p className="mt-2">
          RevenueCat プライバシーポリシー：
          <a
            href="https://www.revenuecat.com/privacy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-500 dark:text-night-teal hover:underline ml-1"
          >
            https://www.revenuecat.com/privacy/
          </a>
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. 第三者提供</h2>
        <p>
          当方は、法令に基づく場合を除き、ユーザー情報を第三者に提供しません。
        </p>
        <p className="mt-2">
          ただし、前項の外部サービス（RevenueCat、Apple/Google）に対しては、課金機能の提供に必要な範囲で情報が共有されます。
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. 保存期間</h2>
        <p>
          ユーザーが本アプリに入力した記録は、原則としてユーザーの端末内（またはユーザーが利用するバックアップ等）に保存されます。
        </p>
        <p className="mt-2">
          課金に関する情報は、Apple/GoogleおよびRevenueCat側でも必要な期間保存される場合があります。
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. ユーザーの権利（削除等）</h2>
        <p>
          本アプリ内の記録は、ユーザー操作により削除できます。
        </p>
        <p className="mt-2">
          課金の解約は、各ストア（App Store / Google Play）側の手続きに従ってください。
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. セキュリティ</h2>
        <p>
          当方は、ユーザー情報の漏えい・滅失・毀損の防止など、適切な安全管理措置に努めます。
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. プライバシーポリシーの変更</h2>
        <p>
          本ポリシーの内容は、必要に応じて改定されることがあります。重要な変更がある場合は、適切な方法で告知します。
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">9. お問い合わせ</h2>
        <p>
          本ポリシーに関するお問い合わせは、以下までご連絡ください。
        </p>
        <p className="mt-2">
          連絡先：furugenmotoshig@gmail.com
        </p>
      </section>
    </main>
  )
}

