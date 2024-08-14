"use client";

import AnimatedLine from "../components/atoms/AnimatedLine";
import Form from "../components/organism/Form";
import PageFace from "../components/organism/PageFace";

export default function Contact() {
  return (
    <>
      <section>
        <PageFace title="お問い合わせ" subtitle="" mainMessage={<></>} />
      </section>

      <AnimatedLine />

      <section>
        <Form />
      </section>
    </>
  );
}
