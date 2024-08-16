import MainMessage from './components/atoms/MainMessage'
import TitleAnimation from './components/atoms/TitleAnimation'
import TextArrowLinkButton from './components/molecules/TextArrowLinkButton'

export default function Home() {
  return (
    <section className="items-top flex flex-col md:flex-row">
      <div className="w-full flex-1 md:w-1/2">
        <TitleAnimation />
      </div>
      <div className="flex w-full items-center md:w-1/2 md:justify-center">
        <div>
          <MainMessage />
          <TextArrowLinkButton text="プロフィール" href="/profile" />
        </div>
      </div>
    </section>
  )
}
