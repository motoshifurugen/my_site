import TitleAnimation from "./components/TitleAnimation";
import MainMessage from "./components/MainMessage";
import TextButton from "./components/TextButton";

export default function Home() {
  return (
    <section className="content-wrapper">
      <div className="container mx-auto flex flex-col md:flex-row items-top">
        <div className="flex-1 w-full md:w-1/2">
          <TitleAnimation />
        </div>
        <div className="flex md:justify-center items-center w-full md:w-1/2">
          <div>
            <MainMessage />
            <TextButton text="プロフィール" href="/profile" />
          </div>
        </div>
      </div>
    </section>
  );
}
