'use client'

import AnimatedLine from '../../components/atoms/AnimatedLine'
import Form from '../../components/organisms/Form'
import PageFace from '../../components/organisms/PageFace'

export default function Contact() {
  return (
    <>
      <section>
        <PageFace title="Contact" subtitle="" mainMessage={<></>} />
      </section>

      <AnimatedLine />

      <section>
        <Form />
      </section>
    </>
  )
}
