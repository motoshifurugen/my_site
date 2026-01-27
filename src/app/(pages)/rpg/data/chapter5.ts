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

export const chapter5: { title: string; scenes: Scene[] } = {
  title: 'マニュアルの向こう側',
  scenes: [
    {
      id: 'ch5_sc1',
      background: 'office_morning',
      lines: [
        { speaker: '', text: '午前中にオフィスを出る。今回の商談は、対面で行うことになっている。' },
        { speaker: '', text: '社用車に青葉を乗せて、クライアント先まで走らせる。' },
        { speaker: '赤羽', text: '「流れは頭に入ってるな？」' },
        { speaker: '青葉', text: '「はい。私がメインで進行し、技術的な補足を赤羽さんが行う。想定問答も完璧です」',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '青葉はタブレットを確認する。',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '今回の相手は、人事部長の佐々木氏。\n実務的で、数字を好むタイプだ。',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「佐々木さんなら、このコスト削減プランで確実に落ちる。\n余計な情に訴える必要はない。淡々と、メリットだけを提示しよう」',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「分かりました」',
          characters: [
            {
              image: 'aoba_4.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'マニュアル通りに動けば、失敗する要素はない。' },
        { speaker: '', text: '俺たちは、「正解」を用意して、目的地に辿り着いた。' },
      ],
    },
    {
      id: 'ch5_sc2',
      background: 'meeting_room',
      lines: [
        { speaker: '', text: '通された応接室。' },
        { speaker: '', text: '入ってきたのは、佐々木氏ではなかった。' },
        { speaker: '', text: '初老の男性。\n上質なスーツを着崩し、穏やかな笑みを浮かべているが、眼光は鋭い。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '三枝', text: '「専務の三枝です。佐々木が急な体調不良でね。私が代わりに聞かせてもらいますよ」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '三枝実（さえぐさ　みのる）。この会社の創業メンバーの一人。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '「合理的」よりも「直感」や「人となり」で会社を大きくしてきた、\n俺が最も苦手とするタイプだ。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「は、はじめまして。青葉と申します」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '青葉が一瞬、動揺を見せる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '想定外の事態。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '俺は小さく息を吐き、冷静さを保つように目配せする。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '（動じるな。相手が変わっても、ビジネスの正解は変わらない。数字で圧倒しろ）',
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
      id: 'ch5_sc3',
      background: 'meeting_room',
      lines: [
        { speaker: '', text: 'プレゼンが始まる。青葉の語り口は流暢だ。' },
        { speaker: '', text: 'しかし、三枝専務は資料をほとんど見ない。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '青葉の顔を、じっと見つめているだけだ。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「――以上により、御社の経費は年間15%削減可能です」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '青葉が説明を終える。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '静寂。' },
        { speaker: '', text: '三枝氏は、ゆっくりと眼鏡を外した。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '三枝', text: '「……綺麗なプレゼンだ」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '三枝', text: '「非の打ち所がない。よく勉強している」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「あ、ありがとうございます」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '三枝', text: '「うん……」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '三枝', text: '「で？」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '三枝氏が、優しい笑みを保ったまま続ける。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '三枝', text: '「君は、どう思うんだね？」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「え……？」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '三枝', text: '「このプランで、現場の人間が喜ぶと、君自身は本気で思っているのかね？」',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '問いかけは静かだった。だが、部屋の空気が一気に薄くなる。',
          characters: [
            {
              image: 'saegusa_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '青葉が言葉に詰まる。マニュアルにはない質問。' },
        { speaker: '', text: '俺は手元のペンを握りしめる。これは、試されている。' },
        { speaker: '', text: '「効率」という鎧の下にある、俺たちの「中身」を。' },
        { speaker: '', text: '選択肢は、3つだ。' },
      ],
      options: [
        {
          text: '青葉に正解を言わせる',
          choiceId: 'bad_end',
        },
        {
          text: '青葉の素直な思いを伝える',
          choiceId: 'true_end',
        },
        {
          text: '青葉を守る',
          choiceId: 'another_end',
        },
      ],
    },
  ],
}
