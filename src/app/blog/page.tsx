import PageFace from '../components/PageFace';

export default function Blog() {
  return (
    <section className="blog">
      <PageFace
        title="開発ブログ"
        subtitle=""
        mainMessage={<>
        </>}
      />
      <div className="px-20 flex text-2xl font-bold justify-center">
      <span>🛠️　🛠️　🛠️　🛠️　🛠️　🛠️　🛠️　🛠️　🛠️　 開発中 　🛠️　🛠️　🛠️　🛠️　🛠️　🛠️　🛠️　🛠️　🛠️</span>
    </div>
    </section>
  );
}