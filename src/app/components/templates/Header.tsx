"use client";

import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import nextConfig from "../../../../next.config.mjs";
import React, { useState, useEffect } from "react";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import GithubLinkButton from "../molecules/GithubLinkButton";
import TitleLinkButton from "../atoms/TitleLinkButton";
import HeaderLinkButton from "../molecules/HeaderLinkButton";

const BASE_PATH = nextConfig.basePath || "";

// ヘッダーリンク
const links = [
  { href: "/profile", text: "プロフィール" },
  { href: "/blog", text: "開発ブログ" },
  { href: "/skills", text: "実績" },
  { href: "/contact", text: "コンタクト" },
];

const Header = () => {
  // ハンバーガーメニューの開閉
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const pathname = usePathname();
  const isMainPage = pathname === `${BASE_PATH}/` || pathname === "/";

  useEffect(() => {
    // ページ遷移後にスクロール位置をトップにリセット
    window.scrollTo(0, 0);
  }, [pathname]);

  // ページ遷移時にメニューを閉じる
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`
			z-50 fixed top-0 left-0 w-full
			${!isMainPage ? "bg-main-white" : "bg-transparent"}
		`}
    >
      <div className="container flex flex-col md:flex-row mx-auto py-8">
        <div className="container z-50 flex items-center px-4 animate-fade-in-up">
          {/* タイトルボタン（トップページ以外で表示） */}
          {!isMainPage && (
            <TitleLinkButton href={`${BASE_PATH}/`} text="Furugen's Island" />
          )}

          {/* ハンバーガーボタン（スマホ画面でのみ表示） */}
          <button
            className="md:hidden ml-auto text-2xl bg-white rounded-full w-12 h-12 flex items-center justify-center"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>
        </div>

        <div className="container flex">
          <nav
            className={`
					  flex flex-wrap flex-col md:flex-row item-left
					  fixed top-0 right-0 h-full bg-white transform transition-transform duration-300 ease-in-out
					  ${menuOpen ? "translate-x-0" : "translate-x-full"} md:relative md:translate-x-0 md:bg-transparent
						pt-32 px-4 md:p-0 w-full
					`}
          >
            {links.map((link, index) => (
              <HeaderLinkButton
                key={index}
                href={link.href}
                text={link.text}
                index={index}
              />
            ))}
            <GithubLinkButton />
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Header;
