import TitleAnimation from './components/TitleAnimation';
import MainMessage from './components/MainMessage';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import nextConfig from '../../next.config.mjs';
const BASE_PATH = nextConfig.basePath || "";

export default function Home() {
  return (
    <section className="main-face flex flex-col lg:flex-row items-center lg:items-start">
      <div className="flex-1 w-full lg:w-auto">
        <div className="h-[140px] sm:h-[140px] md:h-[140px] lg:h-[160px] xl:h-[180px]">
          <TitleAnimation />
        </div>
      </div>
      <div className="w-full lg:w-[480px] p-4 lg:p-0">
        <MainMessage />
        <a href={`${BASE_PATH}/profile`} className="text-xl group font-bold flex items-center mt-4 lg:mt-0">
          プロフィール
          <button
            className="
              relative align-middle transition-all
              w-8 max-w-[32px]
              h-8 max-h-[32px]
              text-xs
              border border-font-main border-opacity-20 rounded-full
              ml-5
              group-hover:bg-white"
            type="button">
            <span><FontAwesomeIcon icon={faArrowRight} /></span>
          </button>
        </a>
      </div>
    </section>
  );
}
