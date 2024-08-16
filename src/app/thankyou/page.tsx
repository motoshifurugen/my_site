import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TextArrowLinkButton from '../components/molecules/TextArrowLinkButton'

const ThankYou = () => {
  return (
    <section className="thank-you">
      <div className="mx-auto">
        <div className="mt-8 flex justify-center">
          <FontAwesomeIcon
            icon={faEnvelopeOpen}
            className="text-6xl text-gray"
          />
        </div>
        <h2 className="my-10 text-center">お問合せありがとうございます</h2>
        <p className="mt-4 text-center">
          お問合せ内容を確認させていただきますので、
          <br />
          しばらくお待ちください。
        </p>
        <div className="flex justify-center">
          <TextArrowLinkButton text="トップページへ戻る" href="/" />
        </div>
      </div>
    </section>
  )
}

export default ThankYou
