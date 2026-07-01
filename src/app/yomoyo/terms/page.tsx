'use client'

import { useI18n } from '../../../i18n'
import LangToggle from '../LangToggle'

export default function TermsPage() {
  const { locale } = useI18n()
  const isEn = locale === 'en'

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <LangToggle />
      <h1 className="mb-6 text-3xl font-bold">
        {isEn ? 'Yomoyo | Terms of Service' : 'Yomoyo | 利用規約'}
      </h1>

      {isEn ? (
        <section className="space-y-4 text-base leading-relaxed">
          <p>
            These Terms of Service (hereinafter referred to as &quot;these
            Terms&quot;) set forth the conditions for use of the reading-record
            and reading-connection app &quot;Yomoyo&quot; (hereinafter referred
            to as &quot;the Service&quot;) provided by Furugen Island
            (hereinafter referred to as &quot;the Operator&quot;). Every person
            who uses the Service (hereinafter referred to as &quot;the
            User&quot;) shall use the Service upon agreeing to these Terms.
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">Article 1 (Scope)</h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              These Terms apply to all relationships between the User and the
              Operator concerning use of the Service.
            </li>
            <li>
              At the point when the User downloads, installs, or uses the
              Service, the User shall be deemed to have agreed to these Terms.
            </li>
            <li>
              Guidelines, notices, and the like that the Operator separately
              establishes on the Service (hereinafter referred to as
              &quot;Individual Provisions&quot;) constitute a part of these
              Terms. In the event of any conflict between these Terms and the
              Individual Provisions, the Individual Provisions shall prevail.
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 2 (Definitions)
          </h2>
          <p>The definitions of terms used in these Terms are as follows.</p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>
              &quot;Content&quot; means the collective term for text, images,
              and other information accessible on the Service.
            </li>
            <li>
              &quot;User Content&quot; means reading records, comments, profile
              information, and other information that the User registers, posts,
              or transmits through the Service.
            </li>
            <li>
              &quot;Follow&quot; and &quot;Friend&quot; mean functions on the
              Service that enable Users to mutually view each other&apos;s
              reading records and the like.
            </li>
          </ul>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 3 (Content of the Service)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              The Service provides functions such as recording the reading of
              books, saving and visualizing reading records, connecting with
              other Users through Follow/Friend, viewing the feed (timeline),
              and receiving notifications.
            </li>
            <li>
              The Service uses third-party services such as the Google Books API
              to obtain book information. The Operator does not guarantee the
              accuracy or comprehensiveness of book information.
            </li>
            <li>
              The Operator may add to, change, or discontinue all or part of the
              content of the Service without prior notice to the User.
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 4 (Account Registration and Authentication)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              The User shall register an account for the Service by signing in
              using a Google or Apple account or by other methods designated by
              the Operator.
            </li>
            <li>
              The User may use the Service only if the User is 13 years of age
              or older. If a minor uses the Service, the minor shall use it upon
              obtaining the consent of a person with parental authority or
              another legal representative.
            </li>
            <li>
              The User shall keep the registered information accurate and up to
              date at the User&apos;s own responsibility.
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 5 (Account Management)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              The User shall appropriately manage the User&apos;s own
              authentication information at the User&apos;s own responsibility,
              and shall not allow any third party to use it, or lend, transfer,
              sell, or otherwise dispose of it.
            </li>
            <li>
              The Operator shall bear no liability whatsoever for any damage
              incurred by the User due to insufficient management of
              authentication information, errors in use, use by a third party,
              or the like.
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 6 (Account Deletion and Withdrawal)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              The User may withdraw at any time and request deletion of the
              User&apos;s own account and related data through the prescribed
              operation within the Service (the account deletion function).
            </li>
            <li>
              After withdrawal, User Content will be deleted by the method the
              Operator prescribes. However, this shall not apply to information
              that has already propagated to other Users&apos; environments, or
              information that temporarily remains in backups or the like.
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 7 (Prohibited Acts)
          </h2>
          <p className="mb-2">
            In using the Service, the User shall not engage in the following
            acts.
          </p>
          <ol className="mb-4 list-decimal space-y-1 pl-6">
            <li>
              Acts that violate laws and regulations or public order and morals
            </li>
            <li>Acts related to criminal conduct</li>
            <li>
              Acts that infringe the intellectual property rights, portrait
              rights, privacy, reputation, or other rights or interests of the
              Operator, other Users, or third parties
            </li>
            <li>
              Slander, harassment, discriminatory expression, stalking, or other
              nuisance acts against other Users or other third parties
            </li>
            <li>
              Acts of posting or transmitting obscene, violent, or otherwise
              inappropriate content
            </li>
            <li>
              Acts of registering false information or impersonating others
            </li>
            <li>
              Acts that destroy or interfere with the functions of the
              Service&apos;s servers or network, unauthorized access, reverse
              engineering, improper exploitation of vulnerabilities, and the
              like
            </li>
            <li>
              Acts of using the Service for commercial purposes (unauthorized
              advertising, promotion, solicitation, and the like)
            </li>
            <li>
              Acts of placing an excessive load on the Service by automated
              means (bots, scraping, and the like)
            </li>
            <li>
              Other acts that the Operator reasonably determines to be
              inappropriate
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 8 (Handling of User Content)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              The copyright and other rights in User Content belong to the User
              or the rightful holder.
            </li>
            <li>
              The User grants to the Operator the right to use User Content free
              of charge (including reproduction, display, transmission, and
              display to other Users) to the extent necessary for the provision,
              maintenance, and improvement of the Service.
            </li>
            <li>
              Through the Follow/Friend functions, part of User Content (reading
              records, display name, avatar, and the like) may be viewed by
              other Users. The User shall post such content upon understanding
              the scope of disclosure.
            </li>
            <li>
              The User warrants, with respect to the User&apos;s own User
              Content, that the User holds the rights necessary for posting and
              that it does not infringe the rights of any third party.
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 9 (Third-Party Services)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              The Service uses services provided by third parties for
              authentication (Google/Apple), book information (Google Books
              API), advertisement delivery, push notifications, and other
              functions.
            </li>
            <li>
              Use of third-party services is subject to the terms of use and
              policies established by each third party. The User shall review
              these as necessary.
            </li>
            <li>
              The Operator shall bear no liability in cases where the functions
              of the Service are affected by changes in the availability of
              third-party services.
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 10 (Advertisements)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              Advertisements may be displayed on the Service through Google
              AdMob and the like.
            </li>
            <li>
              The Operator shall bear no liability whatsoever with respect to
              the services or products of advertisers or of third parties
              accessed via advertisements.
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 11 (Intellectual Property Rights)
          </h2>
          <p>
            The copyright, trademark rights, and other intellectual property
            rights in the Service and in the content related to the Service
            (excluding User Content) belong to the Operator or the rightful
            holder. The User shall not use these without the prior permission of
            the Operator.
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 12 (Usage Fees)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              The Service is provided free of charge at present, and part of its
              operating costs is covered by advertisements.
            </li>
            <li>
              In the event that the Operator introduces paid functions in the
              future, the Operator will revise these Terms in advance and
              separately establish conditions such as fees and payment methods.
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 13 (Suspension, Change, and Termination of the Service)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              The Operator may suspend or interrupt the provision of all or part
              of the Service without prior notice to the User in any of the
              following cases.
              <ol className="mt-2 list-decimal space-y-1 pl-6">
                <li>When performing maintenance or inspection of the system</li>
                <li>
                  When the provision of the Service becomes difficult due to
                  force majeure such as natural disasters
                </li>
                <li>
                  Other cases where the Operator reasonably determines that
                  suspension or interruption is necessary
                </li>
              </ol>
            </li>
            <li>
              The Operator may terminate the provision of the Service for any
              reason. In such case, the Operator will endeavor to give advance
              notice to the extent possible.
            </li>
            <li>
              The Operator shall bear no liability for any damage incurred by
              the User due to measures taken under this Article.
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 14 (Use Restriction and Deregistration)
          </h2>
          <p>
            If the User violates these Terms, or if the Operator reasonably
            determines that there is a risk of violation, the Operator may
            restrict the User&apos;s use of the Service or delete the account
            without prior notice.
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 15 (Disclaimer of Warranties and Limitation of Liability)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              The Operator does not warrant, whether expressly or impliedly,
              that the Service is free from de facto or legal defects (including
              defects concerning safety, reliability, accuracy, completeness,
              validity, fitness for a particular purpose, security, and the
              like, as well as errors, bugs, and infringements of rights).
            </li>
            <li>
              The Operator shall bear no liability for any damage incurred by
              the User arising from the Service, except in cases of the
              Operator&apos;s intentional misconduct or gross negligence.
            </li>
            <li>
              Even in cases where the disclaimer in the preceding paragraph does
              not apply, the Operator shall bear liability only within the scope
              of ordinarily arising damages (excluding incidental damages,
              indirect damages, and damages related to lost profits), and in
              light of the fact that the Service is provided free of charge,
              such liability shall be construed narrowly.
            </li>
            <li>
              The Operator shall bear no liability for disputes arising between
              Users or between a User and a third party.
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 16 (Privacy)
          </h2>
          <p>
            The Operator shall appropriately handle the User&apos;s personal
            information and user information in accordance with the separately
            established &quot;Privacy Policy.&quot; When using the Service,
            please also review the Privacy Policy.
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 17 (Changes to these Terms)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              The Operator may change these Terms at any time without notifying
              the User when the Operator determines it to be necessary. However,
              for changes that require the User&apos;s consent under laws and
              regulations, the Operator will obtain consent by a method
              prescribed by the Operator.
            </li>
            <li>
              The revised Terms shall take effect from the time they are posted
              on the Service. If the User continues to use the Service after the
              change, the User shall be deemed to have agreed to the revised
              Terms.
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 18 (Communication and Notice)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              Notices from the Operator to the User concerning the Service shall
              be given by display within the Service or by other methods that
              the Operator deems appropriate.
            </li>
            <li>
              Inquiries concerning the Service and other communications from the
              User to the Operator shall be made to the following contact.
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>
                  Contact:
                  <a
                    href="mailto:furugenmotoshig@gmail.com"
                    className="ml-1 text-teal-500 hover:underline dark:text-night-teal"
                  >
                    furugenmotoshig@gmail.com
                  </a>
                </li>
              </ul>
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 19 (Prohibition of Assignment of Rights and Obligations)
          </h2>
          <p>
            The User may not assign to any third party, or provide as
            collateral, the User&apos;s status under these Terms or the rights
            and obligations based on these Terms without the prior written
            consent of the Operator.
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 20 (Severability)
          </h2>
          <p>
            Even if any provision of these Terms or a part thereof is determined
            to be invalid or unenforceable under laws and regulations or the
            like, the remaining provisions other than that part shall continue
            to be fully effective.
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            Article 21 (Governing Law and Jurisdiction)
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              The interpretation and application of these Terms shall be
              governed by the laws of Japan.
            </li>
            <li>
              For disputes arising between the Operator and the User concerning
              the Service, the Tokyo District Court shall be the exclusive
              agreed jurisdictional court of first instance.
            </li>
          </ol>

          <div className="border-gray-300 dark:border-gray-700 mt-8 border-t pt-6">
            <p className="text-gray-500 text-sm">Enacted: June 26, 2026</p>
          </div>
        </section>
      ) : (
        <section className="space-y-4 text-base leading-relaxed">
          <p>
            本利用規約（以下「本規約」といいます）は、Furugen
            Island（以下「運営者」といいます）が提供する読書記録・読書つながりアプリ「Yomoyo」（以下「本サービス」といいます）の利用条件を定めるものです。本サービスを利用するすべての方（以下「ユーザー」といいます）は、本規約に同意のうえ本サービスを利用するものとします。
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">第1条（適用）</h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              本規約は、ユーザーと運営者との間の本サービスの利用に関する一切の関係に適用されます。
            </li>
            <li>
              本サービスをダウンロード、インストール、または利用した時点で、ユーザーは本規約に同意したものとみなします。
            </li>
            <li>
              運営者が本サービス上で別途定めるガイドライン、注意事項等（以下「個別規定」といいます）は、本規約の一部を構成します。本規約と個別規定が矛盾する場合は、個別規定が優先します。
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">第2条（定義）</h2>
          <p>本規約において使用する用語の定義は次のとおりです。</p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>
              「コンテンツ」とは、文章、画像、その他本サービス上でアクセス可能な情報の総称をいいます。
            </li>
            <li>
              「ユーザーコンテンツ」とは、ユーザーが本サービスを通じて登録・投稿・送信する読書記録、コメント、プロフィール情報その他の情報をいいます。
            </li>
            <li>
              「フォロー」「フレンド」とは、ユーザー間で相互に読書記録等を閲覧できるようにするための本サービス上の機能をいいます。
            </li>
          </ul>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第3条（本サービスの内容）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              本サービスは、書籍の読書記録、読書記録の保存・可視化、他のユーザーとのフォロー／フレンドによるつながり、フィード（タイムライン）の閲覧、通知の受信等の機能を提供します。
            </li>
            <li>
              本サービスは、書籍情報の取得のために Google Books API
              等の第三者サービスを利用します。書籍情報の正確性・網羅性について運営者は保証しません。
            </li>
            <li>
              運営者は、ユーザーへの事前告知なく、本サービスの内容の全部または一部を追加・変更・廃止することができます。
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第4条（アカウント登録・認証）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              ユーザーは、Google または Apple
              のアカウントを用いたサインインその他運営者が定める方法により、本サービスのアカウントを登録するものとします。
            </li>
            <li>
              ユーザーは、13歳以上である場合に限り本サービスを利用できます。未成年者が本サービスを利用する場合は、親権者その他の法定代理人の同意を得たうえで利用するものとします。
            </li>
            <li>
              ユーザーは、登録情報を自己の責任において正確かつ最新の状態に保つものとします。
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第5条（アカウントの管理）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              ユーザーは、自己の認証情報を自己の責任において適切に管理するものとし、第三者に利用させ、または貸与・譲渡・売買等をしてはならないものとします。
            </li>
            <li>
              認証情報の管理不十分、使用上の過誤、第三者の使用等によってユーザーに生じた損害について、運営者は一切の責任を負いません。
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第6条（アカウントの削除・退会）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              ユーザーは、本サービス内の所定の操作（アカウント削除機能）により、いつでも退会し、自己のアカウントおよび関連データの削除を求めることができます。
            </li>
            <li>
              退会後、ユーザーコンテンツは運営者の定める方法により削除されます。ただし、他のユーザーの環境に既に伝播した情報や、バックアップ等に一時的に残存する情報については、この限りではありません。
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">第7条（禁止事項）</h2>
          <p className="mb-2">
            ユーザーは、本サービスの利用にあたり、次の行為をしてはなりません。
          </p>
          <ol className="mb-4 list-decimal space-y-1 pl-6">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>
              運営者、他のユーザー、または第三者の知的財産権、肖像権、プライバシー、名誉その他の権利・利益を侵害する行為
            </li>
            <li>
              他のユーザーその他の第三者に対する誹謗中傷、嫌がらせ、差別的表現、ストーキングその他の迷惑行為
            </li>
            <li>
              わいせつ、暴力的、その他不適切なコンテンツを投稿・送信する行為
            </li>
            <li>虚偽の情報を登録する行為、他人になりすます行為</li>
            <li>
              本サービスのサーバーやネットワークの機能を破壊・妨害する行為、不正アクセス、リバースエンジニアリング、脆弱性の不正利用等
            </li>
            <li>
              本サービスを商業目的（無断での広告・宣伝・勧誘等）で利用する行為
            </li>
            <li>
              自動化された手段（ボット、スクレイピング等）により本サービスへ過度な負荷をかける行為
            </li>
            <li>その他、運営者が不適切と合理的に判断する行為</li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第8条（ユーザーコンテンツの取扱い）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              ユーザーコンテンツの著作権その他の権利は、ユーザーまたは正当な権利者に帰属します。
            </li>
            <li>
              ユーザーは、本サービスの提供・維持・改善に必要な範囲で、運営者に対し、ユーザーコンテンツを無償で使用（複製、表示、送信、他のユーザーへの表示等）できる権利を許諾するものとします。
            </li>
            <li>
              フォロー／フレンド機能により、ユーザーコンテンツの一部（読書記録、表示名、アバター等）は、他のユーザーに閲覧される場合があります。ユーザーは、公開範囲を理解したうえで投稿するものとします。
            </li>
            <li>
              ユーザーは、自己のユーザーコンテンツについて、投稿に必要な権利を有していること、および第三者の権利を侵害しないことを保証するものとします。
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第9条（第三者サービス）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              本サービスは、認証（Google／Apple）、書籍情報（Google Books
              API）、広告配信、プッシュ通知、その他の機能のために第三者が提供するサービスを利用します。
            </li>
            <li>
              第三者サービスの利用には、各第三者が定める利用規約・ポリシーが適用されます。ユーザーは、必要に応じてこれらを確認するものとします。
            </li>
            <li>
              第三者サービスの提供状況の変化により本サービスの機能が影響を受けた場合について、運営者は責任を負いません。
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第10条（広告について）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              本サービスには、Google AdMob
              等を通じた広告が表示されることがあります。
            </li>
            <li>
              広告主または広告経由でアクセスする第三者のサービス・商品に関して、運営者は一切の責任を負いません。
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第11条（知的財産権）
          </h2>
          <p>
            本サービスおよび本サービスに関連するコンテンツ（ユーザーコンテンツを除く）に関する著作権、商標権その他の知的財産権は、運営者または正当な権利者に帰属します。ユーザーは、これらを運営者の事前の許諾なく利用してはなりません。
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第12条（利用料金）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              本サービスは、現時点では無料で提供され、その運営費用の一部を広告により賄います。
            </li>
            <li>
              運営者が将来、有料機能を導入する場合には、事前に本規約を改定し、料金・支払方法等の条件を別途定めます。
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第13条（本サービスの停止・変更・終了）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              運営者は、次のいずれかの場合、ユーザーへの事前告知なく、本サービスの全部または一部の提供を停止・中断できるものとします。
              <ol className="mt-2 list-decimal space-y-1 pl-6">
                <li>システムの保守・点検を行う場合</li>
                <li>
                  天災地変等の不可抗力により本サービスの提供が困難となった場合
                </li>
                <li>その他、運営者が停止・中断が必要と合理的に判断した場合</li>
              </ol>
            </li>
            <li>
              運営者は、任意の理由により本サービスの提供を終了できるものとします。この場合、運営者は可能な範囲で事前に告知するよう努めます。
            </li>
            <li>
              本条に基づく措置によりユーザーに生じた損害について、運営者は責任を負いません。
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第14条（利用制限・登録抹消）
          </h2>
          <p>
            運営者は、ユーザーが本規約に違反した場合、または違反のおそれがあると合理的に判断した場合、事前の通知なく、当該ユーザーによる本サービスの利用を制限し、またはアカウントを削除することができます。
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第15条（保証の否認および免責事項）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              運営者は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定目的への適合性、セキュリティ等に関する欠陥、エラーやバグ、権利侵害等を含みます）がないことを明示的にも黙示的にも保証しません。
            </li>
            <li>
              運営者は、本サービスに起因してユーザーに生じたあらゆる損害について、運営者の故意または重過失による場合を除き、責任を負いません。
            </li>
            <li>
              前項の免責が適用されない場合であっても、運営者は、通常生じうる損害の範囲内（付随的損害、間接損害、逸失利益に係る損害を除く）で責任を負うものとし、本サービスが無償で提供されていることに鑑み、その責任は限定的に解釈されるものとします。
            </li>
            <li>
              ユーザー間またはユーザーと第三者との間で生じた紛争について、運営者は責任を負いません。
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第16条（プライバシー）
          </h2>
          <p>
            運営者は、ユーザーの個人情報および利用者情報を、別途定める「プライバシーポリシー」に従って適切に取り扱います。本サービスの利用にあたっては、プライバシーポリシーもあわせてご確認ください。
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第17条（本規約の変更）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              運営者は、必要と判断した場合、ユーザーに通知することなく、いつでも本規約を変更できるものとします。ただし、法令上ユーザーの同意が必要となる変更については、運営者所定の方法で同意を取得します。
            </li>
            <li>
              変更後の本規約は、本サービス上に掲示された時点から効力を生じるものとします。変更後にユーザーが本サービスの利用を継続した場合、当該ユーザーは変更後の本規約に同意したものとみなします。
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第18条（連絡・通知）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>
              本サービスに関する運営者からユーザーへの通知は、本サービス内の表示その他運営者が適当と判断する方法により行います。
            </li>
            <li>
              本サービスに関するお問い合わせその他ユーザーから運営者への連絡は、次の窓口宛に行うものとします。
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>
                  お問い合わせ窓口:
                  <a
                    href="mailto:furugenmotoshig@gmail.com"
                    className="ml-1 text-teal-500 hover:underline dark:text-night-teal"
                  >
                    furugenmotoshig@gmail.com
                  </a>
                </li>
              </ul>
            </li>
          </ol>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第19条（権利義務の譲渡禁止）
          </h2>
          <p>
            ユーザーは、運営者の書面による事前の承諾なく、本規約上の地位または本規約に基づく権利義務を第三者に譲渡し、または担保に供することはできません。
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第20条（分離可能性）
          </h2>
          <p>
            本規約のいずれかの条項またはその一部が法令等により無効または執行不能と判断された場合であっても、当該部分以外の規定は引き続き完全に効力を有するものとします。
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold">
            第21条（準拠法・管轄）
          </h2>
          <ol className="mb-4 list-decimal space-y-2 pl-6">
            <li>本規約の解釈および適用は、日本法に準拠するものとします。</li>
            <li>
              本サービスに関して運営者とユーザーとの間で生じた紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </li>
          </ol>

          <div className="border-gray-300 dark:border-gray-700 mt-8 border-t pt-6">
            <p className="text-gray-500 text-sm">制定日: 2026年6月26日</p>
          </div>
        </section>
      )}
    </main>
  )
}
