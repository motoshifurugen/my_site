export type Line = {
  speaker: string
  text: string
}

export type Scene = {
  id: string
  background: string
  // bgm: string
  lines: Line[]
}

export const chapter1: { title: string; scenes: Scene[] } = {
  title: "同じ道、同じ朝",
  scenes: [
    {
      id: "ch1_sc1_morning_walk",
      background: "station_morning",
      lines: [
        { speaker: "", text: "駅からオフィスへ向かう道は、毎朝同じだ。" },
        { speaker: "", text: "人の流れも、信号の間隔も、だいたい予測できる。" },
        { speaker: "", text: "流れに逆らわず、速すぎず遅すぎず、決めた速度で歩く。" },
        { speaker: "", text: "周囲には、焦っている人、ぼんやりしている人、イヤホン越しに世界を遮断している人がいる。" },
        { speaker: "", text: "―― みんな、それぞれの正しさを抱えている。" },
        { speaker: "", text: "そう考えるのは、癖だ。" },
        { speaker: "", text: "大学で化学をやっていた頃から、現象には必ず理由があると思って生きてきた。\n反応条件が整えば、結果は再現できる。" },
        { speaker: "", text: "人間の行動も、本質は似たようなものだ。" },
        { speaker: "", text: "正しい手順。正しい判断。正しいタイミング。" },
        { speaker: "", text: "それを外さなければ、大きく間違うことはない。" },
        { speaker: "", text: "オフィスビルが見えてきたところで、腕時計を一度だけ確認した。" },
        { speaker: "赤羽", text: "「―― 今日も、予定通りだ。」" },
      ],
    },

    {
      id: "ch1_sc2_office_morning",
      background: "office_morning",
      lines: [
        { speaker: "", text: "午前中のフロアは、まだ静かだ。" },
        { speaker: "", text: "キーボードの音が、点在する雨粒みたいに聞こえる。" },
        { speaker: "？？？", text: "「おはようございますー！」" },
        { speaker: "", text: "少しだけ、場違いな明るさの声。" },
        { speaker: "", text: "振り向くと、青葉 色音がいた。" },
        { speaker: "", text: "今年入ってきた新人で、フロアの空気を一瞬で変える、珍しいタイプだ。" },
        { speaker: "青葉", text: "「おはようございます、赤羽さん！」" },
        { speaker: "", text: "語尾が弾む。それだけで、何人かの視線が和らぐのがわかる。" },
        { speaker: "", text: "青葉は、仕事が速いわけじゃない。むしろ遅い。" },
        { speaker: "", text: "要領も、正直いいとは言えない。" },
        { speaker: "", text: "そのかわり、" },
        { speaker: "", text: "誰かがミスをすると、必ず一言声をかける。空気が重くなると、どうでもいい話を始める。" },
        { speaker: "", text: "理屈じゃ説明できないのに、場が崩れない。俺にはできないやり方だ。" },
        { speaker: "青葉", text: "「資料、昨日の件、ここまでまとめました！」" },
        { speaker: "", text: "青葉が、少し誇らしげにファイルを差し出す。\n中身を見ると、方向性は合っているが、無駄が多い。時間は、かかっている。" },
        { speaker: "赤羽", text: "「……ここ、先にテンプレ使えば早かったな。」" },
        { speaker: "", text: "青葉は一瞬だけ目を丸くした。" },
        { speaker: "青葉", text: "「あ、なるほど！　次からそうします！」" },
        { speaker: "", text: "軽い。" },
        { speaker: "", text: "だが、反発はない。俺は、それ以上、何も言わなかった。" },
      ],
    },

    {
      id: "ch1_sc3_evening_reflection",
      background: "meeting_room",
      lines: [
        { speaker: "", text: "午後、会議が終わったあと、数年前のプロジェクトのことを、ふと思い出す。" },
        { speaker: "", text: "反対意見は、なかった。\nただ、皆が慣れていないやり方だった。" },
        { speaker: "", text: "新しいルールに従うこと。余計な感情を持ち込まないこと。時間をかけず、決められた手順で進めた結果、数字はきれいに出た。" },
        { speaker: "", text: "誰かを言い負かしたわけじゃない。社会のルールを理解して、それに順応しただけだ。" },
        { speaker: "", text: "それで、うまくいった。" },
        { speaker: "赤羽", text: "「……今日も、だな。」" },
        { speaker: "", text: "小さく呟いて、モニターに視線を戻した。" },
      ],
    },

    {
      id: "ch1_sc4_night_bar",
      background: "bar_night",
      lines: [
        { speaker: "", text: "仕事終わり、黄瀬 燈也と、いつもの店に入る。" },
        { speaker: "黄瀬", text: "「新人、どう？」" },
        { speaker: "", text: "ビールを一口飲んで、黄瀬が聞く。" },
        { speaker: "赤羽", text: "「青葉か。……悪くはない。」" },
        { speaker: "黄瀬", text: "「遅いけどな。」" },
        { speaker: "赤羽", text: "「遅いな。」" },
        { speaker: "", text: "二人して笑う。" },
        { speaker: "黄瀬", text: "「でもさ、ああいうの、得意じゃないだろ」" },
        { speaker: "赤羽", text: "「……どうだろうね」" },
        { speaker: "", text: "黄瀬は、俺が無理をしていないかを聞かない。代わりに、軽い話を投げてくる。" },
        { speaker: "黄瀬", text: "「正しすぎると、疲れんぞ。」" },
        { speaker: "", text: "その言葉を、そのときは深く考えなかった。" },
      ],
    },
  ],
}
