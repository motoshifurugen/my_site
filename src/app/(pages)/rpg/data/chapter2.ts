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
  title: '違和感の輪郭',
  scenes: [
    {
      id: 'ch2_sc1_cafe_lunch',
      background: 'cafe_lunch',
      lines: [
        {
          speaker: '',
          text: '昼休み。\n社内のカフェテリアは、雨の日特有の湿り気を含んだ空気で満ちていた。',
        },
        { speaker: '青葉', text: '「今日の雨、匂いが面白くないですか？」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
         },
        { speaker: '', text: '青葉が、少し身を乗り出して言う。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
         },
        {
          speaker: '青葉',
          text: '「土の香りが強くて……なんか、安心する感じで」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '（ペトリコール……）' },
        {
          speaker: '',
          text: '乾いた地表に降った雨で発生する揮発性物質。\n化学現象としては理解できる。',
        },
        { speaker: '赤羽', text: '（……が、仕事には関係ない）' },
        { speaker: '', text: 'そう心の中で整理しながら、口には出さない。' },
        {
          speaker: '',
          text: '周囲では、何人かの同僚が自然と青葉の話に耳を傾けている。',
        },
        { speaker: '社員', text: '「わかる」' },
        { speaker: '社員', text: '「なんか、落ち着くよね」' },
        { speaker: '社員', text: '「青葉ちゃんがいると、空気が和むよね」' },
        {
          speaker: '',
          text: '俺は、その様子を一歩引いた位置から眺めながら、時間と進捗を頭の中で並べていた。',
        },
        { speaker: '', text: '和む。' },
        {
          speaker: '',
          text: 'だが、業務は進まない。その事実だけが、静かに残る。',
        },
      ],
    },
    {
      id: 'ch2_sc2_work_instruction_1',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: '午後、青葉がまとめた資料を確認する。\n内容は間違っていない。だが、構成が独自すぎる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「ここ、フォーマット使えばもっと早い」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
         },
        {
          speaker: '赤羽',
          text: '「先方もその形式に慣れてる。確認も早くなる」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「なるほど……！」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
         },
        { speaker: '', text: '青葉は素直に頷き、メモを取る。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
         },
        { speaker: '', text: '反発はない。' },
        { speaker: '', text: 'ただ、処理に時間がかかっている。' },
      ],
    },
    {
      id: 'ch2_sc3_work_instruction_2',
      background: 'office_morning',
      lines: [
        { speaker: '', text: '別の案件。進捗が、明らかに遅れている。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
         },
        {
          speaker: '赤羽',
          text: '「ここ、詰まってたなら、もう少し早く相談してほしかった」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '声は荒げない。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「一人で抱えるより、早く出したほうが、結果的にお客さんのためになる」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
         },
        { speaker: '', text: '青葉は、一瞬だけ言葉を探す。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
         },
        {
          speaker: '青葉',
          text: '「……すみません。自分でやりきった方がいいかなって」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「時と場合による」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
         },
        { speaker: '赤羽', text: '「仕事は、完成度より優先順位だ」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
         },
        { speaker: '青葉', text: '「はい」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
         },
        { speaker: '', text: 'その声は、いつもより少しだけ小さい。' },
      ],
    },
    {
      id: 'ch2_sc4_night_bar',
      background: 'bar_night',
      lines: [
        { 
          speaker: '', 
          text: '同じ店。同じ席。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { 
          speaker: '黄瀬', 
          text: '「青葉、最近どうよ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { 
          speaker: '', 
          text: '黄瀬が、何気なく聞く。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { 
          speaker: '赤羽', 
          text: '「……改善点は多い」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'そう答えながら、昼のカフェテリアの光景が、頭をよぎる。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { 
          speaker: '黄瀬', 
          text: '「でもさ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { 
          speaker: '', 
          text: '黄瀬は、グラスを傾けながら続ける。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「正しいこと言ってりゃ、全部うまくいくってわけじゃない」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { 
          speaker: '', 
          text: '胸の奥に、小さな違和感が、確かに残る。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { 
          speaker: '', 
          text: '――自分の正しさが、何かを削っている気がする。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { 
          speaker: '', 
          text: '理由は、まだない。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'だが、予感は、輪郭を持ち始めていた。' },
      ],
    },
  ],
}
