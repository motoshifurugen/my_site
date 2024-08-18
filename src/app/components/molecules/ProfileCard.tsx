import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import nextConfig from '../../../../next.config.mjs'
const BASE_PATH = nextConfig.basePath || ''

const ProfileCard = () => {
  return (
    <div className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-lg">
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
      <p className="mt-0.5 text-center font-semibold text-main-black">
        motoshifurugen
      </p>
      <p className="mt-1 text-center text-main-black">
        技術力がほしいエンジニアです。最近は山登りにハマっています。
      </p>
      <div className="mt-4 flex justify-center space-x-4">
        <Link href="https://twitter.com/yourprofile">
          <div className="text-main-black">
            <FaTwitter size={24} />
          </div>
        </Link>
        <Link href="https://github.com/yourprofile">
          <div className="text-main-black">
            <FaGithub size={24} />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ProfileCard
