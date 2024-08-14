import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import nextConfig from "../../../next.config.mjs";
const BASE_PATH = nextConfig.basePath || "";

const ThankYou = () => {
  return (
    <section className="thank-you">
      <div className="mx-4 md:mx-auto">
        <div className="flex justify-center mt-8">
          <FontAwesomeIcon
            icon={faEnvelopeOpen}
            className="text-6xl text-gray"
          />
        </div>
        <h1 className="text-lg md:text-3xl font-bold my-10 text-center">
          お問い合わせありがとうございます
        </h1>
        <p className="mt-4 text-center text-sm md:text-base">
          お問い合わせ内容を確認させていただきますので、
          <br />
          しばらくお待ちください。
        </p>
        <div className="flex justify-center">
          <a href={`${BASE_PATH}/`} className="group mt-20 text-center">
            トップページに戻る
            <button
              className="relative align-middle transition-all w-8 max-w-[32px] h-8 max-h-[32px] text-xs border border-main-black border-opacity-20 rounded-full ml-5 group-hover:bg-white"
              type="button"
            >
              <span>
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ThankYou;
