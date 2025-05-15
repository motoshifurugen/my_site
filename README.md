# 🌴 Furugen's Island - 技術ブログ付きポートフォリオサイト

[![最終コミット](https://img.shields.io/github/last-commit/motoshifurugen/my_site?style=flat-square)](https://github.com/motoshifurugen/my_site/commits/main)
[![Vercelでデプロイ](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&style=flat-square)](https://vercel.com)
[![サイト表示中](https://img.shields.io/website?url=https%3A%2F%2Ffurugen-island.com%2Fmy_site&style=flat-square)](https://furugen-island.com/my_site)
[![Code Size](https://img.shields.io/github/languages/code-size/motoshifurugen/my_site?style=flat-square)](https://github.com/motoshifurugen/my_site)
[![UI](https://img.shields.io/badge/UI-TailwindCSS-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)]()
[![Language](https://img.shields.io/badge/Language-TypeScript-3178c6?logo=typescript&logoColor=white&style=flat-square)]()
[![Design](https://img.shields.io/badge/Design-Atomic%20Design-4caf50?style=flat-square)]()

Next.js × Tailwind CSS で作った、なんくるないさ系エンジニアの拠点です。

MDX対応の技術ブログで日々の開発を記録しながら、ジェネラティブアートやクロッシーロードのゲーム画面など、訪問者がワクワクするようなサイトを目指しています。

[🚀 サイトはこちら](https://furugen-island.com/my_site)

<img src="https://i.gyazo.com/b29ef2cfe77ffa5e03b0ee54ebff187e.png" alt="Image from Gyazo" width="1634"/>

## 🛠️ 主な使用技術
- **Next.js**
- **Tailwind CSS**
- **TypeScript**
- **Vercel**（ホスティング）
- **MDX**（ブログ）
- **p5.js**（ジェネラティブアート）

## 🧑‍💻 ローカル起動手順
```bash
# 1. リポジトリをクローン
git clone https://github.com/your-username/furugen-island.git
cd furugen-island

# 2. パッケージをインストール
npm install

# 3. 開発サーバーを起動
npm run dev
```
http://localhost:3000/my_site でポートフォリオサイトが表示されます。

## 🧱 コンポーネント設計：Atomic Design 採用
```cpp
src/
└── components/
    ├── atoms/       // ボタン・テキスト・アイコンなど最小単位
    ├── molecules/   // 入力フォーム・カードなどの複合要素
    ├── organisms/   // ヘッダー・記事リストなどのまとまり
    └── templates/   // ページの骨組み
```
詳細なディレクトリ構成は [utihub（motoshifurugen/my_site）](https://uithub.com/motoshifurugen/my_site) を参照してください。

## 📘 開発ログ

- [#1 Nextアプリ立ち上げ・TOP画面作成](https://furugen-island.com/my_site/blog/create_my_site)
- [#2 ヘッダー・プロフィール画面作成](https://furugen-island.com/my_site/blog/create_my_site_2) 
- [#3 ポートフォリオ画面・コンタクト画面・フッター作成](https://furugen-island.com/my_site/blog/create_my_site_3)
- [#4 デプロイ・レイアウト調整](https://furugen-island.com/my_site/blog/create_my_site_4)
