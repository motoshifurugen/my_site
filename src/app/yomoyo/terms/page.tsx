export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Yomoyo | 利用規約</h1>
      <section className="space-y-4 text-base leading-relaxed">
        <p>
          本利用規約（以下「本規約」といいます）は、Furugen
          Island（以下「当方」といいます）が提供するモバイルアプリケーション「Yomoyo」（以下「本アプリ」といいます）の利用条件を定めるものです。利用者は、本規約に同意のうえ本アプリを利用するものとします。
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">第1条（適用）</h2>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li>
            本規約は、本アプリの利用に関する当方と利用者との間の一切の関係に適用されます。
          </li>
          <li>
            当方が本アプリ内またはその他の方法で掲示する個別の規定・注意事項は、本規約の一部を構成します。
          </li>
          <li>
            本規約と個別規定の内容が異なる場合は、個別規定が優先して適用されます。
          </li>
        </ol>

        <h2 className="mb-2 mt-6 text-xl font-semibold">第2条（定義）</h2>
        <p>本規約において使用する用語の定義は、次のとおりとします。</p>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li>
            「本サービス」とは、本アプリを通じて当方が提供する読書記録・共有に関するサービスをいいます。
          </li>
          <li>
            「利用者」とは、本規約に同意のうえ本サービスを利用する個人をいいます。
          </li>
          <li>
            「コンテンツ」とは、利用者が本サービスに登録・投稿する読書記録、表示名その他の情報をいいます。
          </li>
        </ol>

        <h2 className="mb-2 mt-6 text-xl font-semibold">
          第3条（利用登録・アカウント）
        </h2>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li>
            利用者は、Google または Apple
            のアカウントを用いた認証により本サービスを利用します。
          </li>
          <li>
            利用者は、自己の責任においてアカウントを管理するものとし、第三者に利用させ、または貸与・譲渡してはなりません。
          </li>
          <li>
            アカウントの管理不十分または第三者の使用等により利用者に生じた損害について、当方は責任を負いません。
          </li>
        </ol>

        <h2 className="mb-2 mt-6 text-xl font-semibold">第4条（料金）</h2>
        <p>
          本サービスは無料で利用できます。ただし、本アプリでは広告が表示されます。本サービスの利用に必要な通信費等は、利用者の負担とします。
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">第5条（禁止事項）</h2>
        <p className="mb-2">
          利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。
        </p>
        <ol className="mb-4 list-decimal space-y-1 pl-6">
          <li>法令または公序良俗に違反する行為</li>
          <li>犯罪行為に関連する行為</li>
          <li>当方、他の利用者または第三者の権利・利益を侵害する行為</li>
          <li>他の利用者または第三者を誹謗中傷し、名誉・信用を毀損する行為</li>
          <li>
            過度に暴力的、わいせつ、差別的な表現その他他者に著しく不快感を与える内容を登録・投稿する行為
          </li>
          <li>
            本サービスのネットワークまたはシステムに過度な負荷をかける行為、不正アクセスを試みる行為
          </li>
          <li>
            本サービスを逆アセンブル、逆コンパイル、リバースエンジニアリングする行為
          </li>
          <li>本サービスの運営を妨害する行為</li>
          <li>他者になりすます行為</li>
          <li>当方が不適切と合理的に判断する行為</li>
        </ol>

        <h2 className="mb-2 mt-6 text-xl font-semibold">
          第6条（コンテンツの取扱い）
        </h2>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li>
            利用者が登録・投稿したコンテンツの権利は、利用者に帰属します。
          </li>
          <li>
            利用者は、フォロー関係にある他の利用者に対し、読書記録等のコンテンツが表示・通知されることに同意するものとします。
          </li>
          <li>
            当方は、本サービスの提供・改善に必要な範囲で、コンテンツを利用できるものとします。
          </li>
          <li>
            利用者は、自己が登録・投稿するコンテンツについて、必要な権利を有していること、および第三者の権利を侵害しないことを保証するものとします。
          </li>
        </ol>

        <h2 className="mb-2 mt-6 text-xl font-semibold">
          第7条（本サービスの提供の停止・変更）
        </h2>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li>
            当方は、以下のいずれかに該当する場合、利用者への事前の通知なく、本サービスの全部または一部の提供を停止または中断することができます。
            <ol className="mt-2 list-decimal space-y-1 pl-6">
              <li>保守・点検・更新を行う場合</li>
              <li>天災等の不可抗力により提供が困難となった場合</li>
              <li>その他、当方が提供の停止・中断が必要と判断した場合</li>
            </ol>
          </li>
          <li>
            当方は、利用者への事前の通知をもって、本サービスの内容を変更し、または提供を終了することができます。
          </li>
          <li>
            当方は、本条に基づき行った措置により利用者に生じた損害について、責任を負いません。
          </li>
        </ol>

        <h2 className="mb-2 mt-6 text-xl font-semibold">
          第8条（利用制限・登録抹消）
        </h2>
        <p className="mb-2">
          当方は、利用者が以下のいずれかに該当する場合、事前の通知なく、当該利用者のコンテンツの削除、本サービスの利用制限またはアカウントの削除を行うことができます。
        </p>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li>本規約のいずれかの条項に違反した場合</li>
          <li>登録情報に虚偽の事実があることが判明した場合</li>
          <li>
            その他、当方が本サービスの利用を適当でないと合理的に判断した場合
          </li>
        </ol>

        <h2 className="mb-2 mt-6 text-xl font-semibold">
          第9条（退会・アカウント削除）
        </h2>
        <p>
          利用者は、当方所定の方法によりいつでも退会し、アカウントを削除することができます。
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">
          第10条（保証の否認・免責）
        </h2>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li>
            当方は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、特定目的への適合性等）がないことを明示的にも黙示的にも保証しません。
          </li>
          <li>
            当方は、本サービスに起因して利用者に生じた損害について、当方の故意または重過失による場合を除き、責任を負いません。
          </li>
          <li>
            本アプリに表示される書籍情報は外部サービス（Google Books API
            等）から取得したものであり、当方はその正確性・完全性を保証しません。
          </li>
          <li>
            利用者間または利用者と第三者との間で生じた紛争について、当方は責任を負いません。
          </li>
        </ol>

        <h2 className="mb-2 mt-6 text-xl font-semibold">第11条（広告）</h2>
        <p>
          本アプリには第三者配信事業者（Google AdMob
          等）による広告が表示されます。広告の内容および広告主との取引について、当方は責任を負いません。
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">
          第12条（本規約の変更）
        </h2>
        <p>
          当方は、必要と判断した場合、利用者に通知することなく本規約を変更することができます。変更後の本規約は、本アプリ内または当方が定める方法で掲示した時点から効力を生じるものとします。変更後に利用者が本サービスを利用した場合、変更後の本規約に同意したものとみなします。
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">
          第13条（準拠法・管轄裁判所）
        </h2>
        <ol className="mb-4 list-decimal space-y-2 pl-6">
          <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
          <li>
            本サービスに関して当方と利用者との間で紛争が生じた場合には、当方の所在地を管轄する裁判所を専属的合意管轄裁判所とします。
          </li>
        </ol>

        <h2 className="mb-2 mt-6 text-xl font-semibold">
          第14条（問い合わせ先）
        </h2>
        <p>本規約に関するお問い合わせは、以下までご連絡ください。</p>
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
