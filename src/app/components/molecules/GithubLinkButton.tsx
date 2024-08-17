import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

const GithubLinkButton = () => {
  return (
    <Link
      className="mr-auto mt-8 animate-fade-in-up md:mt-0"
      href="https://github.com/motoshifurugen/my_site"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="group flex items-center rounded border border-main-black px-4 py-2 transition duration-300 hover:bg-main-black hover:text-main-white">
        <FontAwesomeIcon
          icon={faGithub}
          className="mr-2 bg-transparent transition duration-100 group-hover:text-main-white"
        />
        <span className="noto-sans-jp bg-transparent text-lg font-bold transition duration-300 group-hover:text-main-white md:text-base">
          ソースコード
        </span>
      </div>
    </Link>
  )
}

export default GithubLinkButton
