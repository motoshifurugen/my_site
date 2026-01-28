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
  title: '海が見える回り道',
  scenes: [
    {
      id: 'ch6c_sc1',
      background: 'client_room',
      lines: [
        {
          speaker: '',
          text: '三枝氏の問いかけに対し、青葉が追い詰められている。',
        },
        {
          speaker: '青葉',
          text: '「私は……」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '彼女の手が震えている。',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'マニュアル通りの答えを吐き出すか、答えられずに無能の烙印を押されるか。',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'どちらにせよ、今の青葉には荷が重すぎる。',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '俺が作り上げた「完璧な部下」という仮面が、今にも剥がれ落ちそうだ。',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'これ以上続けさせれば、彼女は決定的に傷つくか、\nあるいは心を殺して「完成」してしまう。',
        },
        { speaker: '赤羽', text: '（……もういい）' },
        { speaker: '赤羽', text: '「三枝専務」' },
        { speaker: '', text: '俺は立ち上がり、資料を閉じた。' },
        {
          speaker: '赤羽',
          text: '「申し訳ありません。本日の提案は、取り下げさせていただきます」',
        },
        {
          speaker: '青葉',
          text: '「赤羽さん！？」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '青葉が叫ぶ。三枝氏も眉をひそめる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '三枝',
          text: '「どういうことだね？」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「ご指摘の通りです。我々のプランには、現場への配慮が欠けていました。……このまま進めても、御社のためにならない」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'これは、ビジネスマンとしての敗北だ。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'だが、青葉に「心を殺した回答」を言わせるよりはずっといい。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「出直してまいります」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '俺は深く頭を下げ、青葉を促して部屋を出た。' },
      ],
    },
    {
      id: 'ch6c_sc3',
      background: 'after_cafe',
      lines: [
        { speaker: '', text: '近くのカフェに入る。' },
        { speaker: '', text: '今にも泣きそうな顔で、青葉が口を開く。' },
        {
          speaker: '青葉',
          text: '「……すみません。私が答えられなかったせいで、商談が」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「いや、あれでよかったんだ」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '俺はコーヒーを飲む。苦い。',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「契約は流れるだろうな」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「どうして、止めたんですか？　私、マニュアル通りなら答えられました」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「そうだな」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '俺は青葉を見る。',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「でも、それを言ったら、お前は本当に『そういう人間』になっちまう気がした」',
          characters: [
            {
              image: 'aoba_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「え？」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「仕事は取れなかった。俺の評価も下がる。……でもな」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '俺はネクタイを緩め、大きく息を吸った。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '不思議と、後悔はなかった。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「嘘をついて勝つより、負けて息がしやすい方がいい。\n……今の俺は、そう思うんだよ」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '青葉はしばらく俺を見ていたが、やがてふっと力を抜いて笑った。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「……赤羽さん、変なの」',
          characters: [
            {
              image: 'aoba_3.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「正しくはない、かもな」',
          characters: [
            {
              image: 'aoba_3.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '商談は大失敗だ。' },
        {
          speaker: '',
          text: 'でも、これで良かった。と言える日が、いつか来るかもしれない。',
        },
        {
          speaker: '',
          text: 'そんな根拠のない希望を感じながら、外の景色を見た。',
        },
        {
          speaker: '',
          text: 'この世界が、昨日よりも少しだけ透き通って見えた。',
        },
      ],
    },
  ],
}
