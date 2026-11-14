import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import tailwindcss from 'eslint-plugin-tailwindcss'

export default [
  {
    ignores: [
      'node_modules/',
      '.next/',
      '.nuxt/',
      '.astro/',
      'build/',
      'dist/',
      'out/',
      'public/',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'vite.config.ts',
      'next.config.mjs',
      'tsconfig.json',
      'src/env.d.ts',
      '**/*.cjs',
      '**/*.mjs',
    ],
  },
  ...nextCoreWebVitals,
  prettierRecommended,
  ...tailwindcss.configs['flat/recommended'],
  {
    rules: {
      'tailwindcss/migration-from-tailwind-2': 'off',
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
            'seagull',
            'seagull-1',
            'seagull-2',
            'wing',
            'left-wing',
            'right-wing',
            'circle',
            'night-circle',
          ],
        },
      ],
    },
  },
]
