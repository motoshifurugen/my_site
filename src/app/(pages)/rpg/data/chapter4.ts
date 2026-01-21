export type Line = {
  speaker: string
  text: string
  characters?: Character[]
}

export type Character = {
  image: string
  position?: 'left' | 'center' | 'right'
}

export type Scene = {
  id: string
  background: string
  // bgm: string
  lines: Line[]
  characters?: Character[]
}

export const chapter4: { title: string; scenes: Scene[] } = {
  title: '失われたものの輪郭',
  scenes: [
    {
      id: 'ch4_sc1_station_morning',
      background: 'station_morning',
      lines: [
        {
          speaker: '',
          text: '朝。駅からオフィスまでの道を歩きながら、俺は足取りの重さを自覚していた。',
        },
        {
          speaker: '',
          text: '昨日と同じ道。同じ信号。同じ時間。',
        },
        {
          speaker: '',
          text: '――なのに、同じじゃない。',
        },
        {
          speaker: '',
          text: '人の流れを見て、ふと思う。',
        },
        {
          speaker: '',
          text: '（みんな、自分の正しさを持って歩いてる）',
        },
        {
          speaker: '',
          text: 'それは、今まで俺が無意識にやってきたことだ。',
        },
        {
          speaker: '',
          text: '正しいと思う速度で歩き、正しいと思う方向に進む。それだけだったはずなのに。',
        },
      ],
    },
    {
      id: 'ch4_sc2_office_morning',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: 'オフィスに入ると、青葉はもう席にいた。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「おはようございます、赤羽さん」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '声は、明るい。\n仕事用の、完成された明るさだ。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '「おはよう」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'それ以上、言葉が続かない。',
        },
        {
          speaker: '',
          text: '以前なら、青葉の方から何か話していた。\n天気のこと。通勤途中の出来事。\n意味のない、でも空気を柔らかくする話題。',
        },
        {
          speaker: '',
          text: '今は、ない。',
        },
        {
          speaker: '',
          text: 'キーボードの音だけが、規則正しく響いている。',
        },
        {
          speaker: '赤羽',
          text: '（……これが、俺の作った静けさか）',
        },
      ],
    },
    {
      id: 'ch4_sc2_office_morning',
      background: 'office_morning',
      lines: [
        {
          speaker: '',
          text: '午前中。青葉が資料を持ってくる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「こちら、確認お願いします」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '無駄のない一言。無駄のない動作。俺は資料に目を通す。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '内容は問題ない。構成も、数字も、正しい。',
        },
        {
          speaker: '',
          text: '……正しい。',
        },
        {
          speaker: '',
          text: 'それなのに。',
        },
        {
          speaker: '赤羽',
          text: '「青葉」',
        },
        {
          speaker: '',
          text: '呼び止めると、青葉はすぐに立ち止まる。',
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
          text: '俺は、一瞬言葉に詰まる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '赤羽',
          text: '（何を、確認したいんだ）',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '誤字はない。論理も破綻していない。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'それでも、',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '以前ならここにあった"何か"が、見当たらない。',
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
          text: 'そう言うしかなかった。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '青葉は少しだけ頷き、自分の席に戻る。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'その背中を見ながら、胸の奥に、鈍い痛みが走る。',
        },
        {
          speaker: '赤羽',
          text: '（俺は、何を失ったんだ）',
        },
        {
          speaker: '',
          text: '答えは、もう分かっている。',
        },
        {
          speaker: '',
          text: 'でも、',
        },
        {
          speaker: '',
          text: '言葉にする勇気が、まだない。',
        },
      ],
    },
    {
      id: 'ch4_sc3_cafe_lunch',
      background: 'cafe_lunch',
      lines: [
        {
          speaker: '',
          text: '昼休み。カフェテリア。青葉は同僚と並んで座っている。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '会話は、仕事の進捗。タスク管理。納期。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: '以前のような、どうでもいい雑談はない。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '同僚',
          text: '「青葉ちゃん、仕事早くなったよね」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '青葉',
          text: '「ありがとうございます。赤羽さんに鍛えられて、無駄が減りました」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        {
          speaker: '',
          text: 'その言葉が、胸に突き刺さる。',
        },
        {
          speaker: '',
          text: '"無駄"',
        },
        {
          speaker: '',
          text: '俺が、切り捨ててきたものの名前だ。',
        },
        {
          speaker: '',
          text: '青葉の表情は穏やかだ。不満も、怒りもない。',
        },
        {
          speaker: '',
          text: 'それが、余計につらい。',
        },
        {
          speaker: '赤羽',
          text: '（壊れたことに、本人は気づいていない）',
        },
        {
          speaker: '',
          text: 'いや――',
        },
        {
          speaker: '',
          text: '気づいていて、受け入れてしまったのかもしれない。',
        },
      ],
    },
    {
      id: 'ch4_sc4_bar_night',
      background: 'bar_night',
      lines: [
        {
          speaker: '',
          text: '夜。また、黄瀬と飲んでいる。',
        },
        {
          speaker: '黄瀬',
          text: '「最近どうだ」',
        },
        {
          speaker: '',
          text: '何気ない問い。',
        },
        {
          speaker: '',
          text: '俺は、少し迷ってから答える。',
        },
        {
          speaker: '赤羽',
          text: '「……青葉が、ちゃんと仕事をするようになった」',
        },
        {
          speaker: '',
          text: '黄瀬は、黙って聞いている。',
        },
        {
          speaker: '赤羽',
          text: '「効率も上がった。評価もいい」',
        },
        {
          speaker: '黄瀬',
          text: '「それで？」',
        },
        {
          speaker: '赤羽',
          text: '「それで……」',
        },
        {
          speaker: '',
          text: '言葉が、続かない。',
        },
        {
          speaker: '黄瀬',
          text: '「赤羽。お前さ」',
        },
        {
          speaker: '',
          text: '少し笑って、黄瀬は続けた。',
        },
        {
          speaker: '黄瀬',
          text: '「正しい結果が出たときほど、自分を疑えなくなるタイプだよな」',
        },
        {
          speaker: '',
          text: '図星だった。',
        },
        {
          speaker: '黄瀬',
          text: '「でもさ」',
        },
        {
          speaker: '',
          text: '黄瀬はグラスを置く。',
        },
        {
          speaker: '黄瀬',
          text: '「疑えなくなった時点で、もう選択は始まってるんだぜ」',
        },
        {
          speaker: '赤羽',
          text: '「……何の話だ」',
        },
        {
          speaker: '黄瀬',
          text: '「壊したまま進むか、立ち止まって向き合うか」',
        },
        {
          speaker: '',
          text: '直接的な言葉は使わない。でも、逃げ道は示さない。\nそれが、黄瀬なりの優しさだと、俺は知っている。',
        },
      ],
    },
    {
      id: 'ch4_sc5_rain_road',
      background: 'rain_road',
      lines: [
        {
          speaker: '',
          text: '帰り道。風が冷たい。\n街灯の下で立ち止まり、自分の手を見る。',
        },
        {
          speaker: '',
          text: 'この手で、何かを殴ったわけじゃない。\n怒鳴ったことも、脅したこともない。',
        },
        {
          speaker: '',
          text: 'ただ、「正しい」と思うやり方を、淡々と示してきただけだ。',
        },
        {
          speaker: '',
          text: 'それでも。',
        },
        {
          speaker: '',
          text: '結果として、青葉の世界は変わった。',
        },
        {
          speaker: '',
          text: '――俺が、変えてしまった。',
        },
        {
          speaker: '赤羽',
          text: '（自分を信じるって、なんだ）',
        },
        {
          speaker: '',
          text: '今までの答えは、もう通用しない。',
        },
        {
          speaker: '',
          text: 'でも、代わりの答えも、ない。',
        },
        {
          speaker: '',
          text: 'このまま進めば、青葉はさらに"正しく"なる。',
        },
        {
          speaker: '',
          text: '俺が望んだ通りに。',
        },
        {
          speaker: '',
          text: 'それが、取り返しのつかないことだと分かっていても。',
        },
        {
          speaker: '',
          text: '足は、まだ止まらない。',
        },
      ],
    },
    {
      id: 'ch4_sc6_night_coffee',
      background: 'night_coffee',
      lines: [
        {
          speaker: '',
          text: 'その夜、スマートフォンに青葉からの業務連絡が届く。',
        },
        {
          speaker: '',
          text: '短く、要点だけの文章。完璧なメール。',
        },
        {
          speaker: '',
          text: '俺は画面を見つめたまま、返信を打てずにいる。',
        },
        {
          speaker: '',
          text: 'この先に待っているのは、選択ではない。',
        },
        {
          speaker: '',
          text: '覚悟だ。',
        },
      ],
    },
  ],
}

