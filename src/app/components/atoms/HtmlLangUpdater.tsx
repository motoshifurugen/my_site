'use client';

import { useI18n } from '@/i18n';
import { useEffect } from 'react';

export default function HtmlLangUpdater() {
  const { locale } = useI18n();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
} 