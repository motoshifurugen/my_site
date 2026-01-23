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

export const chapter6b: { title: string; scenes: Scene[] } = {
  title: '青葉と話す（Bルート）',
  scenes: [
    {
      id: 'ch6b_sc1_talk',
      background: 'cafe_lunch',
      lines: [
        {
          speaker: '',
          text: '仕事終わり、俺は青葉を呼び止める。',
        },
        {
          speaker: '赤羽',
          text: '「青葉、少し……時間あるか」',
        },
        {
          speaker: '',
          text: '青葉は、少し驚いた顔をしてから、すぐにいつもの調子で笑う。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「ありますよ。今日、わりと早く終わったので」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '静かなカフェ。',
        },
        {
          speaker: '',
          text: '仕事の話をするには、少しだけ柔らかすぎる場所。',
        },
        {
          speaker: '',
          text: '青葉が先に口を開く。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「……赤羽さん」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '少し、真面目な声。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「私、最近……評価、上がりました」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'それは、事実だった。上司の反応も、周囲の視線も、変わっている。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「赤羽さんのおかげです」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '俺は、胸が詰まる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「効率とか、優先順位とか……正直、最初は全然わからなかったです」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「今も、たぶん遅いですけど」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '俺は、視線を落とす。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「……青葉」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「俺は」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '少し、間を置く。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「お前のやり方を、否定した」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「それが正しいと、思ってた」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '青葉は、きょとんとする。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「でも……あれは、俺の都合だった」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '合理性。評価。自分が信じてきた"安全な生き方"。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「お前の"無駄なところ"を、俺は、邪魔だと思った」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '言葉にした瞬間、逃げ場がなくなる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '青葉は、すぐには何も言わない。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'ストローで、氷をつつく。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「……うーん」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '少し考えてから、言う。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「たしかに、やりづらくなったところはあります」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '正直だ。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「でも」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '顔を上げる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「全部、嫌だったわけじゃないです」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「評価されるの、嬉しかったですし」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「そうですね……お詫びとして」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '青葉が、にやっと笑う。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「駅前のシュークリーム、奢ってください」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '重くなりすぎた空気が、少しだけ緩む。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
      ],
    },
    {
      id: 'ch6b_sc5_change',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'それ以降、俺は少しずつ変わっていった。',
        },
        {
          speaker: '',
          text: '青葉に「相談してから決める」場面が増えた',
        },
        {
          speaker: '',
          text: '即断せず、「別のやり方」を一度考えるようになった',
        },
        {
          speaker: '',
          text: '正解が一つだと決めつけなくなった',
        },
        {
          speaker: '',
          text: 'ただし、結果は常に良いわけではない。',
        },
      ],
    },
    {
      id: 'ch6b_sc6_failure',
      background: 'meeting_room',
      lines: [
        {
          speaker: '',
          text: '以前、効率重視で進めていれば成功していたかもしれない商談。',
        },
        {
          speaker: '',
          text: '遠回りを選んだ結果、\nクライアントから断りの連絡が入った。',
        },
        {
          speaker: '',
          text: '上司に詰められる。',
        },
        {
          speaker: '上司',
          text: '「なぜ、あの形のままで進めなかった？」',
        },
        {
          speaker: '',
          text: '俺は、説明する。\n関係性。長期的な信頼。クライアントが抱く"言葉にならない違和感"。',
        },
        {
          speaker: '',
          text: '上司は、納得していない表情のまま去っていった。',
        },
        {
          speaker: '',
          text: '評価は、下がる。',
        },
      ],
    },
    {
      id: 'ch6b_sc7_acceptance',
      background: 'rain_road',
      lines: [
        {
          speaker: '',
          text: '帰り道、青葉と並んで駅まで歩く。',
        },
        {
          speaker: '赤羽',
          text: '「……すまなかったな」',
        },
        {
          speaker: '',
          text: '青葉は、首を振る。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「いいと思います」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「たぶん、あれ、うまくいっても、あとで壊れてました」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '根拠はない。でも、青葉はそう感じている。',
        },
        {
          speaker: '',
          text: '俺は、初めて思う。',
        },
        {
          speaker: '赤羽',
          text: '（正しさは、後から証明されるものじゃない）',
        },
      ],
    },
    {
      id: 'ch6b_sc8_end',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: '評価は落ちたが、俺は、自分を責めていない。',
        },
        {
          speaker: '',
          text: '正しさを疑った。それだけだ。',
        },
        {
          speaker: '',
          text: '青葉は、相変わらず仕事が遅く、相変わらずよく喋る。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'それでも——',
        },
        {
          speaker: '',
          text: '職場は、少しだけ、長く続きそうな空気になった。',
        },
        {
          speaker: '赤羽',
          text: '（正しさを選ばなかった日を、俺は、失敗だとは思わない）',
        },
      ],
    },
  ],
}


