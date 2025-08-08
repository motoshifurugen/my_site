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
};

export type Translations = Record<Locale, TranslationKeys>; 