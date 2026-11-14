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
        prospecting: '探索型',
        assertive: '自己主張的',
      },
    },
    skills: {
      title: 'ポートフォリオ',
      projects: '制作実績',
      skills: 'スキル',
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
      relatedArticles: '関連記事',
      search: {
        label: '記事を検索',
        placeholder: 'タイトル・タグ・本文で検索',
        noResults: '該当する記事がありません',
      },
      tagList: 'カテゴリ',
      share: {
        heading: 'この記事をシェアする',
        message:
          '読んでくれてありがとうございます。役に立った・おもしろかったと思ったら、誰かに教えてもらえるとうれしいです。',
        x: 'X でシェア',
        hatena: 'はてなブックマーク',
        copyLink: 'リンクをコピー',
        copied: 'コピーしました',
      },
    },
    announcements: {
      title: 'News',
      categories: {
        blogUpdate: 'ブログ更新',
        notification: 'お知らせ',
      },
      items: {
        '2026-09-06': {
          title: '作品集に新しい作品を追加しました。',
          linkText: '作品集',
        },
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
        desc2023: 'Started working as a software engineer',
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
        walking: '• Walking: Everywhere, anytime.',
        driving: '• Driving: Everywhere, anytime.',
        eisa: '• Eisa: Traditional performing art of Okinawa.',
        guitar: '• Guitar: Especially, I like Dm.',
        baseball: '• Baseball: Enjoying to watch and play baseball.',
        darts: '• Darts: I usually try to hit 19.',
        bowling: '• Bowling: Curving ball is fun.',
      },
      mbti: {
        title: 'MBTI',
        type: 'INFP-A',
        typeName: '(Mediator)',
        introvert: 'Introverted',
        intuitive: 'Intuitive',
        feeling: 'Feeling',
        prospecting: 'Prospecting',
        assertive: 'Assertive',
      },
    },
    skills: {
      title: 'Portfolio',
      projects: 'Projects',
      skills: 'Skills',
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
      relatedArticles: 'Related Articles',
      search: {
        label: 'Search articles',
        placeholder: 'Search by title, tag, or text',
        noResults: 'No matching articles',
      },
      tagList: 'Categories',
      share: {
        heading: 'Share this article',
        message:
          'Thanks for reading. If you found it useful, please pass it on.',
        x: 'Share on X',
        hatena: 'Hatena Bookmark',
        copyLink: 'Copy link',
        copied: 'Copied',
      },
    },
    announcements: {
      title: 'News',
      categories: {
        blogUpdate: 'Blog Update',
        notification: 'Notification',
      },
      items: {
        '2026-09-06': {
          title: 'Added new works to the portfolio.',
          linkText: 'Showcase',
        },
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
