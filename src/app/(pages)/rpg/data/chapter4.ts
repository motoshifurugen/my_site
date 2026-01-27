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

export const chapter4: { title: string; scenes: Scene[] } = {
  title: '酸素の薄い部屋',
  scenes: [
    {
      id: 'ch4_sc1',
      background: 'station_morning',
      lines: [
        { speaker: '', text: '朝。駅からオフィスまでの道を歩きながら、俺はネクタイを少し緩めた。' },
        { speaker: '', text: '最近、息が浅い。' },
        { speaker: '', text: '空気は薄くないはずなのに、肺の奥まで酸素が入ってこない感覚がある。' },
      ],
    },
    {
      id: 'ch4_sc2',
      background: 'office_morning',
      lines: [
        { speaker: '', text: 'オフィスに入ると、青葉はすでに席にいた。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「おはようございます、赤羽さん」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '一寸の狂いもない挨拶。完璧な発声。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '……コピーロボット',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「おはよう」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'キーボードを叩く音が、規則正しく響く。' },
        { speaker: '', text: 'かつて俺が不快だと思っていたノイズは、完全に消滅していた。' },
        { speaker: '', text: '静かで、効率的で、無駄がない。' },
        { speaker: '赤羽', text: '（……これが、俺の作った静けさか）' },
      ],
    },
    {
      id: 'ch4_sc3',
      background: 'office_morning',
      lines: [
        { speaker: '', text: '午前中。青葉が資料を持ってくる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「こちら、確認お願いします」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '無駄のない一言。無駄のない動作。\n俺は資料に目を通す。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '内容は問題ない。構成も、数字も、正しい。' },
        { speaker: '', text: '……正しい。' },
        { speaker: '', text: 'それなのに。' },
        { speaker: '赤羽', text: '「青葉」' },
        { speaker: '青葉', text: '「はい」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '俺は、一瞬言葉に詰まる。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '（何を、確認したいんだ）',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '誤字はない。論理も破綻していない。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'それでも、',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '以前ならここにあった何かが、見当たらない。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「……いや、いい」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '青葉は少し間を置いて、頷いた。',
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
      id: 'ch4_sc4',
      background: 'cafe_lunch',
      lines: [
        { speaker: '', text: '昼休み。カフェテリア。' },
        { speaker: '', text: '青葉は同僚と並んで座っている。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '会話は、仕事の進捗。タスク管理。納期。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '以前のような、どうでもいい雑談はない。',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '同僚', text: '「青葉ちゃん、仕事早くなったよね」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '青葉', text: '「ありがとうございます。赤羽さんに鍛えられて、無駄が減りました」',
          characters: [
            {
              image: 'aoba_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: 'その言葉が、胸に突き刺さる。' },
        { speaker: '', text: '"無駄"' },
        { speaker: '', text: '俺が、切り捨ててきたものの名前だ。' },
        { speaker: '', text: '青葉の表情は穏やかだ。不満も、怒りもない。' },
        { speaker: '', text: 'それが、余計につらい。' },
        { speaker: '', text: '壊れたことに、本人は気づいていない' },
        { speaker: '', text: 'いや――' },
        { speaker: '', text: '気づいていて、受け入れてしまったのかもしれない。' },
      ],
    },
    {
      id: 'ch4_sc5',
      background: 'bar_night',
      lines: [
        { speaker: '', text: '夜。また、黄瀬と飲んでいる。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「なんかお前…」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '黄瀬が枝豆をつまみながら、ぼそりと言う。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「渚を失った朋也みたいな顔してるぞ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「は？」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「大きな取引先でも無くしたのかよ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '俺はグラスを置く。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「順調だよ。青葉も育った。チームの数字もいい」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「なら、よかった」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「たまには、チームで飲み会とかやってもいいんじゃないか？\n他の部署の連中が言ってたよ。『あそこは軍隊みたいで、近づきがたい』って」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '赤羽', text: '「コミュニケーション課題を飲み会で解決しようとする奴が、一番嫌いだ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '', text: '俺が即答すると、黄瀬は笑った。',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「お前いまこの店にいるやつ全員的に回したぞ」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
        { speaker: '黄瀬', text: '「まあでも、それで数字が出てるんだから、なにも言えないよな」',
          characters: [
            {
              image: 'kise_1.png',
              position: 'center',
            },
          ],
        },
      ],
    },
  ],
}
