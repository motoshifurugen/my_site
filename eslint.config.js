import nextjs from '@next/eslint-plugin-next';
import prettier from 'eslint-plugin-prettier';
import tailwindcss from 'eslint-plugin-tailwindcss';

export default [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@next/next': nextjs,
      prettier,
      tailwindcss
    },
    extends: [
      'next/core-web-vitals',
      'plugin:prettier/recommended',
      'plugin:tailwindcss/recommended'
    ],
    rules: {
      'tailwindcss/migration-from-tailwind-2': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@next/next/no-page-custom-font': 'off',
      'prettier/prettier': 'error',
      'tailwindcss/no-custom-classname': [
        'warn',
        {
          whitelist: [
            'rightFooter',
            'leftFooter',
            'item-left',
            'items-top',
            'content-wrapper',
            'thank-you',
            'work-list',
            'border-main-black',
            'bg-main-white',
            'toc',
            'target-toc',
            'code-block-wrapper',
            'code-block-title',
            'code-block-container',
            'copy-button',
            'copy-message',
            'seagull',
            'seagull-1',
            'seagull-2',
            'wing',
            'left-wing',
            'right-wing',
            'circle',
            'night-circle'
          ]
        }
      ]
    }
  }
];
