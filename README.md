# Next.jsで開発ブログ付きのポートフォリオサイトを作成したい 🚀

| 利用環境                                      | バージョン              |
| --------------------------------------------- | ----------------------- |
| macOS                                         | Sonoma 14.5（M1チップ） |
| Node.js                                       | 20.12.2                 |
| [React](https://ja.react.dev/)                | 18                      |
| [Next.js](https://nextjs.org/)                | 14.2.5                  |
| [TypeScript](https://www.typescriptlang.org/) | 5                       |
| [tailwindcss](https://tailwindcss.com/)       | 3.4.1                   |

### デザインの参考にするサイト（完成イメージ）

- [TOP | 株式会社パズル](https://puzzle-inc.jp/)
- [szne](https://szn.jp/)

<!-- 上記サイトや適宜乗せている参考サイト、Github Copilotのおかげで、無事にポートフォリオが完成しました。本当にありがとうございます！ -->

### キャッチアップ方法

- [【2024年最新】React(v18)完全入門ガイド｜Hooks、Next14、Redux、TypeScript | Udemy](https://www.udemy.com/course/react-complete-guide/?couponCode=KEEPLEARNING)

## Nextアプリ作成

```zsh
npx create-next-app@latest
```

```zsh
Need to install the following packages:
create-next-app@14.2.5
Ok to proceed? (y)
```

yを入力してエンター

好みで答える。
意味については [create-next-appで訊かれていること](https://zenn.dev/ikkik/articles/51d97ff70bd0da) を参考にしました。

```zsh
✔ What is your project named? … my-site
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

```zsh
cd my-site
npm run dev
```

http://localhost:3000/

<img src="./img/portfolio01.png" alt="screenshot" width="600px">

いったん、page.tsxのreturn内とglobals.cssを削除した

<img src="./img/portfolio02.png" alt="screenshot" width="600px">

## アプリ全体のデザインをglobal.cssに設定

`page.tsx`にtailwindをimport
```javascript
import 'tailwindcss/tailwind.css';

export default function Home() {
  return (
    <body>
      <h1>Hello My Site!</h1>
    </body>
  );
}
```

`tailwind.config.ts`

```javascript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'bg-main' : '#F6F6F6',
      'font-main' : '#161616',
    },
    fontFamily: {
      'ryo-gothic-plusn': ['"ryo-gothic-plusn"', 'sans-serif'],
    }
  },
  plugins: [],
};
export default config;
```

`globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-bg-main text-font-main font-ryo-gothic-plusn;
}
```

## Headerの作成

[Tailblocks — Ready-to-use Tailwind CSS blocks](https://tailblocks.cc/)

`components/Header.tsx`←新規作成

```javascript
import Link from "next/link"
import 'tailwindcss/tailwind.css';

const Header = () => {
	return (
		<header>
		  <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
		    <a className="flex font-medium items-center mb-4 md:mb-0">
		      <span className="ml-3 text-xl">Motoshi Furugen</span>
		    </a>
		    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
		      <Link className="mr-10 hover:opacity-50" href="#">プロフィール</Link>
		      <Link className="mr-10 hover:opacity-50" href="#">開発ブログ</Link>
		      <Link className="mr-10 hover:opacity-50" href="#">実績</Link>
		      <Link className="mr-10 hover:opacity-50" href="#">コンタクト</Link>
		    </nav>
		  </div>
		</header>
	)
}

export default Header
```

`layout.tsx`を変更
```javascript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Motoshi Furugen",
  description: "This is Motoshi Furugen's personal website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
```

<img src="./img/portfolio03.png" alt="screenshot" width="600px">

## テキストアニメーションの作成

```zsh
npm install gsap
```

`components/TitleAnimation.tsx`←新規作成
```javascript
"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export default function TitleAnimation() {

  // 文字を一文字ずつ表示するアニメーション
  const textRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current, { duration: 1.75, text: "Furugen" });
    }
  }, []);

  return (
    <p
      className="
        w-full
        text-[8rem]
        text-left
        text-font-main
        font-dm-sans
        tracking-widest
        mx-[100px]
      "
      ref={textRef}
    ></p>
  );
}
```

<img src="./img/portfolio_gif01.gif" alt="screenshot" width="600px">

## メインメッセージ部分作成

MainMessageコンポーネントにメッセージを書き、フォント・行間を調整する。

`components/MainMessage.txs`←新しく追加

[Line Height - Tailwind CSS](https://tailwindcss.com/docs/line-height)

```javascript
export default function MainMessage() {
  return (
    <>
      <p className="text-2xl leading-loose">
        心の健康を支えるために、<br />
        画面の向こうに広がる世界へ、<br />
        想いをコードに込め、<br />
        毎日挑戦し続ける、<br />
        なんくるないさ系エンジニア。
      </p>
    </>
  );
}
```

`page.tsx`にて、`TitleAnimation`コンポーネントと`MainMessage`コンポーネントを横並びにする。

`page.tsx`
```javascript
・・・
<section className="main-face flex">
  <div className="flex-1">
    <TitleAnimation />
  </div>
  <div className="w-[480px]">
    <MainMessage />
  </div>
