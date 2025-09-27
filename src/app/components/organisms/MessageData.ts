import { Locale } from '@/i18n/types';

export interface AnnouncementLink {
  url: string;
  textKey: string;
}

export interface AnnouncementData {
  date: string;
  categoryKey: 'blogUpdate' | 'notification';
  titleKey: string;
  link?: AnnouncementLink;
}

export const announcementsData: AnnouncementData[] = [
  {
    date: '2025/09/27',
    categoryKey: 'notification',
    titleKey: '2025-09-27',
    link: {
      url: 'https://furugen-island.com/my_site/tanka',
      textKey: '2025-09-27',
    },
  },
  {
    date: '2025/08/20',
    categoryKey: 'notification',
    titleKey: '2025-08-20',
  },
  {
    date: '2025/04/22',
    categoryKey: 'blogUpdate',
    titleKey: '2025-04-22',
    link: {
      url: 'https://furugen-island.com/my_site/blog/create_my_site_4',
      textKey: '2025-04-22',
    },
  },
  {
    date: '2025/04/21',
    categoryKey: 'blogUpdate',
    titleKey: '2025-04-21',
  },
  {
    date: '2025/04/01',
    categoryKey: 'notification',
    titleKey: '2025-04-01',
    link: {
      url: 'https://furugen-island.com/my_site/game',
      textKey: '2025-04-01',
    },
  },
  // {
  //   date: '2025/03/08',
  //   categoryKey: 'blogUpdate',
  //   titleKey: '2025-03-08-blog',
  //   link: {
  //     url: 'https://furugen-island.com/my_site/blog/async_await_with_forEach',
  //     textKey: '2025-03-08-blog',
  //   },
  // },
  // {
  //   date: '2025/03/08',
  //   categoryKey: 'notification',
  //   titleKey: '2025-03-08-like',
  //   link: {
  //     url: 'https://furugen-island.com/my_site/blog',
  //     textKey: '2025-03-08-like',
  //   },
  // },
  // {
  //   date: '2025/02/02',
  //   category: 'お知らせ',
  //   title: 'ダークモードを実装しました。',
  // },
  // {
  //   date: '2025/01/13',
  //   category: 'ブログ更新',
  //   title: '記事を追加しました。',
  //   link: {
  //     url: 'https://furugen-island.com/my_site/blog/create_my_site_2',
  //     text: '『Reactでポートフォリオサイトを作成する 🚀（2）』',
  //   },
  // },
  // {
  //   date: '2025/01/01',
  //   category: 'ブログ更新',
  //   title: 'あけましておめでとうございます。記事を追加しました。',
  //   link: {
  //     url: 'https://furugen-island.com/my_site/blog/goodbye_2024_welcome_2025',
  //     text: '『個人的な2024年の振り返りと2025年の抱負』',
  //   },
  // },
  // {
  //   date: '2024/11/11',
  //   category: 'お知らせ',
  //   title: '当サイトをリリースしました！',
  // },
]
