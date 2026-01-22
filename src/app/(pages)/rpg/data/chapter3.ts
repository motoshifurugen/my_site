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

export const chapter3: { title: string; scenes: Scene[] } = {
  title: '正しさが壊したもの',
  scenes: [
    {
      id: 'ch3_sc1_morning_walk',
      background: 'station_morning',
      lines: [
        {
          speaker: '',
          text: '朝。駅からオフィスまでの道を、俺は昨日と同じ速度で歩く。',
        },
        {
          speaker: '',
          text: '人の流れも、信号の間隔も、すべて想定通りだ。',
        },
        {
          speaker: '',
          text: '（遅延なし。問題なし）',
        },
        {
          speaker: '',
          text: 'そう判断しながら、なぜか胸の奥が、ざらつく。',
        },
      ]
    },
    {
      id: 'ch3_sc2_office_morning',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'オフィスに着くと、青葉はすでに席にいた。キーボードを打つ手は、以前より早い。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '無駄な装飾は減り、画面には、会社指定のフォーマットが並んでいる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「赤羽さん、おはようございます」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '声は明るい。だが、どこか平坦だ。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「おはよう」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '俺はそれだけ返す。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '問題はない。むしろ、理想的だ。',
        },
        {
          speaker: '',
          text: '――なのに。',
        },
      ],
    },
    {
      id: 'ch3_sc3_blue_leaf',
      background: 'blue_leaf',
      lines: [
        {
          speaker: '',
          text: '青葉のデスク脇にあった小さな鉢植えが、いつの間にかなくなっていることに気づく。',
        },
        {
          speaker: '赤羽',
          text: '（……片付けたのか）',
        },
        {
          speaker: '',
          text: '合理的だ。業務に不要なものは、置かない方がいい。',
        },
        {
          speaker: '',
          text: 'そう結論づけたはずなのに、視線が、何度もその空白に戻ってしまう。',
        },
      ],
    },
    {
      id: 'ch3_sc4_meeting',
      background: 'meeting_room',
      lines: [
        {
          speaker: '',
          text: '午後の定例会議。青葉がまとめた資料が、スクリーンに映し出される。',
        },
        {
          speaker: '',
          text: '無駄がない。要点は明確で、指摘すべき誤字もない。',
        },
        {
          speaker: '',
          text: '上司が頷く。',
        },
        {
          speaker: '上司',
          text: '「いいね。ずいぶん洗練された」',
        },
        {
          speaker: '上司',
          text: '「赤羽の指導の成果だな」',
        },
        {
          speaker: '',
          text: '俺は軽く頭を下げる。',
        },
        {
          speaker: '',
          text: 'そうだ。これは、正しい結果だ。\n青葉も、メモを取りながら淡々と説明を続けている。',
        },
        {
          speaker: '',
          text: '以前のように、余談は挟まない。誰かの表情を気にして、話を止めることもない。',
        },
        {
          speaker: '',
          text: '会議は、予定より五分早く終わった。',
        },
        {
          speaker: '',
          text: '効率的。非の打ちどころはない。',
        },
        {
          speaker: '',
          text: 'それなのに。',
        },
        {
          speaker: '',
          text: '拍手の音が、どこか遠くに聞こえた。',
        },
      ],
    },
    {
      id: 'ch3_sc5_cafe_lunch',
      background: 'cafe_lunch',
      lines: [
        {
          speaker: '',
          text: '昼休み。カフェテリア。青葉は一人で座り、スマートフォンを見ている。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '以前なら、誰かに話しかけたり、天気の話を振ったりしていたはずだ。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「……」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '声をかけようとして、やめる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '（今は、業務時間外だ）',
        },
        {
          speaker: '',
          text: 'そう線を引いたのは、俺自身だ。',
        },
        {
          speaker: '',
          text: '隣のテーブルで、同僚が小声で話している。',
        },
        {
          speaker: '同僚',
          text: '「最近、青葉ちゃん静かだよね」',
        },
        {
          speaker: '同僚',
          text: '「仕事は早くなったけど」',
        },
        {
          speaker: '同僚',
          text: '「前の方が、なんか……」',
        },
        {
          speaker: '',
          text: '言葉が、途中で途切れる。',
        },
        {
          speaker: '',
          text: '俺は、トレーを持つ手に力が入るのを感じた。',
        },
        {
          speaker: '赤羽',
          text: '（成長しているだけだ）',
        },
        {
          speaker: '',
          text: 'そう思おうとした瞬間、胸の奥で、何かが噛み合わない音を立てた。',
        },
        {
          speaker: '',
          text: '――違う。',
        },
        {
          speaker: '',
          text: 'これは、成長じゃない。',
        },
        {
          speaker: '',
          text: '削った結果だ。',
        },
        {
          speaker: '',
          text: '誰が削った？',
        },
        {
          speaker: '',
          text: '答えは、考えるまでもなかった。',
        },
      ],
    },
    {
      id: 'ch3_sc6_realization',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'デスクに戻り、青葉から届いたメールを開く。\n件名。本文。署名。すべてが、完璧に整っている。',
        },
        {
          speaker: '',
          text: 'フォーマット通り。無駄な一文もない。',
        },
        {
          speaker: '赤羽',
          text: '（……俺が望んだ形だ）',
        },
        {
          speaker: '',
          text: 'そう思った瞬間、指が止まる。',
        },
        {
          speaker: '',
          text: 'あの独自の言い回しも、回り道のような気遣いも、どこにもない。',
        },
        {
          speaker: '',
          text: '俺は――',
        },
        {
          speaker: '',
          text: 'そこで、はっきりと理解する。',
        },
        {
          speaker: '',
          text: '自分の正しさが、青葉の世界を、少しずつ殺していた。',
        },
        {
          speaker: '',
          text: '予感ではない。これは、確信だ。',
        },
        {
          speaker: '',
          text: '怒鳴っていない。否定もしていない。',
        },
        {
          speaker: '',
          text: 'ただ、「正しいやり方」を提示し続けただけだ。',
        },
        {
          speaker: '',
          text: 'それでも。\n結果として、彼女は俺の形に作り替えられた。',
        },
        {
          speaker: '',
          text: 'それが、壊れるということだと、この瞬間まで、俺は理解していなかった。',
        },
      ],
    },
    {
      id: 'ch3_sc5_night_bar',
      background: 'bar_night',
      lines: [
        {
          speaker: '',
          text: '夜。いつもの店。黄瀬が、ビールを一口飲んでから言う。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「青葉、変わったな」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '俺は、答えない。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「悪い意味じゃないぞ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「でもさ……赤羽、お前さ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '少しだけ、言葉を選ぶ間があって、黄瀬は続ける。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「自分を信じるの、得意すぎるんだよ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'その一言が、胸の奥に、深く突き刺さる。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「……それが、俺のやり方だ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '絞り出すように言う。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「間違えないために、自分を信じてきた」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '黄瀬は、否定しない。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'ただ、静かに言う。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「正しいってさ、誰も傷つけないって意味じゃない」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'グラスの中の氷が、音を立てて溶ける。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '俺は、その音を聞きながら、ようやく気づく。',
        },
        {
          speaker: '',
          text: '――守ってきたはずの信念が、一番大切なところを、内側から壊していたことに。',
        },
      ],
    },
    {
      id: 'ch3_sc7_way_road',
      background: 'rain_road',
      lines: [
        {
          speaker: '',
          text: '家に帰る途中、雨が、降り始める。',
        },
        {
          speaker: '',
          text: 'アスファルトに落ちる音を聞きながら、俺は思う。',
        },
        {
          speaker: '',
          text: '自分を信じてきた。それは、嘘じゃない。',
        },
        {
          speaker: '',
          text: 'でも、',
        },
        {
          speaker: '',
          text: '信じ続けることで、見なくていいものを、見ないままにしてきた。',
        },
        {
          speaker: '',
          text: 'それが、取り返しのつかないことだと、もう、分かってしまった。',
        },
      ],
    },
  ],
}

