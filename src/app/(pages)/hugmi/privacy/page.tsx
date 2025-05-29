export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Hugmi | プライバシーポリシー</h1>
      <section className="space-y-4 text-base leading-relaxed">
        <p>
          Hugmi（以下、「本アプリ」といいます）は、ユーザーのプライバシーを尊重し、個人情報の取り扱いに細心の注意を払っています。本プライバシーポリシーでは、本アプリにおける情報の取得、利用、および保護について説明します。
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. 取得する情報</h2>
        <p>
          本アプリは、以下の情報をユーザーの端末内に保存することがあります：
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>ユーザーが登録したルーティンや設定情報</li>
          <li>名言のコレクションおよびお気に入り情報</li>
          <li>通知の時間設定</li>
        </ul>
        <p>
          ※本アプリでは、これらの情報を外部のサーバーに送信することはありません。
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. 情報の利用目的</h2>
        <p>取得した情報は、以下の目的で利用されます：</p>
        <ul className="list-disc pl-6 mb-4">
          <li>ユーザーが登録したルーティン情報の表示・管理</li>
          <li>通知機能の実行（朝／夜のリマインダー）</li>
          <li>アプリ体験の向上（名言の記録、表示順の管理など）</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. 第三者への提供</h2>
        <p>
          本アプリは、取得した情報を外部に送信したり、第三者に提供・共有することはありません。
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. 通知機能について</h2>
        <p>
          本アプリでは、ユーザーの端末に通知を送信するため、通知の権限が必要となる場合があります。通知の受信設定は、端末の「設定」よりいつでも変更できます。
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">5. 広告表示について</h2>
        <p>
          本アプリでは、一部画面において第三者提供のネイティブ広告（アプリ内に自然に表示される形式の広告）を掲載する場合があります。広告の表示に際して、ユーザーの個人情報を収集・送信することはありませんが、広告の最適化や表示回数の管理のために、広告配信事業者によって端末識別子などの情報が利用されることがあります。広告に関連するプライバシー情報の取り扱いについては、各広告配信事業者のプライバシーポリシーをご確認ください。
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">6. 改訂について</h2>
        <p>
          本ポリシーの内容は、ユーザーへの通知なく変更される場合があります。重要な変更がある場合は、アプリ内でお知らせします。
        </p>
        <p className="text-sm text-gray-500 mt-8">制定日: 2024年6月</p>
      </section>
    </main>
  )
}
