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
  title: '選択の日',
  scenes: [
    {
      id: 'ch5_sc1_office_morning',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: '朝。オフィスの空気は、奇妙なほど安定していた。',
        },
        {
          speaker: '',
          text: '誰も怒っていない。誰も困っていない。進捗は順調で、数値も予定通りだ。',
        },
        {
          speaker: '',
          text: '――なのに。',
        },
        {
          speaker: '赤羽',
          text: '（この均衡は、いつまで続く）',
        },
        {
          speaker: '',
          text: 'そんな考えが、頭から離れない。',
        },
        {
          speaker: '',
          text: '青葉は今日も淡々と仕事をしている。指示を待たず、自分で判断し、無駄なく処理する。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'それは、理想的な部下の姿だ。俺が求めてきた、完成形。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「赤羽さん、午後の打ち合わせ資料、先に送っておきました」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「ああ、ありがとう」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '返事は短く、事務的になる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'それで、問題はないはずだった。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '（……本当に？）',
        },
      ],
    },
    {
      id: 'ch5_sc2_meeting_room',
      background: 'meeting_room',
      lines: [
        {
          speaker: '',
          text: '午後。クライアントとのオンラインミーティング。\n進行はスムーズだった。青葉の資料説明も、正確で簡潔。',
        },
        {
          speaker: '',
          text: 'だが――。',
        },
        {
          speaker: 'クライアント',
          text: '「では、その仕様で進めましょう」',
        },
        {
          speaker: '',
          text: 'クライアントがそう言った瞬間、俺は違和感を覚える。',
        },
        {
          speaker: '赤羽',
          text: '（待て）',
        },
        {
          speaker: '',
          text: '数字は合っている。理屈も通っている。',
        },
        {
          speaker: '',
          text: 'けれど、その仕様は――',
        },
        {
          speaker: '',
          text: '以前、青葉が時間をかけて考えていた案ではない。',
        },
        {
          speaker: '',
          text: 'もっと、手間がかかるが、クライアントの負担が軽くなる案。',
        },
        {
          speaker: '',
          text: '俺が「効率」を理由に却下したものだ。',
        },
        {
          speaker: '',
          text: '青葉は何も言わない。反論もしない。ただ、決定を受け入れている。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「……以上です」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'ミーティングは、問題なく終わった。',
        },
        {
          speaker: '',
          text: '問題がないことが、一番の問題だと、はっきり分かる。',
        },
      ],
    },
    {
      id: 'ch5_sc3_office_morning',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: '会議室を出たあと、俺は青葉を呼び止める。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「青葉」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「はい」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '振り返る顔は、落ち着いている。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「さっきの仕様……」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '言いかけて、止まる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '何を聞く？何を確認する？',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「……いや、いい」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '結局、それだけだ。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '青葉は一礼して、席に戻る。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'その背中を見た瞬間、胸の奥で、何かが崩れ落ちた。',
        },
        {
          speaker: '赤羽',
          text: '（ああ）',
        },
        {
          speaker: '赤羽',
          text: '（もう、終わってる）',
        },
        {
          speaker: '',
          text: '俺は、気づいてしまった。',
        },
        {
          speaker: '',
          text: '青葉は、自分の考えを捨てたんじゃない。\n俺に否定される前に、自分から切り捨てるようになっただけだ。',
        },
        {
          speaker: '',
          text: 'それが、一番効率がいいから。',
        },
        {
          speaker: '',
          text: 'それが、俺の正しさを、内側から取り込んだ結果だ。',
        },
      ],
    },
    {
      id: 'ch5_sc4_bar_night',
      background: 'bar_night',
      lines: [
        {
          speaker: '',
          text: '夜。また、黄瀬と会う。いつもの店。いつもの席。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「なあ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '黄瀬が、ぽつりと言う。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「もしさ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「お前が正しくて、相手もそれを受け入れて、全体もうまく回ってるとしたらさ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'グラスを揺らしながら話す。嫌な予感がする。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「それでも壊れてるって、言えるか？」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '俺は、答えられない。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「言えないなら、それも選択だ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「……」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「でも」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '少しだけ、声が低くなる。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '黄瀬',
          text: '「気づいたあとで何もしないのは、もう"無自覚"じゃない」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'その言葉が、胸に深く沈む。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
      ],
    },
    {
      id: 'ch5_sc5_night_coffee',
      background: 'night_coffee',
      lines: [
        {
          speaker: '',
          text: '終電間際のオフィス。照明は一部だけが点いている。',
        },
        {
          speaker: '',
          text: '俺は、自分のデスクに座っている。',
        },
        {
          speaker: '',
          text: '画面には、青葉から送られてきた最新の資料。完璧だ。非の打ち所がない。',
        },
        {
          speaker: '',
          text: '――だからこそ。',
        },
        {
          speaker: '赤羽',
          text: '（このまま行けば、何が起きる）',
        },
        {
          speaker: '',
          text: '未来は、見えている。\n青葉は評価される。俺も評価される。組織はうまく回る。',
        },
        {
          speaker: '',
          text: 'その代わりに、',
        },
        {
          speaker: '',
          text: '青葉はもう、戻らない。',
        },
        {
          speaker: '',
          text: 'あの無邪気さも、遅さも、説明できない何かも。',
        },
        {
          speaker: '',
          text: 'すべて、「正しさ」に吸収されていく。',
        },
        {
          speaker: '',
          text: '俺は、画面から目を離す。',
        },
        {
          speaker: '',
          text: 'ここで何もしなければ、それが答えになる。',
        },
        {
          speaker: '',
          text: 'ここで何かすれば、今までの自分を壊すことになる。',
        },
        {
          speaker: '赤羽',
          text: '（自分を信じる）',
        },
        {
          speaker: '',
          text: 'その言葉が、初めて怖くなる。',
        },
      ],
    },
    {
      id: 'ch5_sc6_blue_leaf',
      background: 'blue_leaf',
      lines: [
        {
          speaker: '',
          text: 'オフィスの静寂の中で、俺は三つの可能性を思い描く。',
        },
        {
          speaker: '',
          text: 'どれも、正解ではない。',
        },
        {
          speaker: '',
          text: 'どれも、間違いでもない。',
        },
      ],
      options: [
        {
          text: 'このまま進む',
          choiceId: 'continue',
        },
        {
          text: '青葉と話す',
          choiceId: 'talk_to_aoba',
        },
        {
          text: '黄瀬に相談する',
          choiceId: 'consult_kise',
        },
      ],
    },
  ],
}

