export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">利用規約（Terms of Service）</h1>
      <section className="space-y-4 text-base leading-relaxed">
        <p>
          本利用規約（以下「本規約」といいます。）は、運営者名：Motoshi Furugen（以下「当方」といいます。）が提供するアプリケーション「わたしの台所図鑑」（以下「本サービス」といいます。）の利用条件を定めるものです。ユーザーは本規約に同意のうえ本サービスを利用するものとします。
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. 適用</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>本規約は、ユーザーと当方との間の本サービスの利用に関わる一切の関係に適用されます。</li>
          <li>当方が本サービス上または別途掲示するルール等は、本規約の一部を構成するものとします。</li>
        </ol>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. 本サービスの内容</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>本サービスは、料理の記録・整理・閲覧等の機能を提供します。</li>
          <li>当方は、ユーザーへの事前通知なく、本サービスの内容を追加・変更・停止することがあります。</li>
        </ol>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. 利用環境</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>本サービスの利用に必要な端末、通信回線、ソフトウェア等はユーザーの費用と責任で準備するものとします。</li>
          <li>OS・端末・ネットワーク環境等の影響により、本サービスの全部または一部が利用できない場合があります。</li>
        </ol>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. アカウント・データ</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>本サービス上で作成された記録データ等（以下「ユーザーデータ」）の管理責任はユーザーにあります。</li>
          <li>当方は、ユーザーデータの消失・破損・変更等について、当方の故意または重過失がある場合を除き責任を負いません。</li>
          <li>端末の故障・機種変更・アプリ削除等によりデータが失われる可能性があることをユーザーは理解し、必要に応じてバックアップ等を行うものとします。</li>
        </ol>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. 禁止事項</h2>
        <p className="mb-2">
          ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
        </p>
        <ol className="list-decimal pl-6 mb-4 space-y-1">
          <li>法令または公序良俗に違反する行為</li>
          <li>本サービスの運営を妨害する行為</li>
          <li>本サービスまたは当方のサーバー等に過度な負荷をかける行為</li>
          <li>不正アクセス、リバースエンジニアリング、解析、改変等の行為</li>
          <li>他のユーザーまたは第三者の権利（著作権、商標権、プライバシー等）を侵害する行為</li>
          <li>その他、当方が不適切と判断する行為</li>
        </ol>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. 知的財産権</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>本サービスに関するプログラム、デザイン、UI、文章、画像等の知的財産権は当方または正当な権利者に帰属します。</li>
          <li>ユーザーは、本サービスを本来の利用目的の範囲でのみ利用でき、当方の許可なく複製・転載・配布・公衆送信等をしてはなりません。</li>
        </ol>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. 有料機能・サブスクリプション</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>本サービスには有料機能（サブスクリプション）を含む場合があります。価格、課金単位、提供内容はアプリ内またはストア上の表示に従います。</li>
          <li>サブスクリプションは、ユーザーが解約しない限り、各プランの期間満了時に自動更新されます。</li>
          <li>解約は、ユーザーが利用するプラットフォーム（App Store / Google Play）の手続きにより行ってください。当方はアプリ内で直接解約手続きを行うことはできません。</li>
          <li>既に支払われた料金は、法令上必要な場合またはプラットフォームの規定で認められる場合を除き、返金されません。返金の可否は各プラットフォームの規定に従います。</li>
          <li>無料トライアルやプロモーションが提供される場合、その条件・期間・適用可否はアプリ内またはストア上の表示に従います。</li>
        </ol>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. 免責事項</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>当方は、本サービスの完全性、正確性、確実性、特定目的への適合性等について、明示または黙示を問わず保証しません。</li>
          <li>当方は、本サービスの利用または利用不能によりユーザーに生じた損害について、当方の故意または重過失がある場合を除き責任を負いません。</li>
          <li>当方が損害賠償責任を負う場合であっても、当方の責任は、ユーザーが直近1か月に当方へ支払った利用料金（有料プランの場合）を上限とします（ただし、適用法令により制限できない場合を除きます）。</li>
        </ol>

        <h2 className="text-xl font-semibold mt-6 mb-2">9. 通知</h2>
        <p>
          本サービスに関する通知は、本サービス内の表示、プッシュ通知、または当方が適切と判断する方法により行います。
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">10. 規約の変更</h2>
        <p>
          当方は、必要に応じて本規約を変更できます。変更後の規約は、本サービス内または当方のウェブサイト等で掲示した時点から効力を生じます。
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">11. 個人情報等の取扱い</h2>
        <p>
          当方は、本サービスにおけるユーザー情報の取扱いについて、別途定めるプライバシーポリシーに従います。
        </p>
        <p className="mt-2">
          プライバシーポリシーURL：
          <a
            href="https://furugen-island.com/my_site/my-kitchen/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-500 dark:text-night-teal hover:underline ml-1"
          >
            https://furugen-island.com/my_site/my-kitchen/privacy
          </a>
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">12. 準拠法・裁判管轄</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>本規約の解釈には日本法を準拠法とします。</li>
          <li>本サービスに関して紛争が生じた場合、地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
        </ol>

        <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">事業者情報</h2>
          <div className="space-y-2">
            <p>運営者：Motoshi Furugen</p>
            <p>
              連絡先：
              <a
                href="mailto:furugenmotoshig@gmail.com"
                className="text-teal-500 dark:text-night-teal hover:underline ml-1"
              >
                furugenmotoshig@gmail.com
              </a>
            </p>
            <p>制定日：2026-02-12</p>
            <p>改定日：—</p>
          </div>
        </div>
      </section>
    </main>
  )
}

