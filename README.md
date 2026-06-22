# Furugen's Island 🏝️ - ブログ付きポートフォリオサイト

[![最終コミット](https://img.shields.io/github/last-commit/motoshifurugen/my_site?style=flat-square)](https://github.com/motoshifurugen/my_site/commits/main)
[![GitHub Pagesでデプロイ](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=githubpages&style=flat-square)](https://github.com/motoshifurugen/my_site/actions/workflows/nextjs.yml)
[![サイト表示中](https://img.shields.io/website?url=https%3A%2F%2Ffurugen-island.com%2Fmy_site&style=flat-square)](https://furugen-island.com/my_site)
[![Code Size](https://img.shields.io/github/languages/code-size/motoshifurugen/my_site?style=flat-square)](https://github.com/motoshifurugen/my_site)
[![UI](https://img.shields.io/badge/UI-TailwindCSS-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)]()
[![Language](https://img.shields.io/badge/Language-TypeScript-3178c6?logo=typescript&logoColor=white&style=flat-square)]()
[![Design](https://img.shields.io/badge/Design-Atomic%20Design-4caf50?style=flat-square)]()

Next.js × Tailwind CSS で作った、なんくるないさ系エンジニアの拠点です。

MDX対応ブログで日々を記録しながら、ジェネラティブアートや色々試してみる実験室など、訪問者がワクワクするようなサイトを目指しています。

[🚀 サイトはこちら](https://furugen-island.com/my_site)

| Light Mode | Dark Mode |
|------------|-----------|
| ![Light Mode Home](https://i.gyazo.com/e2c179796cda9378c02dcf1b8c9e2619.gif) | ![Dark Mode Home](https://i.gyazo.com/a6b92492c40d4f53a3f93e8158bdd4bf.gif) |

## 🛠️ 主な使用技術
- **Next.js**
- **Tailwind CSS**
- **TypeScript**
- **GitHub Pages**（静的サイトのホスティング）
- **Vercel**（API のホスティング）
- **MDX**（ブログ）
- **p5.js**（ジェネラティブアート）
- **Three.js**（ゲーム画面）

## ローカル起動手順

```bash
git clone https://github.com/motoshifurugen/my_site.git
```

```bash
cd my_site
```

```bash
npm install
```

```bash
npm run dev
```

http://localhost:3000/my_site でサイトが表示されます。

## デプロイ構成

本番は静的サイトと API の二元構成です。

- **静的サイト**: `main` ブランチへの push をトリガーに、GitHub Actions（`.github/workflows/nextjs.yml`）が静的エクスポートして GitHub Pages へ自動デプロイします。これが正規のデプロイ経路です。
- **API**: Vercel にホスティングしています。静的サイトからは `NEXT_PUBLIC_API_URL` 経由で API を呼び出します。

> `package.json` の `deploy` スクリプト（`gh-pages` ブランチへの手動 subtree push）は旧構成の名残で、現在の `next.config.mjs` では `out/` を生成しないため動作しません。デプロイは上記 CI を使用してください。

## コンポーネント設計：Atomic Design 採用

```cpp
src/
└── components/
    ├── atoms/       // ボタン・テキスト・アイコンなど最小単位
    ├── molecules/   // 入力フォーム・カードなどの複合要素
    ├── organisms/   // ヘッダー・記事リストなどのまとまり
    └── templates/   // ページの骨組み
```

詳細なディレクトリ構成は [utihub（motoshifurugen/my_site）](https://uithub.com/motoshifurugen/my_site) 参照。

## サイト開発ログ

- [#1 Nextアプリ立ち上げ・TOP画面作成](https://furugen-island.com/my_site/blog/create_my_site)
- [#2 ヘッダー・プロフィール画面作成](https://furugen-island.com/my_site/blog/create_my_site_2) 
- [#3 ポートフォリオ画面・コンタクト画面・フッター作成](https://furugen-island.com/my_site/blog/create_my_site_3)
- [#4 デプロイ・レイアウト調整](https://furugen-island.com/my_site/blog/create_my_site_4)
