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

export const chapter6a: { title: string; scenes: Scene[] } = {
  title: 'このまま進む（Aルート）',
  scenes: [
    {
      id: 'ch6a_sc1_success',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'プロジェクトは、驚くほど順調に進んだ。',
        },
        {
          speaker: '',
          text: '青葉は、以前よりも口数が減った。\n会議では余計な雑談を挟まず、要点だけを簡潔に話す。\n資料の提出は早くなり、修正も少ない。',
        },
        {
          speaker: '',
          text: '評価は、数字として現れた。',
        },
        {
          speaker: '上司',
          text: '「赤羽、今回の件は本当に助かった」',
        },
        {
          speaker: '上司',
          text: '「青葉も、よく育ってるな」',
        },
        {
          speaker: '赤羽',
          text: '俺は、ただ頷いた。',
        },
        {
          speaker: '',
          text: '育てたつもりはない。ただ、正しいと思うやり方を示しただけだ。',
        },
        {
          speaker: '',
          text: '青葉は、残業を引き受けるようになった。',
        },
        {
          speaker: '青葉',
          text: '「大丈夫です」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'そう言う回数が増えた。',
        },
        {
          speaker: '',
          text: 'それを、俺は成長だと解釈した。',
        },
      ],
    },
    {
      id: 'ch6a_sc2_change',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'ある日、ふと気づいた。',
        },
        {
          speaker: '',
          text: '青葉が、仕事で詰まったとき、誰にも相談していない。',
        },
        {
          speaker: '',
          text: '以前なら、意味のない前置きをしながら話しかけてきたはずだ。',
        },
        {
          speaker: '青葉',
          text: '「ちょっと聞いてほしいんですけど〜」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'そんな軽さは、もうない。',
        },
        {
          speaker: '赤羽',
          text: '（効率的になっただけだ）',
        },
        {
          speaker: '',
          text: '俺は、そう結論づけた。',
        },
        {
          speaker: '',
          text: '相談には時間がかかる。自分で解決できるなら、その方がいい。\nそれが社会のルールだ。',
        },
        {
          speaker: '',
          text: '青葉は、それを理解しただけだ。',
        },
      ],
    },
    {
      id: 'ch6a_sc3_last_night',
      background: 'night_coffee',
      lines: [
        {
          speaker: '',
          text: 'その日は、遅くまで雨が降っていた。終電が近づくオフィスで、青葉は一人、モニターに向かっていた。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「明日でもいいぞ」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'そう言った俺に、青葉は笑った。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「大丈夫です。すぐ終わるので」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'その笑顔に、違和感はなかった。',
        },
        {
          speaker: '',
          text: 'むしろ、仕事ができる部下の顔だった。',
        },
        {
          speaker: '',
          text: '俺は先に帰った。',
        },
      ],
    },
    {
      id: 'ch6a_sc4_morning',
      background: 'station_morning',
      lines: [
        {
          speaker: '',
          text: '翌朝、黄瀬から電話があった。その声は、妙に低かった。',
        },
        {
          speaker: '黄瀬',
          text: '「赤羽……青葉が……」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「...！」',
        },
        {
          speaker: '',
          text: '言葉を失った。',
        },
        {
          speaker: '',
          text: '帰宅途中、駅構内の工事エリアを通過した際の事故だったという。',
        },
        {
          speaker: '',
          text: '通路は仮設で、白いパネルと黄色い注意線で、最短距離が示されていた。',
        },
        {
          speaker: '',
          text: '遠回りの安全ルートもあった。',
        },
        {
          speaker: '',
          text: 'だが、案内表示は小さく、ほとんどの人は、表示された「最短」を選ぶ。',
        },
        {
          speaker: '',
          text: '青葉も、そうだった。',
        },
        {
          speaker: '',
          text: '急いでいたわけではない。',
        },
        {
          speaker: '',
          text: 'ただ、',
        },
        {
          speaker: '赤羽',
          text: '「そうするのが合理的だった」',
        },
        {
          speaker: '',
          text: 'それだけだった。',
        },
      ],
    },
    {
      id: 'ch6a_sc5_aoba_room',
      background: 'aoba_room',
      lines: [
        {
          speaker: '',
          text: '葬儀から数日後、俺は青葉の家を訪れた。',
        },
        {
          speaker: '',
          text: '仏壇は、青葉の部屋に置かれていた。',
        },
        {
          speaker: '',
          text: '手を合わせても、最初は何も言えなかった。',
        },
        {
          speaker: '',
          text: 'やがて、言葉が落ちる。',
        },
        {
          speaker: '赤羽',
          text: '「……青葉」',
        },
        {
          speaker: '',
          text: '声が、震えた。',
        },
        {
          speaker: '赤羽',
          text: '「……お前を殺したのは俺なのかもしれない」',
        },
        {
          speaker: '赤羽',
          text: '「お前の、あの……"無駄"なところを」',
        },
        {
          speaker: '',
          text: '無邪気で、遠回りで、説明できない部分を。',
        },
        {
          speaker: '',
          text: '正しさの名の下に。仕事のためだと信じて。',
        },
        {
          speaker: '赤羽',
          text: '「それを……謝りに来た」',
        },
        {
          speaker: '',
          text: '仏壇は、何も答えなかった。',
        },
      ],
    },
    {
      id: 'ch6a_sc6_years_later',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'それから、数年が経った。',
        },
        {
          speaker: '',
          text: '俺は、別の部署に移り、部下のやり方に、以前ほど口を出さなくなった。',
        },
        {
          speaker: '',
          text: '評価は、ほどほどだった。それでいいと思っている。',
        },
      ],
    },
    {
      id: 'ch6a_sc7_aoba_room',
      background: 'aoba_room',
      lines: [
        {
          speaker: '',
          text: 'ある休日、ふと、線香をあげに青葉の実家を訪ねた。',
        },
        {
          speaker: '',
          text: '仏壇は、今も青葉の部屋にあった。部屋は、当時のままだった。',
        },
        {
          speaker: '',
          text: '本棚には、仕事関係の本が並んでいる。',
        },
        {
          speaker: '',
          text: '机のディスプレイには、無数の付箋が貼られていた。',
        },
        {
          speaker: '',
          text: '色とりどりの、小さな紙。',
        },
        {
          speaker: '',
          text: '近づいて、気づく。',
        },
        {
          speaker: '',
          text: 'そこに書かれていたのは——',
        },
        {
          speaker: '',
          text: '俺の言葉だった。',
        },
        {
          speaker: '',
          text: '「フォーマットを使えば早い」',
        },
        {
          speaker: '',
          text: '「詰まったら早めに相談」',
        },
        {
          speaker: '',
          text: '「相手の都合を優先する」',
        },
        {
          speaker: '',
          text: '走り書きで、何度も、何度も。',
        },
        {
          speaker: '',
          text: '俺は、その場に立ち尽くした。',
        },
        {
          speaker: '赤羽',
          text: '（……守ろうとしていたんだ）',
        },
        {
          speaker: '',
          text: '自分なりに。必死に。',
        },
        {
          speaker: '',
          text: '涙が、出た。止まらなかった。',
        },
      ],
    },
    {
      id: 'ch6a_sc8_aoba_room',
      background: 'aoba_room',
      lines: [
        {
          speaker: '',
          text: '青葉の両親は、穏やかだった。母親が言った。',
        },
        {
          speaker: '母親',
          text: '「この子、仕事が楽しかったみたいです」',
        },
        {
          speaker: '',
          text: '父親も、頷く。',
        },
        {
          speaker: '父親',
          text: '「毎日、ノートに書いてましたよ。赤羽さんのことも、よく話してました」',
        },
        {
          speaker: '',
          text: '責める声は、なかった。むしろ、頭を下げられた。',
        },
        {
          speaker: '母親',
          text: '「ありがとうございました」',
        },
        {
          speaker: '',
          text: '俺は、何も言えなかった。',
        },
      ],
    },
    {
      id: 'ch6a_sc9_end',
      background: 'rain_road',
      lines: [
        {
          speaker: '',
          text: '帰り道、あの通路のことを思い出す。',
        },
        {
          speaker: '',
          text: '最短距離。合理的な選択。',
        },
        {
          speaker: '',
          text: 'それ自体は、間違いじゃない。',
        },
        {
          speaker: '',
          text: 'でも、',
        },
        {
          speaker: '',
          text: '世界には、少し遠回りしても壊れない道がある。',
        },
        {
          speaker: '',
          text: '俺は、それを教えられなかった。',
        },
        {
          speaker: '',
          text: 'それだけだ。',
        },
        {
          speaker: '',
          text: 'それでも——',
        },
        {
          speaker: '',
          text: '青葉は、自分なりに、生きていた。',
        },
        {
          speaker: '',
          text: 'それを知れたことが、俺の、唯一の救いだった。',
        },
      ],
    },
  ],
}

