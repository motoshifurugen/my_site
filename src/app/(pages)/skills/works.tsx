// works.ts
import { ReactElement } from 'react'
import { BiLinkExternal } from 'react-icons/bi'

type Work = {
  src: string
  alt: string
  title: string | ReactElement
  description: string
  tags: string[]
  date: string
}

const works: Work[] = [
  {
    src: '/images/works/work_01.png',
    alt: 'work01',
    title: 'ホームページ（地元スーパー）',
    description:
      '地元スーパーのホームページを作成しました。スマホユーザーを主なターゲットとし、レスポンシブデザインを採用しました。',
    tags: ['Vue.js', 'Laravel'],
    date: '2022-12',
  },
  {
    src: '/images/works/work_02.png',
    alt: 'work02',
    title: 'ホームページ（デイサービス施設）',
    description:
      'エンジニアでなくても運用できるようにとの要望を受け、WordPressを使って新たにホームページを作成しました。',
    tags: ['WordPress'],
    date: '2023-01',
  },
  {
    src: '/images/works/work_03.png',
    alt: 'work03',
    title: 'ホームページ（ウォーターサーバー）',
    description:
      '既存のサイトを刷新し、YouTube埋め込みやスライドショーなど新しい要素を取り入れました。',
    tags: ['HTML', 'CSS'],
    date: '2020-12',
  },
  {
    src: '/images/works/hackathon_01.png',
    alt: 'hackathon01',
    title: '今日の飯決めアプリ',
    description:
      'その日の気分に合ったレシピを提案するアプリを開発しました。楽天レシピAPIのレスポンス時間を考慮しながら実装を進めました。',
    tags: ['Vue.js', 'Docker', '#チーム開発'],
    date: '2021-05',
  },
  {
    src: '/images/works/hackathon_02.png',
    alt: 'hackathon02',
    title: 'チーム開発チュートリアルアプリ',
    description:
      'ハッカソンでのチームビルディングの課題を基に、役割分担やタスク共有を簡単に行えるアプリを開発しました。',
    tags: ['Laravel', 'Docker', '#チーム開発'],
    date: '2021-10',
  },
  {
    src: '/images/works/hackathon_03.png',
    alt: 'hackathon03',
    title: 'Pythonで作るトランプゲーム',
    description:
      'Pythonでローカル環境で動作するトランプゲームを開発し、それを配布するためのWebサイトを構築しました。',
    tags: ['Laravel', 'Python', '#チーム開発'],
    date: '2021-05',
  },
  {
    src: '/images/works/hobby_01.png',
    alt: 'hobby01',
    title: '自己探究プログラム振り返りサイト',
    description:
      '参加したプログラムの内容やメンバー情報などをまとめたサイトを作成しました。動くドット絵の背景が好評でした。',
    tags: ['Vue.js', '#個人開発'],
    date: '2021-11',
  },
  {
    src: '/images/works/hobby_02.png',
    alt: 'hobby02',
    title: 'あのシーンの吹き出し加工ツール',
    description:
      'あの名シーンの感動を他の場面でも応用できるよう、吹き出しを自分好みに書き換えるツールを開発しました。',
    tags: ['HTML', 'CSS', '#個人開発'],
    date: '2023-05',
  },
  {
    src: '/images/works/hobby_03.png',
    alt: 'hobby03',
    title: 'あのシーンの緊迫感体験ゲーム',
    description:
      '某アニメの名シーンを再現して世界崩壊の緊迫感を体験できる、ヌメロン形式のパスワード推測ゲームを作成しました。',
    tags: ['Vue.js', '#個人開発'],
    date: '2023-08',
  },
  {
    src: '/images/works/hobby_04.png',
    alt: 'hobby04',
    title: 'ユニティちゃんのマリオ風ゲーム',
    description:
      'Unityの基礎を学ぶために、2Dのマリオ風ゲームを作成しました。ゲーム開発者の凄さを強く実感しました。',
    tags: ['Unity', '#個人開発'],
    date: '2021-08',
  },
  {
    src: '/images/works/hobby_05.png',
    alt: 'hobby05',
    title: '開発ポートフォリオサイト',
    description:
      'Reactを使ったブログサイト構築を目指し、ジェネラティブアートの使用やゲーム画面など、遊び心もこめて作成しました。',
    tags: ['React', 'Next.js', 'Vercel'],
    date: '2025-01',
  },
  {
    src: '/images/works/work_04.png',
    alt: 'work04',
    title: (
      <a
        href="https://kobayashi2103.co.jp/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1"
      >
        ホームページ（不動産会社）
        <BiLinkExternal className="inline-block" />
      </a>
    ),
    description:
      'Figmaでのデザイン作成から機能提案まで、依頼者の要望を反映したホームページを作成しました。',
    tags: ['Figma', 'Next.js', 'Vercel'],
    date: '2025-03',
  },
  {
    src: '/images/works/hobby_06.png',
    alt: 'hobby06',
    title: (
      <a
        href="https://apps.apple.com/us/app/hugmi-%E3%83%8F%E3%82%B0%E3%83%9F%E3%83%BC/id6745621864"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1"
      >
        朝のルーティン スマホアプリ
        <BiLinkExternal className="inline-block" />
      </a>
    ),
    description:
      '朝が苦手な自分を救うために、名言で始まる朝のルーティンアプリを作成しました。開発したのはほぼAIです。',
    tags: ['React Native', 'Expo', '#Cursor開発'],
    date: '2025-05',
  },
]

// 日付で降順ソート
const sortedWorks = works.sort((a, b) => {
  const dateA = new Date(a.date).getTime()
  const dateB = new Date(b.date).getTime()
  return dateB - dateA
})

export { sortedWorks }
