"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import nextConfig from "../../../next.config.mjs";
import { useEffect } from "react";
const BASE_PATH = nextConfig.basePath || "";

const Header = () => {
	const pathname = usePathname();
	const isMainPage = pathname === `${BASE_PATH}/` || pathname === "/";

	useEffect(() => {
		// ページ遷移後にスクロール位置をトップにリセット
		window.scrollTo(0, 0);
}, [pathname]);

	return (
		<header className={`fixed top-0 left-0 w-full z-50 py-3 mb-20 ${!isMainPage ? 'bg-bg-main' : 'bg-transparent'}`}>
		  <div className="container mx-auto flex flex-wrap py-5 flex-col md:flex-row items-center">
				{!isMainPage && (
          <a href={`${BASE_PATH}/`} className="flex font-mobo mb-4 md:mb-0">
            <span className="ml-3 text-xl">Furugen&apos;s Island</span>
          </a>
        )}
		    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center font-mobo">
		      <Link className="mr-10 hover:opacity-50" href="/profile">プロフィール</Link>
		      <Link className="mr-10 hover:opacity-50" href="/blog">開発ブログ</Link>
		      <Link className="mr-10 hover:opacity-50" href="/skills">実績</Link>
		      <Link className="mr-10 hover:opacity-50" href="/contact">コンタクト</Link>
			  	<Link className="mr-10 hover:bg-gray" href="https://github.com/motoshifurugen/my_site" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center border border-gray-300 rounded px-3 py-1">
              <FontAwesomeIcon icon={faGithub} className="mr-2" />
              ソースコード
            </div>
          </Link>
		    </nav>
		  </div>
		</header>
	)
}

export default Header