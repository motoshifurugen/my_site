import MainMessage from "../components/MainMessage";
import Image from "next/image";

export default function Page() {
  return (
    <section className="profile px-20">
      <h1 className="text-4xl font-bold">プロフィール</h1>
      <div className="flex justify-center">
        <MainMessage />
      </div>
      <div className="card">
        <h2 className="text-3xl font-bold">経歴</h2>
        <div className="flex p-10 font-open-sans">
          <div className="flex w-1/2 text-lg leading-loose items-center">
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
          </div>
          <div className="w-1/2 flex justify-end">
            <Image src="/images/profile_01.jpg" alt="profile img 01" width={500} height={500} />
          </div>
        </div>
      </div>
      <div className="card">
        <h2 className="text-3xl font-bold">興味</h2>
        <div className="flex p-10 font-open-sans">
          <div className="flex w-1/2 text-lg leading-loose items-center">
            <p>
              物理学が目に見えない自然法則を記述することのように、<br />
              データという目に見えない情報を操作する感覚が楽しいです。<br />
              現在はフロントエンドを中心に学んでいますが、<br />
              バックエンドやネットワーク分野にも興味があるので、<br />
              今年はネットワークスペシャリストに挑戦します。<br />
              もう「ネットワークって何？」とはならないようにしたいです。
            </p>
          </div>
          <div className="w-1/2 flex justify-end">
            <Image src="/images/profile_02.png" alt="profile img 02" width={500} height={500} />
          </div>
        </div>
      </div>
      <div className="card">
        <h2 className="text-3xl font-bold">趣味</h2>
        <div className="flex p-10 font-open-sans">
          <div className="flex w-1/2 text-lg leading-loose items-center">
            <p>
              エイサー（沖縄の伝統芸能） ・ 読書（ビジネス書中心） ・<br />
              散歩 ・ 短歌 ・ ギター（アコギ） ・ ダーツ ・ ボウリング <br />
              and more<br />
            </p>
          </div>
          <div className="w-1/2 flex justify-end">
            <Image src="/images/profile_03.jpg" alt="profile img 02" width={500} height={500} />
          </div>
        </div>
      </div>
    </section>
  );
}