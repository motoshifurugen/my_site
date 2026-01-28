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

export const chapter1: { title: string; scenes: Scene[] } = {
  title: '正しい毎日',
  scenes: [
    {
      id: 'ch1_sc1',
      background: 'station_morning',
      lines: [
        { speaker: '', text: '駅からオフィスへ向かう道は、毎朝同じだ。' },
        { speaker: '', text: '人の流れも、信号の間隔も、だいたい予測できる。' },
        {
          speaker: '',
          text: '周囲には、焦っている人、ぼんやりしている人、イヤホン越しに世界を遮断している人がいる。',
        },
        { speaker: '', text: '―― みんな、それぞれの正しさを抱えている。' },
        { speaker: '', text: 'そう考えるのは、癖だ。' },
        {
          speaker: '',
          text: '大学で化学をやっていた頃から、現象には必ず理由があると思って生きてきた。\n反応条件が整えば、結果は再現できる。',
        },
        {
          speaker: '',
          text: '人間の行動も、ビジネスも、本質は似たようなものだ。',
        },
        { speaker: '', text: '正しい手順。正しい判断。正しいタイミング。' },
        { speaker: '', text: 'それを外さなければ、大きく間違うことはない。' },
        {
          speaker: '',
          text: 'オフィスビルが見えてきたところで、腕時計を確認した。',
        },
        { speaker: '', text: '"8:50"' },
        { speaker: '赤羽', text: '「今日も予定通りだ」' },
      ],
    },
    {
      id: 'ch1_sc2',
      background: 'office_morning',
      lines: [
        { speaker: '', text: '午前中のフロアは、まだ静かだ。' },
        {
          speaker: '',
          text: 'キーボードを叩く音が、雨粒のように点在している。',
        },
        { speaker: '', text: '感情が入り込む余地のない、秩序ある空間。' },
        { speaker: '', text: 'だが、その静寂はもうすぐ破られる。' },
        { speaker: '？？？', text: '「おはようございますー！」' },
        { speaker: '', text: '場違いなほど明るい声。' },
        {
          speaker: '',
          text: '入り口に、青葉色音（あおば いろね）が立っていた。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '今年入ってきた新人で、フロアの空気を一瞬で変える、珍しいタイプだ。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '青葉は、仕事が速いわけではない。むしろ遅い。要領も悪い。',
        },
        { speaker: '', text: 'その代わり、' },
        {
          speaker: '',
          text: '誰かがミスをすると何かと声をかけ、空気が重くなると、どうでもいい天気の話を始める。',
        },
        {
          speaker: '',
          text: '理屈では説明できないが、場が崩れない。理解できない、異物だ。',
        },
        {
          speaker: '青葉',
          text: '「おはようございます、赤羽さん！」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '語尾が弾む。それだけで、何人かの視線が和らぐのがわかる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「……おはよう」' },
        { speaker: '', text: '視線をモニターから外さずに返す。' },
        {
          speaker: '青葉',
          text: '「資料、昨日の件、ここまでまとめました！」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '青葉が、少し誇らしげにファイルを差し出す。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '中身に目を通す。\n…… …… ……\n方向性は合っている。だが、構成が無駄だらけだ。',
        },
        {
          speaker: '赤羽',
          text: '「……ここ、先にテンプレートを使えば十分で、もっと早いな」',
        },
        {
          speaker: '',
          text: '青葉は一瞬だけ目を丸くした。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「あ、なるほど！　次からそうします！」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '軽い。' },
        { speaker: '', text: '俺はそれ以上、何も言わずにファイルを返した。' },
      ],
    },
    {
      id: 'ch1_sc3',
      background: 'meeting_room',
      lines: [
        {
          speaker: '',
          text: '午後の会議が終わったあと、ふと数年前のプロジェクトのことを思い出した。',
        },
        { speaker: '', text: '反対意見はなかった。' },
        { speaker: '', text: 'ただ、皆が慣れていないやり方だった。' },
        {
          speaker: '',
          text: '新しいルールに従うこと。余計な感情を持ち込まないこと。',
        },
        {
          speaker: '',
          text: '時間をかけず、決められた手順で進めた結果、数字はきれいに出た。',
        },
        { speaker: '', text: '誰かを言い負かしたわけではない。' },
        { speaker: '', text: '社会のルールを理解して、それに順応しただけだ。' },
        { speaker: '', text: 'それで、うまくいった。' },
        { speaker: '赤羽', text: '「……今日も、だな」' },
        { speaker: '', text: '小さく呟いて、モニターに視線を戻す。' },
      ],
    },
    {
      id: 'ch1_sc4',
      background: 'bar_night',
      lines: [
        {
          speaker: '',
          text: '夜、同期の黄瀬燈也（きせ　とうや）といつもの居酒屋に入った。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「とりあえずビール。あと、ポテサラ」' },
        {
          speaker: '黄瀬',
          text: '「お前、ほんと冒険しねえな」',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「何がだ」',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「ここに来て五年、\n毎回最初の一言目が『ポテサラ』だろ。たまには『本日のおすすめ』とか行ってみろよ」',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '黄瀬はメニュー表をパタパタと仰ぐ。',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「外れを引く時間が無駄だ」',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「その『無駄』が、酒の肴になるのによ」',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「よくわからん」',
          characters: [
            {
              image: 'kise_2.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '俺は届いたポテトサラダを口に運ぶ。' },
        { speaker: '', text: 'いつもの味だ。これでいい。' },
        {
          speaker: '',
          text: '予想通りの結果が得られること。それが正しい選択の証拠だ。',
        },
      ],
    },
  ],
}
