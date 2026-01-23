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

export const chapter6c: { title: string; scenes: Scene[] } = {
  title: '黄瀬に相談する（Cルート）',
  scenes: [
    {
      id: 'ch6c_sc1_consult',
      background: 'bar_night',
      lines: [
        {
          speaker: '',
          text: '帰り際に、黄瀬を飲みに誘う。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「黄瀬……ちょっと相談したいことがある」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '黄瀬は軽く笑う。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「青葉か？」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '俺はうなずく。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '黄瀬は、想定内といった顔で言う。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「そう思ったから、青葉も誘ってある。三人で飲もう」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'どうやら俺は、黄瀬のことを、甘く見ていたようだ。',
        }
      ],
    },
    {
      id: 'ch6c_sc2_drinking',
      background: 'bar_night',
      lines: [
        {
          speaker: '',
          text: '居酒屋。テーブルは三角形。青葉、黄瀬、そして、俺。\nぎこちない空気。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'left',
            },
            {
              image: 'kise_1.png',
              position: 'right',
            },
          ],
        },
        {
          speaker: '',
          text: '黄瀬が仕切る。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'left',
            },
            {
              image: 'kise_1.png',
              position: 'right',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「さあ、今日の主役は赤羽だ。話せ！」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'left',
            },
            {
              image: 'kise_1.png',
              position: 'right',
            },
          ],
        },
        {
          speaker: '',
          text: '青葉は、笑顔でグラスを持ち上げる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'left',
            },
            {
              image: 'kise_1.png',
              position: 'right',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「赤羽さん、何話すんですか？」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'left',
            },
            {
              image: 'kise_1.png',
              position: 'right',
            },
          ],
        },
        {
          speaker: '',
          text: '俺は一瞬言葉に詰まるが、黄瀬の視線を受け、少しずつ吐き出す。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'left',
            },
            {
              image: 'kise_1.png',
              position: 'right',
            },
          ],
        },
        {
          speaker: '',
          text: '自分の合理的判断で青葉のやり方を変えてしまったこと',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'left',
            },
            {
              image: 'kise_1.png',
              position: 'right',
            },
          ],
        },
        {
          speaker: '',
          text: '仕事上の効率を優先して、青葉の無邪気さや感性を押さえたこと',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'left',
            },
            {
              image: 'kise_1.png',
              position: 'right',
            },
          ],
        },
        {
          speaker: '',
          text: '青葉は静かに聞く。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'left',
            },
            {
              image: 'kise_1.png',
              position: 'right',
            },
          ],
        },
      ],
    },
    {
      id: 'ch6c_sc3_essence',
      background: 'bar_night',
      lines: [
        {
          speaker: '',
          text: '俺が話し終えた後、青葉が笑う。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            }
          ],
        },
        {
          speaker: '青葉',
          text: '「……赤羽さん、真面目すぎます」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            }
          ],
        },
        {
          speaker: '青葉',
          text: '「私は、仕事とプライベートで使い分けていただけです。\n仕事では効率的に振る舞うけど、普段は相変わらずおしゃべりで、遅いんですよ」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            }
          ],
        },
        {
          speaker: '',
          text: '俺は初めて、青葉の本当の性格を知る。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            }
          ],
        },
        {
          speaker: '',
          text: '無邪気さ、おしゃべり、理論では説明できない存在感',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            }
          ],
        },
        {
          speaker: '赤羽',
          text: '「死んでいなかった」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            }
          ],
        },
        {
          speaker: '',
          text: '——その感覚が、胸の奥で静かに広がる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            }
          ],
        },
        {
          speaker: '青葉',
          text: '「勝手に、殺さないでください。」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            }
          ],
        },
        {
          speaker: '',
          text: '俺は黄瀬と笑いながら、グラスを乾杯する。',
        }
      ],
    },
    {
      id: 'ch6c_sc5_change',
      background: 'station_morning',
      lines: [
        {
          speaker: '',
          text: '俺は、徐々に変わる。',
        },
        {
          speaker: '',
          text: '通勤ルートを変えてみる',
        },
        {
          speaker: '',
          text: '青葉の誘いで社員飲みに参加する',
        },
        {
          speaker: '',
          text: '効率や正しさだけで判断せず、状況に応じて柔軟に選択する',
        },
        {
          speaker: '',
          text: '青葉は以前のまま、無邪気で、おしゃべりで、遅い。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'それでも、俺はその存在によって少しだけ世界を広げられた感覚を抱く。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '（正しさも大事だけど、誰かの存在を壊さないことも大事だ）',
        },
        {
          speaker: '',
          text: '評価も効率も、失うことがある。',
        },
        {
          speaker: '',
          text: 'でも、人の本質は、失われない。',
        },
        {
          speaker: '',
          text: '無邪気に笑いながら、仕事中にも関わらず、話しかける新人がいる。',
        },
        {
          speaker: '青葉',
          text: '「赤羽さん、聞いてくださいよ。今日も面白いことが…」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '（これが、正しいかどうかじゃない。大事なのは、この瞬間を失わないことだ）',
        },
      ],
    },
  ],
}


