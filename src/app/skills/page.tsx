import PageFace from '../components/PageFace';
import Image from "next/image";
import WorkCard from '../components/WorkCard';

const works = [
  {
    src: "/images/works/work_01.png",
    alt: "work01",
    title: "ホームページ（地元スーパー）",
    description: "地元スーパーのHPを作成しました。スマホユーザーをメインターゲットに、レスポンシブデザインを実装しました。",
    tags: ["Vue.js", "Laravel", "#個人開発"]
  },
  {
    src: "/images/works/work_02.png",
    alt: "work02",
    title: "ホームページ（デイサービス施設）",
    description: "エンジニアでなくても運用可能にしたいというご希望があり、WordPressを用いたHPを新たに作成しました。",
    tags: ["WordPress", "#個人開発"]
  },
  {
    src: "/images/works/work_03.png",
    alt: "work03",
    title: "ホームページ（ウォーターサーバー）",
    description: "既存サイトの刷新を行いました。Youtubeの埋め込みやスライドショーなど、新しい要素を取り入れました。",
    tags: ["HTML", "CSS", "#個人開発"]
  },
  {
    src: "/images/works/hackathon_01.png",
    alt: "hackathon01",
    title: "今日の飯決めアプリ",
    description: "その日の気分などからレシピを提案します。楽天レシピAPIからのレスポンス待機時間などを考慮しながら実装を行いました。",
    tags: ["Vue.js", "Docker", "#チーム開発"]
  },
  {
    src: "/images/works/hackathon_02.png",
    alt: "hackathon02",
    title: "チーム開発チュートリアルアプリ",
    description: "ハッカソンで感じたチームビルディングでの課題をもとに、役割分担やタスク共有が簡単にできるアプリを開発しました。",
    tags: ["Laravel", "Docker", "#チーム開発"]
  },
  {
    src: "/images/works/hackathon_03.png",
    alt: "hackathon03",
    title: "Pythonで作るトランプゲーム",
    description: "Pythonを用いてローカル環境で実行するトランプゲームの開発と、それを配布するためのWebサイトの構築を行いました。",
    tags: ["Laravel", "Python", "#チーム開発"]
  },
  {
    src: "/images/works/hobby_01.png",
    alt: "hobby01",
    title: "自己探究プログラム振り返りサイト",
    description: "参加したプログラムの内容やスライド、共に参加したメンバーの情報をまとめたサイトを作成しました。",
    tags: ["Vue.js", "#個人開発"]
  },
  {
    src: "/images/works/hobby_02.png",
    alt: "hobby02",
    title: "あのシーンの吹き出し加工ツール",
    description: "あのシーンの感動を他場面でも応用したいとき、吹き出しを書き換えて自分好みの演出ができるツールを作成しました。",
    tags: ["HTML", "CSS", "#個人開発"]
  },
  {
    src: "/images/works/hobby_03.png",
    alt: "hobby03",
    title: "あのシーンの緊迫感体験ゲーム",
    description: "某アニメの名シーンを再現し、世界崩壊の緊迫感を体験できるヌメロン形式のパスワード推測ゲームを作成しました。",
    tags: ["Vue.js", "#個人開発"]
  }
];

export default function Page() {
  return (
    <section className="profile">
      <PageFace
        title="実績・スキル"
        subtitle="404 | Skills Not Found ..."
        mainMessage={<>
        </>}
      />
      <div className="works px-20">
        <h2 className="text-3xl font-bold">制作実績</h2>
        <div className="work-list grid grid-cols-3 gap-4 justify-items-center items-center my-10">
          {works.map((work, index) => (
            <WorkCard
              key={index}
              src={work.src}
              alt={work.alt}
              title={work.title}
              description={work.description}
              tags={work.tags}
            />
          ))}
        </div>
      </div>
      <div className="skills px-20">
        <h2 className="text-3xl font-bold">スキルセット</h2>
      </div>
    </section>
  );
}