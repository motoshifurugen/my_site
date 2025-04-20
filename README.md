# Next.jsで開発ブログ付きのポートフォリオサイトを作成したい 🚀

| 利用環境                                      | バージョン              |
| --------------------------------------------- | ----------------------- |
| macOS                                         | Sonoma 14.5（M1チップ） |
| Node.js                                       | 20.12.2                 |
| [React](https://ja.react.dev/)                | 18                      |
| [Next.js](https://nextjs.org/)                | 14.2.5                  |
| [TypeScript](https://www.typescriptlang.org/) | 5                       |
| [tailwindcss](https://tailwindcss.com/)       | 3.4.1                   |

## 本サイトの開発ブログ

https://furugen-island.com/my_site/blog/create_my_site

https://furugen-island.com/my_site/blog/create_my_site_2

https://furugen-island.com/my_site/blog/create_my_site_3

## github pagesにて公開

- [Next.js 14.1 を GitHub Pages にデプロイするガイド](https://zenn.dev/kazzyfrog/articles/8e24dfe951aad9)

path関連でたくさんエラー出たので、以下のように修正

```javascript
(-) const isRootPath = pathname === '/';
(+) const isRootPath = pathname === `${BASE_PATH}/` || pathname === "/";
```

デプロイ成功!

<img src="./img/portfolio11.png" alt="screenshot" width="600px">

### https://motoshifurugen.github.io/my_site/ で公開された🙌

## レスポンシブ対応

ヘッダーメニューをレスポンシブ対応（ハンバーガーメニュー追加）する

`components/Header.tsx`

```javascript
<header
  className={`
			fixed top-0 left-0 w-full z-50
			py-3 mb-20 px-8
			${!isMainPage ? 'bg-bg-main' : 'bg-transparent'}
		`}
>
  <div className="container mx-auto flex flex-wrap py-5 flex-col md:flex-row items-center">
    <div className="container mx-auto flex z-50">
      {!isMainPage && (
        <a href={`${BASE_PATH}/`} className="flex font-mobo my-2 md:mb-0">
          <span className="ml-3 text-3xl md:text-xl">
            Furugen&apos;s Island
          </span>
        </a>
      )}
      <button
        className="md:hidden ml-auto text-2xl bg-white rounded-full w-12 h-12 flex items-center justify-center"
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </button>
    </div>
    <nav
      className={`
				  flex flex-wrap flex-col md:flex-row
					item-left md:items-center text-base md:justify-center
					font-mobo
				  fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
				  ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
				  md:relative md:translate-x-0 md:bg-transparent md:shadow-none
					md:ml-auto
					w-full md:w-auto
					pt-40 px-10 md:py-0 md:px-0 md:bg-transparent
				`}
    >
      <Link
        className="mb-8 md:mb-0 md:mr-10 text-xl md:text-base hover:opacity-50"
        href="/profile"
      >
        プロフィール
      </Link>
      <Link
        className="mb-8 md:mb-0 md:mr-10 text-xl md:text-base hover:opacity-50"
        href="/blog"
      >
        開発ブログ
      </Link>
      <Link
        className="mb-8 md:mb-0 md:mr-10 text-xl md:text-base hover:opacity-50"
        href="/skills"
      >
        実績
      </Link>
      <Link
        className="mb-8 md:mb-0 md:mr-10 text-xl md:text-base hover:opacity-50"
        href="/contact"
      >
        コンタクト
      </Link>
      <Link
        className="mb-8 md:mb-0 md:mr-10 text-xl md:text-base hover:bg-gray"
        href="https://github.com/motoshifurugen/my_site"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex items-center border border-gray-300 rounded px-3 py-1">
          <FontAwesomeIcon icon={faGithub} className="mr-2" />
          ソースコード
        </div>
      </Link>
    </nav>
  </div>
</header>
```

<img src="./img/portfolio12.png" alt="screenshot" width="300px">

スタイルは`md`をつけるかつけないかで一つ一つやっているので汚い。効率化できないか。

同様に他ページもレスポンシブ対応する。

## Not Found用のページ作成

not found時に表示できる画面をカスタマイズできるらしい

`app/not-found.tsx`←新たに作成

<img src="./img/portfolio13.png" alt="screenshot" width="300px">

## GoogleAnalytics導入

- [【Next.js】Next.js14でGoogleAnalytics（GA4）を導入する方法 | Neightbor. | あなたのビジネスをWEBで支える](https://neightbor.jp/blog/nextjs14-ga4)

## cssルール決め

- 上下方向の余白は「-top」を使用する。（上下方向は、できるだけy方向指定ではなくtopのみ指定を使う）
- メインカラーとして「main-white」「main-black」を用意して使用する。
- classNameの各順序は以下
  - 特殊なやつ（container、z-indexなど）
  - flex関係
  - 幅・高さ
  - アニメーション
- 意味を持たないクラスは当てない

## コンポーネント見直し

Atomic designを参考に、以下のフォルダにコンポーネントを分類する。

- atoms
- molecules
- organism
- templates

## 技術ブログ作成

以下を参考に作成する

- [cmb-sy/blog at 205add321487d7b292cb272e27fd784831cec902](https://github.com/cmb-sy/blog/tree/205add321487d7b292cb272e27fd784831cec902)
- [【SSR、SSG、ISRでブログを作る】Nextjs14初心者入門](https://zenn.dev/y_ta/books/eec3b78567aeeb)
