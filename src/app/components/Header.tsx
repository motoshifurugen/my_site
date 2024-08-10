import Link from "next/link"

const Header = () => {
	return (
		<header>
		  <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
		    {/* <a className="flex font-mobo font-medium items-center mb-4 md:mb-0">
		      <span className="ml-3 text-xl">Motoshi Furugen</span>
		    </a> */}
		    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center font-mobo">
		      <Link className="mr-10 hover:opacity-50" href="#">プロフィール</Link>
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