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
  title: '100点満点の地獄',
  scenes: [
    {
      id: 'ch6a_sc1',
      background: 'client_room',
      lines: [
        { speaker: '', text: '青葉の視線が泳ぐ。俺を見る。',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '俺は、無言で頷く。',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '（余計なことを言うな。論理で返せ）',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '青葉は、表情を引き締めた。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '感情を殺し、「正解」を口にする。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「……はい。現場の方々にとっても、業務効率化は長期的な利益になると確信しております。一時的な負担よりも、将来的な数値を優先すべきかと」',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '完璧な回答だ。ビジネスとして、何も間違っていない。',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '三枝氏は、数秒間、青葉を見ていた。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '表情からは、何も読み取れない。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '三枝', text: '「そうか」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '三枝', text: '「よくわかったよ。……忙しい中、来てもらって悪かったね」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '立ち上がる三枝氏。'},
        { speaker: '青葉', text: '「え、あの、契約の件は……」',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '三枝', text: '「後ほど、佐々木から連絡させるよ」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '背中越しに、扉が閉まる音だけが響いた。' },
        { speaker: '', text: '拒絶だ。' },
        { speaker: '', text: '怒鳴られるよりも深く、冷たい拒絶。' },
        { speaker: '', text: '「御社には心がない」と言葉で言われるまでもない。' },
        { speaker: '', text: '俺たちは、静かに「不要だ」と判断されたのだ。' },
      ],
    },
    {
      id: 'ch6a_sc3',
      background: 'rain_road',
      lines: [
        { speaker: '青葉', text: '「……完璧な回答だったはずです」',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '帰り道、青葉がつぶやく。',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
         },
        { speaker: '赤羽', text: '「そうだな」',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '俺は答える。',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '契約は取れないだろう。だが、俺たちのやり方は間違っていない。' },
        { speaker: '', text: '間違っていたのは、相手の情緒的な判断基準だ。' },
        { speaker: '', text: 'そう自分を正当化しようとするが、喉の奥が焼けるように渇く。' },
        { speaker: '', text: '隣にいる青葉は、もう動揺していない。' },
        { speaker: '青葉', text: '「次は、もっと感情論を排除した資料を用意します」',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '淡々と言う彼女を見て、俺は悟る。',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'この先、俺たちはどんなに成功しても、',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'あの三枝氏のような人間とは、分かりあうことはできない。',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '砂を噛むような日々が、永遠に続くのだと。' },
      ],
    },
  ],
}
