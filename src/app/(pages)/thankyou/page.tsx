'use client'

import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TextArrowLinkButton from '../../components/molecules/TextArrowLinkButton'
import { useI18n } from '../../../i18n/context'

const ThankYou = () => {
  const { t } = useI18n()

  return (
    <section className="thank-you">
      <div className="mx-auto">
        <div className="mt-8 flex justify-center">
          <FontAwesomeIcon
            icon={faEnvelopeOpen}
            className="text-6xl text-gray"
          />
        </div>
        <h2 className="my-10 text-center">{t.contact.thankYou.title}</h2>
        <p className="mt-4 text-center">
          {t.contact.thankYou.message}
        </p>
        <div className="flex justify-center">
          <TextArrowLinkButton text={t.contact.thankYou.backToTop} href="/" />
        </div>
      </div>
    </section>
  )
}

export default ThankYou
