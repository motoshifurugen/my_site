import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';

export default function MainMessage() {
  return (
    <>
      <p className="text-2xl leading-loose mb-12">
        心の健康を支えるために、<br />
        画面の向こうに広がる世界へ、<br />
        想いをコードに込め、<br />
        毎日挑戦し続ける、<br />
        なんくるないさ系エンジニア。
      </p>
      <a href="#" className="text-xl group">
        プロフィール
        <button
          className="relative align-middle transition-all w-8 max-w-[32px] h-8 max-h-[32px] text-xs border border-font-main border-opacity-20 rounded-full ml-5 group-hover:bg-white"
          type="button">
          <span><FontAwesomeIcon icon={faArrowRight} /></span>
        </button>
      </a>
    </>
  );
}
