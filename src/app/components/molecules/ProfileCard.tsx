import Image from 'next/image'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import nextConfig from '../../../../next.config.mjs'
const BASE_PATH = nextConfig.basePath || ''

const ProfileCard = () => {
  return (
    <div className="w-full rounded-lg bg-white px-6 py-10 shadow-sm dark:bg-night-gray">
      <div className="flex items-center">
        <Image
          src={`${BASE_PATH}/images/profile_icon.png`}
          alt="Profile"
          className="rounded-full"
          width={100}
          height={100}
          priority
        />
        <div className="ml-4">
          <p className="text-lg font-semibold text-main-black dark:text-night-white">
            motoshifurugen
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link
              href="https://github.com/motoshifurugen"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="text-main-black dark:text-night-white">
                <FaGithub size={24} />
              </div>
            </Link>
            <Link
              href="https://x.com/cocoahearts21"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="text-main-black dark:text-night-white">
                <FaXTwitter size={24} />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-main-black dark:text-night-white">
        沖縄生まれ、ブルーハーツ育ち。
        <br />
        考える前に行動する、
        <br />
        なんくるないさ系エンジニアです。
      </p>
      <div className="mt-3">
        <Link href="/profile">
          <div className="text-teal hover:underline dark:text-night-teal">
            View Profile
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ProfileCard
