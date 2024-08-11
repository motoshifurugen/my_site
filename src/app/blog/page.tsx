import PageFace from '../components/PageFace';

export default function Blog() {
  return (
    <section className="blog">
      <PageFace
        title="開発ブログ"
        subtitle="学び続けなければ、終わる"
        mainMessage={<>
        </>}
      />
      <div className="px-20 flex text-2xl font-bold justify-center">
      <span>🛠️・🛠️・🛠️・🛠️・🛠️・🛠️・🛠️・🛠️・🛠️・ 制作中 ・🛠️・🛠️・🛠️・🛠️・🛠️・🛠️・🛠️・🛠️・🛠️</span>
    </div>
    </section>
  );
}