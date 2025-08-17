export type Locale = 'ja' | 'en';

export type TranslationKeys = {
  common: {
    home: string;
    about: string;
    contact: string;
    blog: string;
    portfolio: string;
    game: string;
    language: string;
    switchToJapanese: string;
    switchToEnglish: string;
  };
  home: {
    title: string;
    subtitle: string;
    description: string;
  };
  navigation: {
    toggleMenu: string;
    closeMenu: string;
  };
  profile: {
    title: string;
    subtitle: string;
    career: {
      title: string;
      1998: string;
      2017: string;
      2020: string;
      2021: string;
      2023: string;
      current: string;
      desc1998: string;
      desc2017: string;
      desc2020: string;
      desc2021: string;
      desc2023: string;
      descCurrent: string;
    };
    interest: {
      title: string;
      content: string;
    };
    passion: {
      title: string;
      reading: string;
      tanka: string;
      walking: string;
      driving: string;
      eisa: string;
      guitar: string;
      baseball: string;
      darts: string;
      bowling: string;
    };
    mbti: {
      title: string;
      type: string;
      typeName: string;
      introvert: string;
      intuitive: string;
      feeling: string;
      prospecting: string;
      assertive: string;
    };
  };
};

export type Translations = Record<Locale, TranslationKeys>; 