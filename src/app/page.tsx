import MainMessage from './components/atoms/MainMessage'
import TitleAnimation from './components/atoms/TitleAnimation'
import TextArrowLinkButton from './components/molecules/TextArrowLinkButton'

export default function Home() {
  return (
    <section className="flex flex-col md:flex-row items-top">
      <div className="flex-1 w-full md:w-1/2">
        <TitleAnimation />
      </div>
      <div className="flex md:justify-center items-center w-full md:w-1/2">
        <div>
          <MainMessage />
          <TextArrowLinkButton text="プロフィール" href="/profile" />
        </div>
      </div>
    </section>
  )
}