</section>
・・・
```

アイコンを使いたいのでfont 以下を参考にAwesome（無料版）を導入

- [Set Up with React | Font Awesome Docs](https://docs.fontawesome.com/web/use-with/react)
- [【Next.js】FontAwesomeを導入してアイコンを表示してみよう！ #Next.js - Qiita](https://qiita.com/takakou/items/de4d86f1acad6e4511d5)

メインメッセージの下にプロフィールへのリンクを追加

`MainMessage.tsx`

```javascript
<>
  <p className="text-2xl leading-loose mb-12">
    心の健康を支えるために、<br />
    画面の向こうに広がる世界へ、<br />
    想いをコードに込め、<br />
    毎日挑戦し続ける、<br />
    なんくるないさ系エンジニア。
  </p>
  <a href="#" className="text-xl group">
    プロフィール
    <button
      className="relative align-middle transition-all w-8 max-w-[32px] h-8 max-h-[32px] text-xs border border-font-main border-opacity-20 rounded-full ml-5 group-hover:bg-white"
      type="button">
      <span><FontAwesomeIcon icon={faArrowRight} /></span>
    </button>
  </a>
</>
```

<img src="./img/portfolio04.png" alt="screenshot" width="600px">

## プロフィール画面作成

`MainMessege`コンポーネント内に入れていたプロフィールへのリンク部分は`page.tsx`に一旦移し、メインメッセージをプロフィール画面でも使うことにする。

`app/pofile/page.tsx`←新たに作成

```javascript
import MainMessage from "../components/MainMessage";

export default function Page() {
  return (
    <section className="profile px-20">
      <div className="flex justify-center h-screen">
        <MainMessage />
      </div>
    </section>
  );
}
```

プロフィール欄を用意して、左に説明・右に写真を配置する。

`app/pofile/page.tsx`

```javascript
<section className="profile px-20">
  <h1 className="text-4xl font-bold">プロフィール</h1>
  <div className="flex justify-center">
    <MainMessage />
  </div>
  <div>
    <h2 className="text-3xl font-bold">経歴</h2>
    <div className="flex p-10">
      <p className="flex w-1/2 text-lg leading-loose items-center">
        <p className="mr-6 text-right">
          1998年<br />
          2017年<br />
          2020年<br />
          2021年<br />
          2023年<br />
          現在
        </p>
        <p>
          沖縄に生まれる<br />
          高校卒業後、広島大学理学部物理学科へ進学する<br />
          大学休学中にプログラミングを始める<br />
          長期インターンでWebエンジニアを経験する<br />
          大学卒業後、エンジニアとして就職する<br />
          フロントエンドエンジニアとして奮闘中
        </p>
      </p>
      <div className="w-1/2 flex justify-end">
        <Image src="/images/etsushi.jpg" alt="profile img 01" width={500} height={500} />
      </div>
    </div>
  </div>
