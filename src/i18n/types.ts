export type Locale = 'ja' | 'en';

export type TranslationKeys = {
  common: {
    home: string;
    about: string;
    contact: string;
    blog: string;
    portfolio: string;
    game: string;
    tanka: string;
    play: string;
    language: string;
    switchToJapanese: string;
    switchToEnglish: string;
  };
  home: {
    title: string;
    subtitle: string;
    description: string;
    mainMessage: string;
  };
  navigation: {
    toggleMenu: string;
    closeMenu: string;
  };
  footer: {
    copyright: string;
    cities: {
      oka: string;
      hij: string;
      tyo: string;
      bcd: string;
    };
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
  skills: {
    title: string;
    projects: string;
    skills: string;
    works: {
      work01: { title: string; description: string };
      work02: { title: string; description: string };
      work03: { title: string; description: string };
      hackathon01: { title: string; description: string };
      hackathon02: { title: string; description: string };
      hackathon03: { title: string; description: string };
      hobby01: { title: string; description: string };
      hobby02: { title: string; description: string };
      hobby03: { title: string; description: string };
      hobby04: { title: string; description: string };
      hobby05: { title: string; description: string };
      work04: { title: string; description: string };
      hobby06: { title: string; description: string };
    };
    skillNames: {
      php: string;
      react: string;
      vue: string;
      unity: string;
      python: string;
      flutter: string;
             reactNative: string;
     };
     tags: {
       teamDevelopment: string;
       personalDevelopment: string;
       cursorDevelopment: string;
     };
     timeline: {
       year: string;
       experiencePeriod: string;
     };
   };
   contact: {
     title: string;
     form: {
       name: string;
       email: string;
       message: string;
       submit: string;
     };
     thankYou: {
       title: string;
       message: string;
       backToTop: string;
     };
   };
   profileCard: {
     description: string;
     viewProfile: string;
   };
     blog: {
    title: string;
    all: string;
    findOutMore: string;
  };
  announcements: {
    title: string;
    categories: {
      blogUpdate: string;
      notification: string;
    };
    items: {
      '2025-08-20': { title: string; linkText: string };
      '2025-04-22': { title: string; linkText: string };
      '2025-04-21': { title: string; linkText: string };
      '2025-04-01': { title: string; linkText: string };
      '2025-03-08-blog': { title: string; linkText: string };
      [key: string]: { title: string; linkText: string };
    };
  };
};

export type Translations = Record<Locale, TranslationKeys>; 