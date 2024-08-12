import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import nextConfig from '../../../next.config.mjs';
const BASE_PATH = nextConfig.basePath || "";

const ThankYou = () => {
  return (
    <section className="thank-you">
      <div className="flex justify-center mt-8">
        <FontAwesomeIcon icon={faEnvelopeOpen} className="text-6xl text-gray" />
      </div>
      <h1 className="text-3xl font-bold">お問い合わせありがとうございます</h1>
      <p className="mt-4">お問い合わせ内容を確認させていただきますので、しばらくお待ちください。</p>
      <a href={`${BASE_PATH}/`} className="text-xl group font-bold">
        トップページに戻る
        <button
          className="relative align-middle transition-all w-8 max-w-[32px] h-8 max-h-[32px] text-xs border border-font-main border-opacity-20 rounded-full ml-5 group-hover:bg-white"
          type="button">
          <span><FontAwesomeIcon icon={faArrowRight} /></span>
        </button>
      </a>
    </section>
  );
};

export default ThankYou;