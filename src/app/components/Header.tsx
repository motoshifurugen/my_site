"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import nextConfig from "../../../next.config.mjs";
import React, { useState, useEffect } from "react";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
const BASE_PATH = nextConfig.basePath || "";

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
		<header className={`
			fixed top-0 left-0 w-full z-50
			py-3 mb-20 px-8
			${!isMainPage ? 'bg-bg-main' : 'bg-transparent'}
		`}>
		  <div className="container mx-auto flex py-5 flex-col md:flex-row items-center">
				<div className="container flex z-40">
					{!isMainPage && (
        	  <a href={`${BASE_PATH}/`} className="flex font-mobo my-2 md:mb-0">
        	    <span className="ml-3 text-3xl md:text-xl	animate-fade-in-up">Furugen&apos;s Island</span>
        	  </a>
        	)}
					 <button
        	  className="md:hidden ml-auto text-2xl bg-white rounded-full w-12 h-12 flex items-center justify-center"
        	  onClick={toggleMenu}
        	>
        	  <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        	</button>
				</div>
				<div className="container flex">
					<nav className={`
					  flex flex-wrap flex-col md:flex-row
						item-left md:items-center text-base md:justify-center
						font-mobo
					  fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
					  ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
					  md:relative md:translate-x-0 md:bg-transparent md:shadow-none
						md:ml-auto
						w-full md:w-auto
						pt-40 px-10 md:py-0 md:px-0 md:bg-transparent
					`}>
					  <Link className="mb-8 md:mb-0 md:mr-10 text-xl md:text-base animate-fade-in-up hover:opacity-50" href="/profile">プロフィール</Link>
					  <Link className="mb-8 md:mb-0 md:mr-10 text-xl md:text-base animate-fade-in-up hover:opacity-50" href="/blog">開発ブログ</Link>
					  <Link className="mb-8 md:mb-0 md:mr-10 text-xl md:text-base animate-fade-in-up hover:opacity-50" href="/skills">実績</Link>
					  <Link className="mb-8 md:mb-0 md:mr-10 text-xl md:text-base animate-fade-in-up hover:opacity-50" href="/contact">コンタクト</Link>
					  <Link className="mb-8 md:mb-0 md:mr-10 text-xl md:text-base animate-fade-in-up hover:bg-gray" href="https://github.com/motoshifurugen/my_site" target="_blank" rel="noopener noreferrer">
					    <div className="flex items-center border border-gray-300 rounded px-3 py-1">
					      <FontAwesomeIcon icon={faGithub} className="mr-2" />
					      ソースコード
					    </div>
					  </Link>
					</nav>
				</div>
		  </div>
		</header>
	)
}
export default Header;
