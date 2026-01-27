export type Line = {
  speaker: string
  text: string
  characters?: Character[]
  isChoice?: boolean
  choiceId?: string
}

export type Character = {
  image: string
  position?: 'left' | 'center' | 'right'
}

export type Choice = {
  text: string
  choiceId: string
}

export type Scene = {
  id: string
  background: string
  // bgm: string
  lines: Line[]
  characters?: Character[]
  options?: Choice[]
}

export const chapter2: { title: string; scenes: Scene[] } = {
  title: '不要な嗅覚',
  scenes: [
    {
      id: 'ch2_sc1',
      background: 'cafe_lunch',
      lines: [
        { speaker: '', text: '昼休み。' },
        { speaker: '', text: '社内のカフェテリアは、雨の日特有の、湿り気を含んだ空気で満ちていた。' },
        { speaker: '青葉', text: '「今日の雨、匂いが面白くないですか？」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '青葉が、少し身を乗り出して言った。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「土の香りが強くて……なんか、安心する感じで」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '（ペトリコール……）' },
        { speaker: '', text: '雨が乾いた地表のアスファルトや土に落ちた際、植物由来の油分や細菌が生成する物質がエアロゾルとなり、独特の匂いを発生させる現象。' },
        { speaker: '', text: '化学的なメカニズムは説明できる。' },
        { speaker: '', text: 'だが、仕事には１ミリも関係がない。' },
        { speaker: '', text: '周囲では、何人かの同僚が自然と青葉の話に耳を傾けている。' },
        { speaker: '社員', text: '「わかる」' },
        { speaker: '社員', text: '「なんか、落ち着くよね」' },
        { speaker: '社員', text: '「青葉ちゃんがいると、和むなあ」' },
        { speaker: '', text: '和む。' },
        { speaker: '', text: 'その曖昧な評価が、俺には理解できない。' },
        { speaker: '', text: '和んだところで、業務効率は上がらない。数字も出ない。' },
        { speaker: '', text: '俺は、その様子を一歩引いた位置から眺めながら、\n午後のスケジュールを脳内で再構築していた。' },
        { speaker: '', text: '彼女の周りだけ、時間がゆっくり流れている。\nそれは組織にとって、遅延となる危険性も持っている。' },
      ],
    },
    {
      id: 'ch2_sc2',
      background: 'office_morning',
      lines: [
        { speaker: '', text: '午後、トラブルの報告が入った。' },
        { speaker: '', text: '青葉が担当する顧客から、納期についての問い合わせが来ていたらしい。' },
        { speaker: '赤羽', text: '「青葉」' },
        { speaker: '青葉', text: '「赤羽さん」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「先方へのメール、見たぞ。\n『できる限り早く対応します』と書いてあるな」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「はい、少しでも安心してもらおうと思って」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「駄目だ」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「え？」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「『できる限り』という言葉は、相手に勝手な期待を抱かせる。\nいつになるか分からないという不安は、俺たちへの不信感につながる」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「ビジネスで必要なのは『優しさ』じゃない。『正確なコミット』だ」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「不確定な約束をするくらいなら、確実な納期を伝えて、相手に判断させるのが誠意だ」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '青葉がハッとした顔をする。',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「……私、ただ相手に喜んでほしくて……でも、それが逆に無責任だったんですね」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「そうだ。感情で仕事をすると、リスクになる。気をつけろ」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「はい……すみません」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'デスクに戻った青葉の背中は、いつもより一回り小さく見えた。' },
      ],
    },
    {
      id: 'ch2_sc3',
      background: 'bar_night',
      lines: [
        { speaker: '', text: '夜。同じ店。同じ席。'},
        { speaker: '黄瀬', text: '「あー、またフラれたわ」',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '黄瀬がスマホをいじりながらぼやく。',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「今度はなんだ」',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「『一緒にいても息が詰まる』だとよ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「俺さ、デートのコースも完璧に組んだんだぜ？\n移動時間も、店の予約も、映画の上映時間も。最短ルートで、一番効率よく楽しめるように」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '俺はグラスを傾ける。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「何が悪い。完璧じゃないか」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「だよなあ？でも、向こうは『迷子になる時間も楽しみたかった』とか言うわけよ」',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '黄瀬は枝豆の皮を放り投げる。',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「正解ルートを行くのが、必ずしも楽しいデートじゃないってことかねえ」',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '人間は面倒くさい。' },
        { speaker: '', text: 'だからこそ、仕事ではマニュアル化を徹底している。' },
        { speaker: '', text: '迷子にならないように。' },
        { speaker: '', text: 'それは、間違っていないはずだ。' },
      ],
    },
  ],
}
