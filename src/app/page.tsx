import TitleAnimation from './components/TitleAnimation';
import MainMessage from './components/MainMessage';

export default function Home() {
  return (
    <section className="main-face flex">
      <div className="flex-1">
        <TitleAnimation />
      </div>
      <div className="w-[480px]">
        <MainMessage />
      </div>
    </section>
  );
}
