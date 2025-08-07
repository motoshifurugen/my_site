const history = [
  { year: '1998年', description: '沖縄に生まれる' },
  {
    year: '2017年',
    description: '高校卒業後、理学部物理学科へ進学する',
  },
  { year: '2020年', description: '大学休学中にプログラミングを始める' },
  { year: '2021年', description: '長期インターンでWebエンジニアを経験する' },
  { year: '2023年', description: '大学卒業後、エンジニアとして就職する' },
  { year: '〜 現在', description: 'フロントエンドエンジニアとして奮闘中' },
]

export const articles = [
  {
    title: 'Carrer',
    content: (
      <div className="flex flex-col space-y-4 md:space-y-0">
        {history.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row md:items-start">
            <p className="mr-6 text-left">{item.year}</p>
            <p className="pl-2 md:pl-0">{item.description}</p>
          </div>
        ))}
      </div>
    ),
    imageSrc: '/images/profile_01.jpg',
    imageAlt: 'profile img 01',
  },
  {
    title: 'Interest',
    content: (
      <p>
        物理学が目に見えない自然の法則を解き明かすように、
        プログラミングによってデータという見えない情報を扱うことに楽しさを感じています。
        <br />
        一方で、サービスを通してつながるエンドユーザーへの意識の重要性も感じています。
        デザインやジェネラティブアートにも関心があり、ワクワクするようなユーザー体験を提供したいです。
        <br />
        自分自身、強いメンタルの持ち主ではないので、メンタルヘルスも大切にしています。
      </p>
    ),
    imageSrc: '/images/profile_02.png',
    imageAlt: 'profile img 02',
  },
  {
    title: 'Passion',
    content: (
      <ul>
        <li>・読書　　　：不定期で友達と読書会を開催しています。</li>
        <li>・短歌　　　：Xで気ままに200首以上の短歌を書いています。</li>
        <li>・散歩　　　：朝・昼・晩の散歩が日課です。</li>
        <li>・ドライブ　：目的地もなく運転します。</li>
        <li>・エイサー　：沖縄の伝統芸能です。</li>
        <li>・ギター　　：アルペジオ練習中です。</li>
        <li>・野球　　　：外野専門です。プロ野球を見るのも好きです。</li>
        <li>・ダーツ　　：19が好きです。</li>
        <li>・ボウリング：ハウスボールを曲げたがりです。</li>
      </ul>
    ),
    imageSrc: '/images/profile_03.jpg',
    imageAlt: 'profile img 03',
  },
  {
    title: 'MBTI',
    content: (
      <p>
        <strong>INFP-A</strong>（仲介者）
        <br />
        <br />
        内向型（I）：散歩や読書など、一人で過ごす時間が好き
        <br />
        直感型（N）：短歌やエイサーなど、創造や表現活動が好き
        <br />
        感情型（F）：自分にも他人にも感情の変化に興味あり
        <br />
        探索型（P）：考えるまでに行動してみて調整していくスタイル
        <br />
        自己主張的（A）：常に心に根拠なき自信がある
      </p>
    ),
    imageSrc: '/images/profile_04.jpg',
    imageAlt: 'profile img 04',
  },
]
