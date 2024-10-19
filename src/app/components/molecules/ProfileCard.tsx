import Image from 'next/image'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import nextConfig from '../../../../next.config.mjs'
const BASE_PATH = nextConfig.basePath || ''

const ProfileCard = () => {
  return (
    <div className="mx-auto max-w-sm rounded-lg bg-white px-6 py-10 shadow-lg">
      <div className="flex justify-center">
        <Image
          src={`${BASE_PATH}/images/profile_icon.png`}
          alt="Profile"
          className="rounded-full"
          width={80}
          height={80}
          priority
        />
      </div>
      <p className="mt-1 text-center font-semibold">motoshifurugen</p>
      <p className="mt-1 text-left">
        考える前に行動するなんくるないさ系エンジニアです。ココアとブルーハーツで育っています。
      </p>
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
  )
}

export default ProfileCard
