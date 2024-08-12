import PageFace from '../components/PageFace';
import WorkCard from '../components/WorkCard';
import SkillTimeline from '../components/SkillTimeline';

type Work = {
  src: string;
  alt: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
};

const works: Work[] = [
  {
    src: "/images/works/work_01.png",
    alt: "work01",
    title: "ホームページ（地元スーパー）",
    description: "地元スーパーのホームページを作成しました。スマホユーザーを主なターゲットとし、レスポンシブデザインを採用しました。",
    tags: ["Vue.js", "Laravel", "#個人開発"],
    date: "2022-12"
  },
  {
    src: "/images/works/work_02.png",
    alt: "work02",
    title: "ホームページ（デイサービス施設）",
    description: "エンジニアでなくても運用できるようにとの要望を受け、WordPressを使って新たにホームページを作成しました。",
    tags: ["WordPress", "#個人開発"],
    date: "2023-01"
  },
  {
    src: "/images/works/work_03.png",
    alt: "work03",
    title: "ホームページ（ウォーターサーバー）",
    description: "既存のサイトを刷新し、YouTube埋め込みやスライドショーなど新しい要素を取り入れました。",
    tags: ["HTML", "CSS", "#個人開発"],
    date: "2020-12"
  },
  {
    src: "/images/works/hackathon_01.png",
    alt: "hackathon01",
    title: "今日の飯決めアプリ",
    description: "その日の気分に合ったレシピを提案するアプリを開発しました。楽天レシピAPIのレスポンス時間を考慮しながら実装を進めました。",
    tags: ["Vue.js", "Docker", "#チーム開発"],
    date: "2021-05"
  },
  {
    src: "/images/works/hackathon_02.png",
    alt: "hackathon02",
    title: "チーム開発チュートリアルアプリ",
    description: "ハッカソンでのチームビルディングの課題を基に、役割分担やタスク共有を簡単に行えるアプリを開発しました。",
    tags: ["Laravel", "Docker", "#チーム開発"],
    date: "2021-10"
  },
  {
    src: "/images/works/hackathon_03.png",
    alt: "hackathon03",
    title: "Pythonで作るトランプゲーム",
    description: "Pythonでローカル環境で動作するトランプゲームを開発し、それを配布するためのWebサイトを構築しました。",
    tags: ["Laravel", "Python", "#チーム開発"],
    date: "2021-05"
  },
  {
    src: "/images/works/hobby_01.png",
    alt: "hobby01",
    title: "自己探究プログラム振り返りサイト",
    description: "参加したプログラムの内容やスライド、メンバー情報をまとめたサイトを作成しました。",
    tags: ["Vue.js", "#個人開発"],
    date: "2021-11"
  },
  {
    src: "/images/works/hobby_02.png",
    alt: "hobby02",
    title: "あのシーンの吹き出し加工ツール",
    description: "あの名シーンの感動を他の場面でも応用できるよう、吹き出しを自分好みに書き換えるツールを開発しました。",
    tags: ["HTML", "CSS", "#個人開発"],
    date: "2023-05"
  },
  {
    src: "/images/works/hobby_03.png",
    alt: "hobby03",
    title: "あのシーンの緊迫感体験ゲーム",
    description: "某アニメの名シーンを再現し、世界崩壊の緊迫感を体験できるパスワード推測ゲームを作成しました。",
    tags: ["Vue.js", "#個人開発"],
    date: "2023-08"
  },
  {
    src: "/images/works/hobby_04.png",
    alt: "hobby04",
    title: "ユニティちゃんのマリオ風ゲーム",
    description: "Unityの基礎を学ぶために、2Dのマリオ風ゲームを作成しました。ゲーム開発者の凄さを強く実感しました。",
    tags: ["Unity", "#個人開発"],
    date: "2021-08"
  }
];

export default function Page() {
  // 日付で降順ソート
  const sortedWorks = works.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return (
    <section className="skills">
      <PageFace
        title="実績・スキル"
        subtitle=""
        mainMessage={<>
        </>}
      />
      <div className="works px-6 md:px-20">
        <h2 className="text-2xl md:text-3xl font-bold">制作実績</h2>
        <div className="work-list grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center items-center my-10">
          {sortedWorks.map((work, index) => (
            <WorkCard
              key={index}
              src={work.src}
              alt={work.alt}
              title={work.title}
              description={work.description}
              tags={work.tags}
              date={work.date}
            />
          ))}
        </div>
      </div>
      <div className="skills px-6 md:px-20">
        <h2 className="text-2xl md:text-3xl font-bold">スキルタイムチャート</h2>
        <SkillTimeline />
      </div>
    </section>
  );
}