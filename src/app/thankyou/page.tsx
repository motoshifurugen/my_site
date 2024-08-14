import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import TextArrowLinkButton from "../components/molecules/TextArrowLinkButton";

const ThankYou = () => {
  return (
    <section className="thank-you">
      <div className="mx-auto">
        <div className="flex justify-center mt-8">
          <FontAwesomeIcon
            icon={faEnvelopeOpen}
            className="text-6xl text-gray"
          />
        </div>
        <h2 className="my-10 text-center">
          お問合せありがとうございます
        </h2>
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
  );
};

export default ThankYou;
