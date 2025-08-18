'use client'

import AnimatedLine from '../../components/atoms/AnimatedLine'
import Form from '../../components/organisms/Form'
import PageFace from '../../components/organisms/PageFace'
import { useI18n } from '../../../i18n/context'

export default function Contact() {
  const { t } = useI18n()

  return (
    <>
      <section>
        <PageFace title={t.contact.title} subtitle="" mainMessage={<></>} />
      </section>

      <AnimatedLine />

      <section>
        <Form />
      </section>
    </>
  )
}
