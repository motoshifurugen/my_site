import MainMessage from "../components/MainMessage";
import Image from "next/image";
import Card from "../components/Card";

export default function Page() {
  return (
    <section className="profile px-20">
      <h1 className="text-4xl font-bold">プロフィール</h1>
      <div className="flex justify-center">
        <MainMessage />
      </div>
      <Card
        title="経歴"
        content={
          <>
            <p className="mr-6 text-right">
              1998年<br />
              2017年<br />
              2020年<br />
              2021年<br />
              2023年<br />
              現在
            </p>
            <p>
              沖縄に生まれる<br />
              高校卒業後、広島大学理学部物理学科へ進学する<br />
              大学休学中にプログラミングを始める<br />
              長期インターンでWebエンジニアを経験する<br />
              大学卒業後、エンジニアとして就職する<br />
              フロントエンドエンジニアとして奮闘中
            </p>
          </>
        }
        imageSrc="/images/profile_01.jpg"
        imageAlt="profile img 01"
      />
      <Card
        title="興味"
        content={
          <>
            <p>
              物理学が目に見えない自然の法則を解き明かすように、<br />
              データという見えない情報を扱うことに楽しさを感じています。<br />
              最近はバックエンドやネットワーク分野に興味があり、<br />
              今年はネットワークスペシャリストの資格に挑戦します。<br />
              心が強い方ではないので、メンタルヘルスへの関心も大切にしています。
            </p>
          </>
        }
        imageSrc="/images/profile_02.png"
        imageAlt="profile img 02"
      />
      <Card
        title="趣味"
        content={
          <>
            <p>
              エイサー（沖縄の伝統芸能） ・ 読書（ビジネス書中心） ・<br />
              散歩 ・ 短歌 ・ ギター（アコギ） ・ ドライブ ・ ボウリング <br />
              and more<br />
            </p>
          </>
        }
        imageSrc="/images/profile_03.jpg"
        imageAlt="profile img 03"
      />
    </section>
  );
}