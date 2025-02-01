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
      <div className="group flex items-center rounded border border-main-black px-4 py-2 text-main-black hover:bg-main-black hover:text-main-white dark:border-main-white dark:text-night-white dark:hover:bg-main-white dark:hover:text-main-black">
        <FontAwesomeIcon
          icon={faGithub}
          className="mr-2 group-hover:text-main-white dark:group-hover:text-main-black"
        />
        <span className="noto-sans-jp bg-transparent text-lg font-bold text-main-black group-hover:text-main-white dark:text-night-white dark:group-hover:text-main-black md:text-base">
          Repository
        </span>
      </div>
    </Link>
  )
}

export default GithubLinkButton
