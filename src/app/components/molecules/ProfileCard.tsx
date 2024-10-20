import Image from 'next/image'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import nextConfig from '../../../../next.config.mjs'
const BASE_PATH = nextConfig.basePath || ''

const ProfileCard = () => {
  return (
    <div className="mx-auto max-w-sm rounded-lg bg-white px-6 py-10 shadow-lg">
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
          <p className="text-lg font-semibold">motoshifurugen</p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link
              href="https://github.com/motoshifurugen"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="text-main-black">
                <FaGithub size={24} />
              </div>
            </Link>
            <Link
              href="https://x.com/cocoahearts21"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="text-main-black">
                <FaXTwitter size={24} />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6">
        沖縄生まれ、ブルーハーツ育ち。
        <br />
        考える前に行動する、
        <br />
        なんくるないさ系エンジニアです。
      </p>
      <div className="mt-3">
        <Link href="/profile">
          <div className="text-blue-500 hover:underline">
            motoshifurugenについて詳しく
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ProfileCard