</section>
```

<img src="./img/portfolio05.png" alt="screenshot" width="600px">

プロフィールで使用した3つの紹介（経歴・興味・趣味）の記述部分をコンポーネント化する。

`components/Card.tsx`←新たに作成

```javascript
// components/Card.tsx
import { ReactNode } from "react";
import Image from "next/image";

interface CardProps {
  title: string;
  content: ReactNode;
  imageSrc: string;
  imageAlt: string;
}

const Card: React.FC<CardProps> = ({ title, content, imageSrc, imageAlt }) => {
  return (
    <div className="card">
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="flex p-10 font-open-sans">
        <div className="flex w-1/2 text-lg leading-loose items-center">
          {content}
        </div>
        <div className="w-1/2 flex justify-end">
          <Image src={imageSrc} alt={imageAlt} width={500} height={500} />
        </div>
      </div>
    </div>
  );
};

export default Card;
```

`profile/page.tsx`にて、`Card`コンポーネントを使用する。

`profile/page.tsx`

```javascript
<Card
  title="経歴"
  content={
    <>
      <p className="mr-6 text-right">
        1998年<br />
        2017年<br />
        2020年<br />
        2021年<br />
        2023年<br />
        現在
      </p>
      <p>
        沖縄に生まれる<br />
        高校卒業後、広島大学理学部物理学科へ進学する<br />
        大学休学中にプログラミングを始める<br />
        長期インターンでWebエンジニアを経験する<br />
        大学卒業後、エンジニアとして就職する<br />
        フロントエンドエンジニアとして奮闘中
      </p>
    </>
  }
  imageSrc="/images/profile_01.jpg"
  imageAlt="profile img 01"
/>
<Card
  title="興味"
  content={
    <>
       <p>
         物理学が目に見えない自然の法則を解き明かすように、<br />
         データという見えない情報を扱うことに楽しさを感じています。<br />
         最近はバックエンドやネットワーク分野に興味があり、<br />
         今年はネットワークスペシャリストの資格に挑戦します。<br />
         心が強い方ではないので、メンタルヘルスへの関心も大切にしています。
       </p>
     </>
   }
   imageSrc="/images/profile_02.png"
   imageAlt="profile img 02"
 />
 <Card
   title="趣味"
   content={
     <>
       <p>
         エイサー（沖縄の伝統芸能） ・ 読書（ビジネス書中心） ・<br />
         散歩 ・ 短歌 ・ ギター（アコギ） ・ ドライブ ・ ボウリング <br />
         and more<br />
       </p>
     </>
  }
  imageSrc="/images/profile_03.jpg"
  imageAlt="profile img 03"
/>
```

## ヘッダー修正

ホーム画面以外の時は、ホーム画面へのリンクを左側に表示させる

- [Next.jsで今の場所（current url）を判定して表示を変える](https://zenn.dev/k_neko3/articles/893c2409f405b0)
- [Functions: useRouter | Next.js](https://nextjs.org/docs/pages/api-reference/functions/use-router)

usePathnameを利用する時は`"use client"を追加してクライアントコンポーネントにする必要がある

