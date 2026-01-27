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
  title: '最適化の代償',
  scenes: [
    {
      id: 'ch3_sc1',
      background: 'station_morning',
      lines: [
        { speaker: '', text: '朝。駅からオフィスまでの道を、俺は昨日と同じ速度で歩く。' },
        { speaker: '', text: 'すべてが想定通りだ。遅延なし。問題なし。' },
        { speaker: '', text: 'そう判断しながら、なぜか足取りが重い。' },
        { speaker: '', text: 'ネクタイが、普段よりきつく感じる。' },
      ],
    },
    {
      id: 'ch3_sc2',
      background: 'office_morning',
      lines: [
        { speaker: '', text: 'オフィスに着くと、青葉はすでに席にいた。',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'キーボードを打つ手は、以前より格段に速くなっていた。',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '画面を覗くと、曖昧な表現は消え、事実と数字だけが整然と並んでいる。',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「赤羽さん、おはようございます」',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '声は明るい。',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「おはよう」',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'その時、俺は気づいた。'}
      ],
    },
    {
      id: 'ch3_sc3',
      background: 'blue_leaf',
      lines: [
        { speaker: '', text: '青葉のデスク脇にあった小さな鉢植えが、いつの間にかなくなっている。' },
        { speaker: '赤羽', text: '（……片付けたのか）' },
        { speaker: '', text: '合理的だ。業務に不要なものは、置かない方がいい。' },
        { speaker: '', text: 'そう結論づけたはずなのに、俺の視線は、何度もその空白に戻ってしまう。' },
      ],
    },
    {
      id: 'ch3_sc4',
      background: 'meeting_room',
      lines: [
        { speaker: '', text: '午後の定例会議。' },
        { speaker: '', text: '青葉がまとめた資料が、スクリーンに映し出される。' },
        { speaker: '', text: '無駄がない。要点は明確で、リスクヘッジも完璧だ。' },
        { speaker: '上司', text: '「いいね。数字の裏付けもしっかりしている」' },
        { speaker: '上司', text: '「赤羽の指導の成果だな」' },
        { speaker: '', text: '俺は軽く頭を下げる。' },
        { speaker: '赤羽', text: '「本人の努力です」' },
        { speaker: '', text: '青葉も、メモを取りながら淡々と説明を続けている。' },
        { speaker: '', text: '以前のように、余談は挟まない。誰かの表情を気にして、話を止めることもない。' },
        { speaker: '', text: '会議は、予定より五分早く終わった。' },
        { speaker: '', text: '効率的。非の打ちどころはない。' },
        { speaker: '', text: 'それなのに。' },
        { speaker: '', text: '拍手の音が、どこか遠くに聞こえた。' },
      ],
    },
    {
      id: 'ch3_sc5',
      background: 'office_morning',
      lines: [
        { speaker: '', text: 'デスクに戻り、青葉から届いたメールを開く。' },
        { speaker: '', text: '件名。本文。署名。すべてが、完璧に整っている。' },
        { speaker: '', text: '余計な一文はどこにもない。' },
        { speaker: '', text: '『お疲れ様です。本日の議事録を送付します。ご確認をお願いいたします。』' },
        { speaker: '', text: '以前なら、ここに『今日は冷えますね』とか『会議、緊張しました』とか、ノイズのような一言があった。' },
        { speaker: '', text: 'それらは全て、俺が「不要」と断じたものだ。' },
        { speaker: '赤羽', text: '（俺は――）' },
        { speaker: '', text: 'そこで、はっきりと理解した。' },
        { speaker: '', text: '俺の正しさが、青葉の色を塗り潰したのだ。' },
        { speaker: '', text: '怒鳴ったわけではない。否定したわけでもない。' },
        { speaker: '', text: 'ただ、静かに「正しいやり方」を提示し続け、彼女から「彼女らしさ」を奪った。' },
        { speaker: '', text: 'これは成長ではない。' },
        { speaker: '', text: '最適化だ。' },
        { speaker: '', text: '人間を、システムの一部として機能するように最適化した。' },
        { speaker: '', text: 'その結果として、彼女は俺の形に作り替えられた。' },
      ],
    },
    {
      id: 'ch3_sc6',
      background: 'bar_night',
      lines: [
        { speaker: '', text: '夜、黄瀬と飲んでいる時、俺から口を開いた。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「新人の教育が終わった」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「お、ついに？　手のかかる子だったんだろ？」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '黄瀬は唐揚げにレモンをかけながら聞く。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「ああ。……ミスもしない。無駄口も叩かない。言った通りに動く。上司も褒めてたよ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「へえ、すげえじゃん。お前のコピーロボット一丁上がりってか」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '黄瀬は悪気なく笑った。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「これで仕事も楽になるな。乾杯！」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'グラスを合わせる音が響く。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「……ああ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '俺はビールを飲む。味がしなかった。' },
        { speaker: '', text: 'コピーロボット。' },
        { speaker: '', text: '黄瀬の言葉が、耳にこびりついて離れない。' },
        { speaker: '', text: '俺が作りたかったのは、本当にこれだったのか？' },
        { speaker: '', text: '彼女の個性を削ぎ落とし、正しさでコーティングして、俺と同じ「機能」を持たせた。' },
        { speaker: '', text: 'それは、成功だ。' },
        { speaker: '', text: 'だが、隣の席で馬鹿スカ笑っている黄瀬を見ていると、\n完成されたはずの自分が、ひどく欠陥品のように思えてならなかった。' },
      ],
    },
  ],
}
