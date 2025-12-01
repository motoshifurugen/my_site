'use client'

import { useI18n } from '../../../i18n/context'
import AnimatedLine from '../../components/atoms/AnimatedLine'
import Form from '../../components/organisms/Form'
import PageFace from '../../components/organisms/PageFace'

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
