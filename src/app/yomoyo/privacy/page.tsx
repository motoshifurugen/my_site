export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Yomoyo | プライバシーポリシー</h1>
      <section className="space-y-4 text-base leading-relaxed">
        <p>
          Furugen
          Island（以下「当方」といいます）は、当方が提供するモバイルアプリケーション「Yomoyo」（以下「本アプリ」といいます）における利用者の情報（以下「利用者情報」といいます）の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">1. 事業者情報</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="border-gray-300 dark:border-gray-700 border-b">
                <th className="w-1/3 py-2 pr-4 text-left align-top font-semibold">
                  運営者
                </th>
                <td className="py-2">Furugen Island</td>
              </tr>
              <tr className="border-gray-300 dark:border-gray-700 border-b">
                <th className="py-2 pr-4 text-left align-top font-semibold">
                  アプリ名
                </th>
                <td className="py-2">Yomoyo</td>
              </tr>
              <tr className="border-gray-300 dark:border-gray-700 border-b">
                <th className="py-2 pr-4 text-left align-top font-semibold">
                  問い合わせ先
                </th>
                <td className="py-2">furugenmotoshig@gmail.com</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="mb-2 mt-6 text-xl font-semibold">
          2. 取得する情報および取得方法
        </h2>
        <p>
          本アプリは、サービスの提供に必要な範囲で、以下の情報を取得します。
        </p>

        <h3 className="mb-2 mt-4 text-lg font-semibold">
          2.1 アカウント・認証に関する情報
        </h3>
        <p>
          本アプリは、Google サインインまたは Apple
          サインインによる認証を利用しています。認証にあたり、認証プロバイダから以下の情報を取得します。
        </p>
        <ul className="mb-4 list-disc space-y-1 pl-6">
          <li>ユーザー識別子（UID）</li>
          <li>メールアドレス</li>
          <li>氏名（プロバイダから提供される表示名）</li>
        </ul>
        <p>
          これらは認証およびアカウントの同一性確認のために利用します。氏名・メールアドレスは認証基盤（Firebase
          Authentication）に保持され、本アプリのデータベースには原則として保存されません。
        </p>

        <h3 className="mb-2 mt-4 text-lg font-semibold">
          2.2 プロフィールに関する情報
        </h3>
        <ul className="mb-4 list-disc space-y-1 pl-6">
          <li>表示名（利用者が設定するニックネーム）</li>
          <li>アバター（あらかじめ用意された動物アイコンの選択情報）</li>
          <li>プロフィール設定の完了日時</li>
        </ul>

        <h3 className="mb-2 mt-4 text-lg font-semibold">
          2.3 読書記録に関する情報
        </h3>
        <p>
          利用者が「読み終えた」本を登録した際に、以下の情報を取得・保存します。
        </p>
        <ul className="mb-4 list-disc space-y-1 pl-6">
          <li>書籍タイトル、著者名、書影画像のURL、書籍識別子（ISBN等）</li>
          <li>読み終えたステータスおよびその日時</li>
          <li>登録時点の表示名</li>
        </ul>
        <p>
          書籍情報は、書籍検索のために Google Books API
          を利用して取得します。バーコードスキャン機能で読み取ったバーコード（ISBN）の値そのものは保存しません。
        </p>

        <h3 className="mb-2 mt-4 text-lg font-semibold">
          2.4 フォロー・ブックマークに関する情報
        </h3>
        <ul className="mb-4 list-disc space-y-1 pl-6">
          <li>フォロー関係（誰が誰をフォローしているか、その作成日時）</li>
          <li>ブックマーク（保存した読書記録への参照、保存日時）</li>
        </ul>

        <h3 className="mb-2 mt-4 text-lg font-semibold">
          2.5 プッシュ通知に関する情報
        </h3>
        <p>プッシュ通知の配信のため、以下の情報を取得・保存します。</p>
        <ul className="mb-4 list-disc space-y-1 pl-6">
          <li>プッシュ通知トークン（デバイストークン）</li>
          <li>端末のプラットフォーム種別（iOS / Android 等）</li>
          <li>言語設定</li>
          <li>通知の有効・無効状態</li>
        </ul>

        <h3 className="mb-2 mt-4 text-lg font-semibold">
          2.6 広告に関する情報
        </h3>
        <p>
          本アプリは、Google AdMob
          を利用して広告を配信しています。広告配信および広告効果の測定のため、広告識別子（iOS
          の IDFA、Android の広告 ID）等が利用される場合があります。
        </p>
        <ul className="mb-4 list-disc space-y-1 pl-6">
          <li>
            iOS では、トラッキングを行う前に App Tracking
            Transparency（ATT）に基づく許諾を求めます。利用者が許諾しない場合、トラッキングを伴う広告識別子の利用は行われません。
          </li>
          <li>
            欧州経済領域等の対象地域では、Google User Messaging
            Platform（UMP）による同意取得を行い、その同意状況に応じて広告のパーソナライズの可否が決定されます。
          </li>
        </ul>
        <p>
          広告配信に関連する情報の取扱いの詳細は、後述の Google
          のポリシーをご確認ください。
        </p>

        <h3 className="mb-2 mt-4 text-lg font-semibold">2.7 カメラの利用</h3>
        <p>
          書籍のバーコード（ISBN）を読み取り、書籍登録を簡便にするためにカメラを利用します。読み取った映像・バーコードの値は保存しません。
        </p>

        <h3 className="mb-2 mt-4 text-lg font-semibold">2.8 取得しない情報</h3>
        <p>本アプリは、以下を取得・保存しません。</p>
        <ul className="mb-4 list-disc space-y-1 pl-6">
          <li>位置情報</li>
          <li>アクセス解析・行動トラッキングのための独自のイベントログ</li>
          <li>
            クラッシュログ・解析ツール（Analytics / Crashlytics 等）による情報
          </li>
        </ul>

        <h2 className="mb-2 mt-6 text-xl font-semibold">3. 利用目的</h2>
        <p>当方は、取得した利用者情報を以下の目的で利用します。</p>
        <ol className="mb-4 list-decimal space-y-1 pl-6">
          <li>本アプリの提供、本人確認および認証のため</li>
          <li>
            読書記録の保存・表示、フォロー中の利用者への「読み終えた」通知のため
          </li>
          <li>プッシュ通知の配信のため</li>
          <li>広告の配信および広告効果の測定のため</li>
          <li>不正利用の防止、本アプリの保守・改善のため</li>
          <li>利用者からの問い合わせに対応するため</li>
        </ol>

        <h2 className="mb-2 mt-6 text-xl font-semibold">
          4. 第三者提供・外部サービスの利用
        </h2>
        <p>
          当方は、法令に基づく場合を除き、利用者の同意なく利用者情報を第三者に提供しません。
        </p>
        <p>
          本アプリは、サービス提供のために以下の外部サービスを利用しており、各サービスの仕様に応じて利用者情報が当該サービスに送信される場合があります。各サービスにおける情報の取扱いは、それぞれのプライバシーポリシーに従います。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-gray-300 dark:border-gray-700 border-b-2">
                <th className="py-2 pr-4 text-left font-semibold">
                  外部サービス
                </th>
                <th className="py-2 pr-4 text-left font-semibold">
                  提供事業者
                </th>
                <th className="py-2 text-left font-semibold">用途</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-gray-300 dark:border-gray-700 border-b">
                <td className="py-2 pr-4">Firebase Authentication</td>
                <td className="py-2 pr-4">Google LLC</td>
                <td className="py-2">認証</td>
              </tr>
              <tr className="border-gray-300 dark:border-gray-700 border-b">
                <td className="py-2 pr-4">Cloud Firestore</td>
                <td className="py-2 pr-4">Google LLC</td>
                <td className="py-2">データの保存</td>
              </tr>
              <tr className="border-gray-300 dark:border-gray-700 border-b">
                <td className="py-2 pr-4">Cloud Functions</td>
                <td className="py-2 pr-4">Google LLC</td>
                <td className="py-2">通知配信等のサーバー処理</td>
              </tr>
              <tr className="border-gray-300 dark:border-gray-700 border-b">
                <td className="py-2 pr-4">Google AdMob</td>
                <td className="py-2 pr-4">Google LLC</td>
                <td className="py-2">広告配信</td>
              </tr>
              <tr className="border-gray-300 dark:border-gray-700 border-b">
                <td className="py-2 pr-4">Google Books API</td>
                <td className="py-2 pr-4">Google LLC</td>
                <td className="py-2">書籍情報の取得</td>
              </tr>
              <tr className="border-gray-300 dark:border-gray-700 border-b">
                <td className="py-2 pr-4">Expo（プッシュ通知）</td>
                <td className="py-2 pr-4">Expo（650 Industries, Inc.）</td>
                <td className="py-2">プッシュ通知の配信</td>
              </tr>
              <tr className="border-gray-300 dark:border-gray-700 border-b">
                <td className="py-2 pr-4">Apple サインイン</td>
                <td className="py-2 pr-4">Apple Inc.</td>
                <td className="py-2">認証</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul className="my-4 list-disc space-y-1 pl-6">
          <li>
            Google のプライバシーポリシー：
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-teal-500 hover:underline dark:text-night-teal"
            >
              https://policies.google.com/privacy
            </a>
          </li>
          <li>
            Google における広告での情報利用について：
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-teal-500 hover:underline dark:text-night-teal"
            >
              https://policies.google.com/technologies/ads
            </a>
          </li>
          <li>
            Apple のプライバシーポリシー：
            <a
              href="https://www.apple.com/legal/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-teal-500 hover:underline dark:text-night-teal"
            >
              https://www.apple.com/legal/privacy/
            </a>
          </li>
          <li>
            Expo のプライバシーポリシー：
            <a
              href="https://expo.dev/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-teal-500 hover:underline dark:text-night-teal"
            >
              https://expo.dev/privacy
            </a>
          </li>
        </ul>

        <h2 className="mb-2 mt-6 text-xl font-semibold">5. 情報の保管期間</h2>
        <p>
          利用者情報は、利用者のアカウントが存続する間、利用目的の達成に必要な範囲で保管します。アカウントの削除請求があった場合、または利用目的が消滅した場合は、法令で保存が義務付けられているものを除き、速やかに削除します。
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">
          6. 利用者情報の開示・訂正・削除等
        </h2>
        <p>
          利用者は、当方に対し、自己の利用者情報の開示、訂正、利用停止または削除を請求することができます。請求は、本ポリシー末尾の問い合わせ先までご連絡ください。本人確認のうえ、合理的な期間内に対応します。
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">7. 安全管理措置</h2>
        <p>
          当方は、利用者情報の漏えい、滅失または毀損の防止その他の安全管理のために、必要かつ適切な措置を講じます。
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">8. 未成年者の利用</h2>
        <p>
          未成年者が本アプリを利用する場合は、保護者の同意を得たうえでご利用ください。
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">9. 本ポリシーの変更</h2>
        <p>
          当方は、必要に応じて本ポリシーを変更することがあります。変更後の本ポリシーは、本アプリ内または当方が定める方法で掲示した時点から効力を生じるものとします。
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">10. 問い合わせ先</h2>
        <p>
          本ポリシーに関するお問い合わせ、および利用者情報に関する請求は、以下までご連絡ください。
        </p>
        <ul className="mb-4 list-disc space-y-1 pl-6">
          <li>運営者: Furugen Island</li>
          <li>
            メールアドレス:
            <a
              href="mailto:furugenmotoshig@gmail.com"
              className="ml-1 text-teal-500 hover:underline dark:text-night-teal"
            >
              furugenmotoshig@gmail.com
            </a>
          </li>
        </ul>

        <div className="border-gray-300 dark:border-gray-700 mt-8 border-t pt-6">
          <p className="text-gray-500 text-sm">制定日: 2026年6月26日</p>
        </div>
      </section>
    </main>
  )
}
