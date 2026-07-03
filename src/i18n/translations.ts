import { Translations } from './types'

export const translations: Translations = {
  ja: {
    common: {
      home: 'ホーム',
      about: 'プロフィール',
      contact: 'お問い合わせ',
      blog: 'ブログ',
      portfolio: '作品集',
      game: 'ゲーム',
      tanka: '短歌',
      play: '実験室',
      language: '言語',
      switchToJapanese: '日本語',
      switchToEnglish: 'English',
    },
    home: {
      title: 'ようこそ',
      subtitle: '古堅基史の開発ポートフォリオサイトへ',
      description:
        'このサイトはなんくるないさ系エンジニアの作品やブログを紹介するためのものです。',
      mainMessage:
        '心の健康を支えるために、\n画面の向こうに広がる世界へ、\n想いをコードに込め、\n日々挑戦を続ける、\nなんくるないさ系エンジニア。',
    },
    navigation: {
      toggleMenu: 'メニューを開く',
      closeMenu: 'メニューを閉じる',
    },
    footer: {
      copyright: 'Furugen Island',
      cities: {
        oka: '沖縄',
        hij: '広島',
        tyo: '東京',
        bcd: 'バコロド',
      },
    },
    profile: {
      title: 'プロフィール',
      subtitle: '古堅基史',
      career: {
        title: '足跡',
        1998: '1998年',
        2017: '2017年',
        2020: '2020年',
        2021: '2021年',
        2023: '2023年',
        current: '〜 現在',
        desc1998: '沖縄の海を見る',
        desc2017: '理学部物理学科へ進学',
        desc2020: '大学休学中にプログラミングの道へ',
        desc2021: '長期インターンでWebエンジニア',
        desc2023: '東京で就職し、ソフトウェア開発を担当',
        descCurrent: 'プロダクトエンジニア',
      },
      interest: {
        title: '興味',
        content:
          '物理学が目に見えない自然の法則を解き明かすように、手で掴めないデータを扱うことに楽しさを感じる。デザインやアートにも関心があり、ワクワクするようなユーザー体験を考える日々。自分自身が楽しめるように、メンタルヘルスも大切にする。',
      },
      passion: {
        title: '趣味',
        reading: '読書　・・・・・・特に、紙派',
        tanka: '短歌　・・・・・・特に、中澤系',
        walking: '散歩　・・・・・・特に、公園',
        driving: 'ドライブ　・・・・特に、あてもなく',
        eisa: 'エイサー　・・・・特に、道じゅねー',
        guitar: 'ギター　・・・・・特に、Dm',
        baseball: '野球　・・・・・・特に、上林誠知',
        darts: 'ダーツ　・・・・・特に、19',
        bowling: 'ボウリング　・・・特に、フック',
      },
      mbti: {
        title: 'MBTI',
        type: 'INFP-A',
        typeName: '（仲介者）',
        introvert: '内向型',
        intuitive: '直感型',
        feeling: '感情型',
        prospecting:
          '探索型',
        assertive: '自己主張的',
      },
    },
    skills: {
      title: 'ポートフォリオ',
      projects: '制作実績',
      skills: 'スキル',
      works: {
        work01: {
          title: 'ホームページ（地元スーパー）',
          description:
            '地元スーパーのホームページを作成しました。スマホユーザーを主なターゲットとし、レスポンシブデザインを採用しました。',
        },
        work02: {
          title: 'ホームページ（デイサービス施設）',
          description:
            'エンジニアでなくても運用できるようにとの要望を受け、WordPressを使って新たにホームページを作成しました。',
        },
        work03: {
          title: 'ホームページ（ウォーターサーバー）',
          description:
            '既存のサイトを刷新し、YouTube埋め込みやスライドショーなど新しい要素を取り入れました。',
        },
        hackathon01: {
          title: '今日の飯決めアプリ',
          description:
            'その日の気分に合ったレシピを提案するアプリを開発しました。楽天レシピAPIのレスポンス時間を考慮しながら実装を進めました。',
        },
        hackathon02: {
          title: 'チーム開発チュートリアルアプリ',
          description:
            'ハッカソンでのチームビルディングの課題を基に、役割分担やタスク共有を簡単に行えるアプリを開発しました。',
        },
        hackathon03: {
          title: 'Pythonで作るトランプゲーム',
          description:
            'Pythonでローカル環境で動作するトランプゲームを開発し、それを配布するためのWebサイトを構築しました。',
        },
        hobby01: {
          title: '自己探究プログラム振り返りサイト',
          description:
            '参加したプログラムの内容やメンバー情報などをまとめたサイトを作成しました。動くドット絵の背景が好評でした。',
        },
        hobby02: {
          title: 'あのシーンの吹き出し加工ツール',
          description:
            'あの名シーンの感動を他の場面でも応用できるよう、吹き出しを自分好みに書き換えるツールを開発しました。',
        },
        hobby03: {
          title: 'あのシーンの緊迫感体験ゲーム',
          description:
            '某アニメの名シーンを再現して世界崩壊の緊迫感を体験できる、ヌメロン形式のパスワード推測ゲームを作成しました。',
        },
        hobby04: {
          title: 'ユニティちゃんのマリオ風ゲーム',
          description:
            'Unityの基礎を学ぶために、2Dのマリオ風ゲームを作成しました。ゲーム開発者の凄さを強く実感しました。',
        },
        hobby05: {
          title: '開発ポートフォリオサイト',
          description:
            'Reactを使ったブログサイト構築を目指し、ジェネラティブアートの使用やゲーム画面など、遊び心もこめて作成しました。',
        },
        work04: {
          title: 'ホームページ（不動産会社）',
          description:
            'Figmaでのデザイン作成から機能提案まで、依頼者の要望を反映したホームページを作成しました。',
        },
        hobby06: {
          title: '朝のルーティン スマホアプリ',
          description:
            '朝が苦手な自分を救うために、名言で始まる朝のルーティンアプリを作成しました。',
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
        required: '必須',
      },
      thankYou: {
        title: 'お問合せありがとうございます',
        message:
          'お問合せ内容を確認させていただきますので、しばらくお待ちください。',
        backToTop: 'トップページへ戻る',
      },
    },
    profileCard: {
      description:
        '沖縄生まれ、ブルーハーツ育ち。考える前に行動する、なんくるないさ系エンジニア。',
      viewProfile: 'プロフィールを見る',
    },
    blog: {
      title: 'ブログ',
      all: 'すべて',
      findOutMore: 'もっと見る',
      channels: {
        heading: '他の場所でも書いています',
        zenn: '技術記事は Zenn へ',
        note: 'ラフな雑記は note へ',
      },
    },
    announcements: {
      title: 'News',
      categories: {
        blogUpdate: 'ブログ更新',
        notification: 'お知らせ',
      },
      items: {
        '2025-09-27': {
          title: '作成した短歌のページを追加しました。',
          linkText: '短歌',
        },
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
        // '2025-03-08-blog': {
        //   title: '記事を追加しました。',
        //   linkText: 'forEach内でasync awaitはなぜ使えないのか',
        // },
        // '2025-03-08-like': {
        //   title: 'ブログへのいいね機能を実装しました。',
        //   linkText: 'Blog',
        // },
      },
    },
    errors: {
      title: 'エラーが発生しました',
      message:
        'ページの表示中に問題が発生しました。お手数ですが再試行してください。',
      retry: '再試行',
    },
  },
  en: {
    common: {
      home: 'Home',
      about: 'Profile',
      contact: 'Contact',
      blog: 'Blog',
      portfolio: 'Showcase',
      game: 'Game',
      tanka: 'Tanka',
      play: 'Lab',
      language: 'Language',
      switchToJapanese: '日本語',
      switchToEnglish: 'English',
    },
    home: {
      title: 'Welcome',
      subtitle: 'to my site',
      description: 'This site showcases my work and posts.',
      mainMessage:
        'I am a product engineer, \ncrafting App with JS / PHP / Python, \nexporing AI technologies.\nCode → Walk around → Drink coffee.',
    },
    navigation: {
      toggleMenu: 'Toggle menu',
      closeMenu: 'Close menu',
    },
    footer: {
      copyright: 'Furugen Island',
      cities: {
        oka: 'Okinawa',
        hij: 'Hiroshima',
        tyo: 'Tokyo',
        bcd: 'Bacolod',
      },
    },
    profile: {
      title: 'Profile',
      subtitle: 'Motoshi Furugen',
      career: {
        title: 'Career',
        1998: '1998',
        2017: '2017',
        2020: '2020',
        2021: '2021',
        2023: '2023',
        current: '~ Present',
        desc1998: 'Born in Okinawa',
        desc2017:
          'After graduating from high school, leaned about physics at university',
        desc2020: 'Started programming',
        desc2021:
          'Experienced as a web engineer through a long-term internship',
        desc2023:
          'Started working as a software engineer',
        descCurrent: 'Currently working as a product engineer',
      },
      interest: {
        title: 'Interest',
        content:
          'Just as physics reveals the invisible laws of nature, I find joy in handling data by programming. I also find the importance of design and art.',
      },
      passion: {
        title: 'Passion',
        reading: '• Reading: I like to share feelings with my friends.',
        tanka: '• Tanka: I like to write tanka poems casually.',
        walking:
          '• Walking: Everywhere, anytime.',
        driving: '• Driving: Everywhere, anytime.',
        eisa: '• Eisa: Traditional performing art of Okinawa.',
        guitar: '• Guitar: Especially, I like Dm.',
        baseball:
          '• Baseball: Enjoying to watch and play baseball.',
        darts: '• Darts: I usually try to hit 19.',
        bowling: '• Bowling: Curving ball is fun.',
      },
      mbti: {
        title: 'MBTI',
        type: 'INFP-A',
        typeName: '(Mediator)',
        introvert:
          'Introverted',
        intuitive:
          'Intuitive',
        feeling:
          'Feeling',
        prospecting:
          'Prospecting',
        assertive:
          'Assertive',
      },
    },
    skills: {
      title: 'Portfolio',
      projects: 'Projects',
      skills: 'Skills',
      works: {
        work01: {
          title: 'Homepage (Local Supermarket)',
          description:
            'I created a homepage for a local supermarket. I adopted a responsive design targeting smartphone users as the main target.',
        },
        work02: {
          title: 'Homepage (Day Service Facility)',
          description:
            'Based on the request to make it operable even by non-engineers, I created a new homepage using WordPress.',
        },
        work03: {
          title: 'Homepage (Water Server)',
          description:
            'I refreshed the existing site and incorporated new elements such as YouTube embeds and slideshows.',
        },
        hackathon01: {
          title: "Today's Meal Decision App",
          description:
            'I developed an app that suggests recipes that match the mood of the day. I proceeded with implementation while considering the response time of the Rakuten Recipe API.',
        },
        hackathon02: {
          title: 'Team Development Tutorial App',
          description:
            'Based on team building challenges in hackathons, I developed an app that makes role assignment and task sharing easy.',
        },
        hackathon03: {
          title: 'Card Game Made with Python',
          description:
            'I developed a card game that works in a local environment with Python and built a website to distribute it.',
        },
        hobby01: {
          title: 'Self-Exploration Program Reflection Site',
          description:
            'I created a site that summarizes the content of the program I participated in and member information. The animated pixel art background was well received.',
        },
        hobby02: {
          title: 'Speech Bubble Processing Tool for That Scene',
          description:
            'I developed a tool to rewrite speech bubbles to my liking so that the emotion of that famous scene can be applied to other situations.',
        },
        hobby03: {
          title: 'Tension Experience Game for That Scene',
          description:
            'I created a password guessing game in the Numeron format that recreates a famous scene from a certain anime and allows you to experience the tension of world destruction.',
        },
        hobby04: {
          title: 'Unity-chan Mario-style Game',
          description:
            'To learn the basics of Unity, I created a 2D Mario-style game. I strongly felt the greatness of game developers.',
        },
        hobby05: {
          title: 'Development Portfolio Site',
          description:
            'Aiming to build a blog site with React, I created it with playfulness including the use of generative art and game screens.',
        },
        work04: {
          title: 'Homepage (Real Estate Company)',
          description:
            "I created a homepage that reflects the client's requests, from design creation in Figma to functional proposals.",
        },
        hobby06: {
          title: 'Morning Routine Smartphone App',
          description:
            'To save myself who is not good at mornings, I created a morning routine app that starts with famous quotes.',
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
        required: 'Required',
      },
      thankYou: {
        title: 'Thank you for your inquiry',
        message: 'We will review your inquiry, so please wait a moment.',
        backToTop: 'Back to Top Page',
      },
    },
    profileCard: {
      description:
        "Born in Okinawa, raised on Blue Hearts. I'm a software engineer who acts before thinking.",
      viewProfile: 'View Profile',
    },
    blog: {
      title: 'Blog',
      all: 'All',
      findOutMore: 'Find Out More',
      channels: {
        heading: 'I also write in other places',
        zenn: 'Tech articles on Zenn',
        note: 'Casual notes on note',
      },
    },
    announcements: {
      title: 'News',
      categories: {
        blogUpdate: 'Blog Update',
        notification: 'Notification',
      },
      items: {
        '2025-09-27': {
          title: 'Added Tanka page.',
          linkText: 'Tanka (Japanese short poem)',
        },
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
        //  '2025-03-08-blog': {
        //    title: 'Added a new article.',
        //    linkText: 'Why async await cannot be used in forEach',
        //  },
        // '2025-03-08-like': {
        //   title: 'Implemented like function for blog.',
        //   linkText: 'Blog',
        // },
      },
    },
    errors: {
      title: 'Something went wrong',
      message:
        'An error occurred while displaying this page. Please try again.',
      retry: 'Retry',
    },
  },
}
