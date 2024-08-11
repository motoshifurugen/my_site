import TitleAnimation from './components/TitleAnimation';
import MainMessage from './components/MainMessage';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import nextConfig from "../../next.config.mjs";
const BASE_PATH = nextConfig.basePath || "";

export default function Home() {
  return (
    <section className="main-face flex">
      <div className="flex-1">
        <TitleAnimation />
      </div>
      <div className="w-[480px]">
        <MainMessage />
        <a href={`${BASE_PATH}/profile`} className="text-xl group font-bold">
          プロフィール
          <button
            className="relative align-middle transition-all w-8 max-w-[32px] h-8 max-h-[32px] text-xs border border-font-main border-opacity-20 rounded-full ml-5 group-hover:bg-white"
            type="button">
            <span><FontAwesomeIcon icon={faArrowRight} /></span>
          </button>
        </a>
      </div>
    </section>
  );
}
