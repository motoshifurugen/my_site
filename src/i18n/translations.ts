import { Translations } from './types';

export const translations: Translations = {
  ja: {
    common: {
      home: 'ホーム',
      about: 'プロフィール',
      contact: 'お問い合わせ',
      blog: 'ブログ',
      portfolio: 'ポートフォリオ',
      game: 'ゲーム',
      tanka: '短歌',
      play: '遊び',
      language: '言語',
      switchToJapanese: '日本語',
      switchToEnglish: 'English',
    },
    home: {
      title: 'ようこそ',
      subtitle: '古堅基史の開発ポートフォリオサイトへ',
      description: 'このサイトはなんくるないさ系エンジニアの作品やブログを紹介するためのものです。',
      mainMessage: '心の健康を支えるために、\n画面の向こうに広がる世界へ、\n想いをコードに込め、\n日々挑戦を続ける、\nなんくるないさ系エンジニア。',
    },
    navigation: {
      toggleMenu: 'メニューを開く',
      closeMenu: 'メニューを閉じる',
    },
    footer: {
      copyright: '© 2024 furugen',
      cities: {
        oka: '沖縄',
        hij: '広島',
        tyo: '東京',
        bcd: 'バコロド',
      },
    },
    profile: {
      title: 'プロフィール',
      subtitle: '古堅基史（Furugen, Motoshi）',
      career: {
        title: '足跡',
        1998: '1998年',
        2017: '2017年',
        2020: '2020年',
        2021: '2021年',
        2023: '2023年',
        current: '〜 現在',
        desc1998: '沖縄に生まれる',
        desc2017: '高校卒業後、理学部物理学科へ進学する',
        desc2020: '大学休学中にプログラミングを始める',
        desc2021: '長期インターンでWebエンジニアを経験する',
        desc2023: '大学卒業後、エンジニアとして就職する',
        descCurrent: 'フロントエンドエンジニアとして奮闘中',
      },
      interest: {
        title: '興味',
        content: '物理学が目に見えない自然の法則を解き明かすように、プログラミングによってデータという見えない情報を扱うことに楽しさを感じています。一方で、サービスを通してつながるエンドユーザーへの意識の重要性も感じています。デザインやジェネラティブアートにも関心があり、ワクワクするようなユーザー体験を提供したいです。自分自身、強いメンタルの持ち主ではないので、メンタルヘルスも大切にしています。',
      },
      passion: {
        title: '趣味',
        reading: '・読書　　　：不定期で友達と読書会を開催しています。',
        tanka: '・短歌　　　：Xで気ままに200首以上の短歌を書いています。',
        walking: '・散歩　　　：朝・昼・晩の散歩が日課です。',
        driving: '・ドライブ　：目的地もなく運転します。',
        eisa: '・エイサー　：沖縄の伝統芸能です。',
        guitar: '・ギター　　：アルペジオ練習中です。',
        baseball: '・野球　　　：外野専門です。プロ野球を見るのも好きです。',
        darts: '・ダーツ　　：19が好きです。',
        bowling: '・ボウリング：ハウスボールを曲げたがりです。',
      },
      mbti: {
        title: 'MBTI',
        type: 'INFP-A',
        typeName: '（仲介者）',
        introvert: '内向型（I）：散歩や読書など、一人で過ごす時間が好き',
        intuitive: '直感型（N）：短歌やエイサーなど、創造や表現活動が好き',
        feeling: '感情型（F）：自分にも他人にも感情の変化に興味あり',
        prospecting: '探索型（P）：考えるまでに行動してみて調整していくスタイル',
        assertive: '自己主張的（A）：常に心に根拠なき自信がある',
      },
    },
    skills: {
      title: 'ポートフォリオ',
      projects: '制作実績',
      skills: 'スキル',
      works: {
        work01: {
          title: 'ホームページ（地元スーパー）',
          description: '地元スーパーのホームページを作成しました。スマホユーザーを主なターゲットとし、レスポンシブデザインを採用しました。',
        },
        work02: {
          title: 'ホームページ（デイサービス施設）',
          description: 'エンジニアでなくても運用できるようにとの要望を受け、WordPressを使って新たにホームページを作成しました。',
        },
        work03: {
          title: 'ホームページ（ウォーターサーバー）',
          description: '既存のサイトを刷新し、YouTube埋め込みやスライドショーなど新しい要素を取り入れました。',
        },
        hackathon01: {
          title: '今日の飯決めアプリ',
          description: 'その日の気分に合ったレシピを提案するアプリを開発しました。楽天レシピAPIのレスポンス時間を考慮しながら実装を進めました。',
        },
        hackathon02: {
          title: 'チーム開発チュートリアルアプリ',
          description: 'ハッカソンでのチームビルディングの課題を基に、役割分担やタスク共有を簡単に行えるアプリを開発しました。',
        },
        hackathon03: {
          title: 'Pythonで作るトランプゲーム',
          description: 'Pythonでローカル環境で動作するトランプゲームを開発し、それを配布するためのWebサイトを構築しました。',
        },
        hobby01: {
          title: '自己探究プログラム振り返りサイト',
          description: '参加したプログラムの内容やメンバー情報などをまとめたサイトを作成しました。動くドット絵の背景が好評でした。',
        },
        hobby02: {
          title: 'あのシーンの吹き出し加工ツール',
          description: 'あの名シーンの感動を他の場面でも応用できるよう、吹き出しを自分好みに書き換えるツールを開発しました。',
        },
        hobby03: {
          title: 'あのシーンの緊迫感体験ゲーム',
          description: '某アニメの名シーンを再現して世界崩壊の緊迫感を体験できる、ヌメロン形式のパスワード推測ゲームを作成しました。',
        },
        hobby04: {
          title: 'ユニティちゃんのマリオ風ゲーム',
          description: 'Unityの基礎を学ぶために、2Dのマリオ風ゲームを作成しました。ゲーム開発者の凄さを強く実感しました。',
        },
        hobby05: {
          title: '開発ポートフォリオサイト',
          description: 'Reactを使ったブログサイト構築を目指し、ジェネラティブアートの使用やゲーム画面など、遊び心もこめて作成しました。',
        },
        work04: {
          title: 'ホームページ（不動産会社）',
          description: 'Figmaでのデザイン作成から機能提案まで、依頼者の要望を反映したホームページを作成しました。',
        },
        hobby06: {
          title: '朝のルーティン スマホアプリ',
          description: '朝が苦手な自分を救うために、名言で始まる朝のルーティンアプリを作成しました。',
        },
      },
      skillNames: {
        php: 'PHP（Laravel、CakePHP）',
        react: 'React',
        vue: 'Vue.js',
        unity: 'Unity',
        python: 'Python',
        flutter: 'Flutter',
        reactNative: 'React Native',
      },
      tags: {
        teamDevelopment: '#チーム開発',
        personalDevelopment: '#個人開発',
        cursorDevelopment: '#Cursor開発',
      },
      timeline: {
        year: '年',
        experiencePeriod: '経験期間',
      },
    },
    contact: {
      title: 'お問い合わせ',
      form: {
        name: 'お名前',
        email: 'メールアドレス',
        message: 'お問い合わせ内容',
        submit: '送信する',
      },
      thankYou: {
        title: 'お問合せありがとうございます',
        message: 'お問合せ内容を確認させていただきますので、しばらくお待ちください。',
        backToTop: 'トップページへ戻る',
             },
     },
     profileCard: {
       description: '沖縄生まれ、ブルーハーツ育ち。考える前に行動する、なんくるないさ系エンジニアです。',
       viewProfile: 'プロフィールを見る',
     },
         blog: {
      title: 'ブログ',
      all: 'すべて',
      findOutMore: 'もっと見る',
    },
    announcements: {
      title: 'News',
      categories: {
        blogUpdate: 'ブログ更新',
        notification: 'お知らせ',
      },
      items: {
        '2025-08-20': {
          title: '言語切り替え（英語・日本語）を実装しました。',
          linkText: '',
        },
        '2025-04-22': {
          title: '記事を追加しました。',
          linkText: '『Reactでポートフォリオサイトを作成する 🚀（4）』',
        },
        '2025-04-21': {
          title: '記事を追加しました。',
          linkText: '『Reactでポートフォリオサイトを作成する 🚀（3）』',
        },
        '2025-04-01': {
          title: 'ゲーム（クロッシーロード）画面を追加しました。',
          linkText: 'Game',
        },
        '2025-03-08-blog': {
          title: '記事を追加しました。',
          linkText: 'forEach内でasync awaitはなぜ使えないのか',
        },
        // '2025-03-08-like': {
        //   title: 'ブログへのいいね機能を実装しました。',
        //   linkText: 'Blog',
        // },
      },
    },
  },
   en: {
    common: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      blog: 'Blog',
      portfolio: 'Portfolio',
      game: 'Game',
      tanka: 'Tanka',
      play: 'Play',
      language: 'Language',
      switchToJapanese: '日本語',
      switchToEnglish: 'English',
    },
    home: {
      title: 'Welcome',
      subtitle: 'to my site',
      description: 'This site showcases my work and blog posts.',
      mainMessage: 'To support mental health,\nTo the world that spreads beyond the screen,\nI put my thoughts into code,\nContinuing to challenge myself every day,\nI am a software engineer with a "nankurunaisa" spirit.',
    },
    navigation: {
      toggleMenu: 'Toggle menu',
      closeMenu: 'Close menu',
    },
    footer: {
      copyright: '© 2024 furugen',
      cities: {
        oka: 'Okinawa',
        hij: 'Hiroshima',
        tyo: 'Tokyo',
        bcd: 'Bacolod',
      },
    },
    profile: {
      title: 'Profile',
      subtitle: 'Furugen, Motoshi',
      career: {
        title: 'Career',
        1998: '1998',
        2017: '2017',
        2020: '2020',
        2021: '2021',
        2023: '2023',
        current: '~ Present',
        desc1998: 'Born in Okinawa',
        desc2017: 'After graduating from high school, entered the Faculty of Science, Department of Physics',
        desc2020: 'Started programming during university leave',
        desc2021: 'Experienced as a web engineer through a long-term internship',
        desc2023: 'Graduated from university and started working as an engineer',
        descCurrent: 'Currently working hard as a frontend engineer',
      },
      interest: {
        title: 'Interest',
        content: 'Just as physics unveils the invisible laws of nature, I find joy in handling invisible information called data through programming. At the same time, I feel the importance of being conscious of end users who connect through services. I am also interested in design and generative art, and want to provide exciting user experiences. Since I am not someone with strong mental fortitude, I also value mental health.',
      },
      passion: {
        title: 'Passion',
        reading: '• Reading: I irregularly organize book clubs with friends.',
        tanka: '• Tanka: I have written over 200 tanka poems casually on X.',
        walking: '• Walking: Morning, afternoon, and evening walks are my daily routine.',
        driving: '• Driving: I drive without any destination.',
        eisa: '• Eisa: Traditional performing art of Okinawa.',
        guitar: '• Guitar: Currently practicing arpeggios.',
        baseball: '• Baseball: I specialize in outfield. I also enjoy watching professional baseball.',
        darts: '• Darts: I like 19.',
        bowling: '• Bowling: I like to curve house balls.',
      },
      mbti: {
        title: 'MBTI',
        type: 'INFP-A',
        typeName: '(Mediator)',
        introvert: 'Introverted (I): I like spending time alone, such as walking and reading',
        intuitive: 'Intuitive (N): I enjoy creative and expressive activities like tanka and eisa',
        feeling: 'Feeling (F): I am interested in emotional changes in both myself and others',
        prospecting: 'Prospecting (P): My style is to take action first and then adjust',
        assertive: 'Assertive (A): I always have unfounded confidence in my heart',
      },
    },
    skills: {
      title: 'Portfolio',
      projects: 'Projects',
      skills: 'Skills',
      works: {
        work01: {
          title: 'Homepage (Local Supermarket)',
          description: 'I created a homepage for a local supermarket. I adopted a responsive design targeting smartphone users as the main target.',
        },
        work02: {
          title: 'Homepage (Day Service Facility)',
          description: 'Based on the request to make it operable even by non-engineers, I created a new homepage using WordPress.',
        },
        work03: {
          title: 'Homepage (Water Server)',
          description: 'I refreshed the existing site and incorporated new elements such as YouTube embeds and slideshows.',
        },
        hackathon01: {
          title: 'Today\'s Meal Decision App',
          description: 'I developed an app that suggests recipes that match the mood of the day. I proceeded with implementation while considering the response time of the Rakuten Recipe API.',
        },
        hackathon02: {
          title: 'Team Development Tutorial App',
          description: 'Based on team building challenges in hackathons, I developed an app that makes role assignment and task sharing easy.',
        },
        hackathon03: {
          title: 'Card Game Made with Python',
          description: 'I developed a card game that works in a local environment with Python and built a website to distribute it.',
        },
        hobby01: {
          title: 'Self-Exploration Program Reflection Site',
          description: 'I created a site that summarizes the content of the program I participated in and member information. The animated pixel art background was well received.',
        },
        hobby02: {
          title: 'Speech Bubble Processing Tool for That Scene',
          description: 'I developed a tool to rewrite speech bubbles to my liking so that the emotion of that famous scene can be applied to other situations.',
        },
        hobby03: {
          title: 'Tension Experience Game for That Scene',
          description: 'I created a password guessing game in the Numeron format that recreates a famous scene from a certain anime and allows you to experience the tension of world destruction.',
        },
        hobby04: {
          title: 'Unity-chan Mario-style Game',
          description: 'To learn the basics of Unity, I created a 2D Mario-style game. I strongly felt the greatness of game developers.',
        },
        hobby05: {
          title: 'Development Portfolio Site',
          description: 'Aiming to build a blog site with React, I created it with playfulness including the use of generative art and game screens.',
        },
        work04: {
          title: 'Homepage (Real Estate Company)',
          description: 'I created a homepage that reflects the client\'s requests, from design creation in Figma to functional proposals.',
        },
        hobby06: {
          title: 'Morning Routine Smartphone App',
          description: 'To save myself who is not good at mornings, I created a morning routine app that starts with famous quotes.',
        },
      },
      skillNames: {
        php: 'PHP (Laravel, CakePHP)',
        react: 'React',
        vue: 'Vue.js',
        unity: 'Unity',
        python: 'Python',
        flutter: 'Flutter',
        reactNative: 'React Native',
      },
      tags: {
        teamDevelopment: '#Team Dev',
        personalDevelopment: '#Personal Dev',
        cursorDevelopment: '#Cursor Dev',
      },
      timeline: {
        year: '',
        experiencePeriod: 'Experience Period',
      },
    },
    contact: {
      title: 'Contact',
      form: {
        name: 'Name',
        email: 'Email Address',
        message: 'Inquiry Content',
        submit: 'Submit',
      },
      thankYou: {
        title: 'Thank you for your inquiry',
        message: 'We will review your inquiry, so please wait a moment.',
        backToTop: 'Back to Top Page',
             },
     },
     profileCard: {
       description: 'Born in Okinawa, raised on Blue Hearts. I\'m a software engineer who acts before thinking.',
       viewProfile: 'View Profile',
     },
     blog: {
       title: 'Blog',
       all: 'All',
       findOutMore: 'Find Out More',
     },
     announcements: {
       title: 'News',
       categories: {
         blogUpdate: 'Blog Update',
         notification: 'Notification',
       },
       items: {
         '2025-08-20': {
           title: 'Language switching (Japanese/English) is now supported.',
           linkText: '',
         },
         '2025-04-22': {
           title: 'Added a new article.',
           linkText: '"Creating a Portfolio Site with React 🚀 (4)"',
         },
         '2025-04-21': {
           title: 'Added a new article.',
           linkText: '"Creating a Portfolio Site with React 🚀 (3)"',
         },
         '2025-04-01': {
           title: 'Added Game (Crossy Road) screen.',
           linkText: 'Game',
         },
         '2025-03-08-blog': {
           title: 'Added a new article.',
           linkText: 'Why async await cannot be used in forEach',
         },
         // '2025-03-08-like': {
         //   title: 'Implemented like function for blog.',
         //   linkText: 'Blog',
         // },
       },
     },
   },
}; 