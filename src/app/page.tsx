import Image from 'next/image'
import nextConfig from '../../next.config.mjs'
import MainMessage from './components/atoms/MainMessage'
import TitleAnimation from './components/atoms/TitleAnimation'
import TextArrowLinkButton from './components/molecules/TextArrowLinkButton'
const BASE_PATH = nextConfig.basePath || ''

export default function Home() {
  return (
    <section>
      <div className="hidden w-full md:block">
        <TitleAnimation />
      </div>
      <div className="items-top flex flex-col md:flex-row">
        <div className="w-full flex-1 md:hidden">
          <TitleAnimation />
        </div>
        <div className="mx-auto hidden w-1/2 md:flex md:justify-end">
          <Image
            src={`${BASE_PATH}/images/island.png`}
            alt="island"
            width={320}
            height={320}
            priority
          />
        </div>
        <div className="flex w-full items-center md:w-1/2 md:justify-center">
          <div>
            <MainMessage />
            <TextArrowLinkButton text="プロフィール" href="/profile" />
          </div>
        </div>
      </div>
    </section>
  )
}
