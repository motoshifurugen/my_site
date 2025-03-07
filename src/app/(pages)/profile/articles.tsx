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
        データという見えない情報を扱うことに楽しさを感じています。
        <br />
        最近はバックエンドやネットワーク分野に興味があり、
        今年はネットワークスペシャリストの資格に挑戦します。
        <br />
        心が強い方ではないので、メンタルヘルスも大切にしています。
      </p>
    ),
    imageSrc: '/images/profile_02.png',
    imageAlt: 'profile img 02',
  },
  {
    title: 'Hobby',
    content: (
      <p>
        読書（ビジネス書中心） ・ 短歌 ・ 散歩 ・ ドライブ ・
        エイサー（沖縄の伝統芸能） ・ ギター（アコースティック） ・ 野球 ・
        ダーツ ・ ボウリング <br />
        ... and more
      </p>
    ),
    imageSrc: '/images/profile_03.jpg',
    imageAlt: 'profile img 03',
  },
]