- ['use client' ディレクティブ – React](https://ja.react.dev/reference/rsc/use-client)

`component/Header.tsx`

```javascript
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const Header = () => {
	const pathname = usePathname();
  const isMainPage = pathname === "/";

	return (
		<header className="pt-5 pl-5 mb-20">
		  <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
				{!isMainPage && (
          <a href="/" className="flex font-mobo font-medium items-center mb-4 md:mb-0">
            <span className="ml-3 text-xl">Motoshi Furugen</span>
          </a>
        )}
		    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center font-mobo">
		      <Link className="mr-10 hover:opacity-50" href="/profile">プロフィール</Link>
		      <Link className="mr-10 hover:opacity-50" href="#">開発ブログ</Link>
		      <Link className="mr-10 hover:opacity-50" href="#">実績</Link>
		      <Link className="mr-10 hover:opacity-50" href="#">コンタクト</Link>
			  	<Link className="mr-10 hover:opacity-50" href="#">ソースコード</Link>
		    </nav>
		  </div>
		</header>
	)
}

export default Header
```

ヘッダーを上部に固定させる。headerに"fixed"を追加して、main要素にpadding-topを追加する。

`component/Header.txs`

```javascript
<header className="fixed top-0 left-0 w-full z-50 py-5 pl-5 mb-20 bg-bg-main">
```

`layout.tsx`

```javascript
<html lang="en">
  <body className={inter.className}>
    <Header />
    <main className="pt-40">
      {children}
    </main>
  </body>
</html>
```

Githubへのリンクを設置する

`components/Header.tsx`

```javascript
<Link className="mr-10 hover:bg-gray" href="https://github.com/motoshifurugen/my_site" target="_blank" rel="noopener noreferrer">
  <div className="flex items-center border border-gray-300 rounded px-3 py-1">
    <FontAwesomeIcon icon={faGithub} className="mr-2" />
    ソースコード
  </div>
</Link>
```

<img src="./img/portfolio06.png" alt="screenshot" width="600px">

プロフィール画面の修正

画面説明部分をコンポーネントに切り分ける

`components/PageFace.tsx`←新たに追加

```javascript
import React from 'react';

interface PageFaceProps {
  title: string;
  subtitle: string;
  mainMessage: React.ReactNode;
}

const PageFace: React.FC<PageFaceProps> = ({ title, subtitle, mainMessage }) => {
  return (
    <div className="flex mb-24">
      <div className="w-1/2">
        <h1 className="text-4xl font-bold">{title}</h1>
        <h2 className="text-2xl font-bold mt-5">{subtitle}</h2>
      </div>
      <div className="flex justify-left w-1/2">
        {mainMessage}
      </div>
    </div>
  );
};

export default PageFace;
```

`profile/page.tsx`ではPageFaceコンポーネントを呼ぶ。

```javascript
<PageFace
  title="プロフィール"
  subtitle="古堅基史（Furugen Motoshi）"
  mainMessage={<MainMessage />}
/>
```

PageFaceコンポーネントの下部に直線を表示させる。(アニメーション付き)

`components/PageFace.tsx`

```javascript
<div
  ref={lineRef}
  className="h-0.5 opacity-50 bg-font-main transition-all duration-1000 ease-in-out w-0 mt-4 mb-24"
></div>
```

<img src="./img/portfolio_gif02.gif" alt="screenshot" width="600px">

## トップページ改善

背景画像を適用させる

`components/BackgroundWrapper.tsx`←新たに作成

usePathname()でルートかどうかを判断

```javascript
"use client";

import { usePathname } from 'next/navigation';
import React from 'react';

const BackgroundWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isRootPath = pathname === '/';

  return (
    <div className="relative">
      {isRootPath && (
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 h-screen" style={{ backgroundImage: "url('/images/back-pic/day_01.jpg')" }}></div>
      )}
      <div className={`${isRootPath ? 'relative z-10' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
```

`layout.tsx`でbody内の要素をラップする。

```javascript
<html lang="en">
  <body className={inter.className}>
    <BackgroundWrapper>
      <Header />
      <main className="pt-40">
        {children}
      </main>
    </BackgroundWrapper>
  </body>
</html>
```

なんか文字の表示がサイトの読み込み不調？みたいにも見えてきたのでアニメーションを調整する

<img src="./img/portfolio_gif03.gif" alt="screenshot" width="600px">

### To be continued... 🍻