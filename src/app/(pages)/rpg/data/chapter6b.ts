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
  title: '雑音のファンファーレ',
  scenes: [
    {
      id: 'ch6b_sc1',
      background: 'client_room',
      lines: [
        { speaker: '', text: '青葉が答えあぐねている。',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '「正解」を言おうとして、唇が震えている。',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '（違う）' },
        { speaker: '', text: '俺は直感する。この相手に、その嘘は通用しない。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「……恐れ入ります、専務」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '俺は青葉の言葉を遮った。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「担当の青葉は、実は別の懸念を持っていました」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '青葉が驚いて俺を見る。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「彼女は現場を回り、効率化の裏で『現場のモチベーションが下がるリスク』を報告書にまとめていました。……それを『数字にならない』と弾いたのは私です」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '三枝', text: '「ほう？」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「青葉。……例の、ボツにした案。口頭でいい、説明できるか」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '俺が促すと、青葉は一瞬戸惑い、すぐに覚悟を決めた目を向けた。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「は、はい！……\n実は、現場の方々は、休憩所の配置と動線について、非効率でも今のままがいいと……」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '青葉が語り出す。数字には表れない、現場の「匂い」の話。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'それは、スマートなプレゼンではなかった。'},
        { speaker: '', text: 'だが、三枝氏の重心が少しだけ、前に傾いたように感じた。' },
        { speaker: '', text: '返答は後日いただくことを確認し、俺たちはビルを後にした。' },
      ],
    },
    {
      id: 'ch6b_sc3',
      background: 'office_morning',
      lines: [
        { speaker: '', text: '結局、商談は成立しなかった。' },
        { speaker: '', text: '上司に詰められる。' },
        { speaker: '上司', text: '「なぜ、あの形のままで進めなかった？」' },
        { speaker: '', text: '俺は、説明する。' },
        { speaker: '', text: '長期的な信頼。クライアントが抱く"言葉にならない違和感"。戦略としての限界点。' },
        { speaker: '', text: '上司は、納得していない表情のまま去っていった。' },
        { speaker: '', text: '評価は、下がる。' },
      ],
    },
    {
      id: 'ch6b_sc4',
      background: 'night_platform',
      lines: [
        { speaker: '', text: '夜。駅まで青葉と並んで歩く。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「……すまなかったな」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '青葉は、首を振る。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「いいと思います」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「たぶん、あれ、うまくいっても、あとで壊れてました」',
          characters: [
            {
              image: 'aoba_3.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '根拠はない。でも、青葉はそう感じている。' },
        { speaker: '', text: '俺は、初めて思う。' },
        { speaker: '赤羽', text: '（正しさは、後から証明されるものじゃない）' },
        { speaker: '', text: '駅のホームから見上げた空には、いつもより多くの星が輝いて見えた。' },
      ],
    },
  ],
}
