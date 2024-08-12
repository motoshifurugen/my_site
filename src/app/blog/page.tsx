import PageFace from '../components/PageFace';
import Image from "next/image";
import nextConfig from "../../../next.config.mjs";
const BASE_PATH = nextConfig.basePath || "";

export default function Blog() {
  return (
    <section className="blog">
      <PageFace
        title="開発ブログ"
        subtitle=""
        mainMessage={<>
        </>}
      />
      <div className="flex w-full justify-center my-5 md:my-0">
        <Image src={`${BASE_PATH}/images/cats/coming_soon.png`} alt="coming soon" width={500} height={500} className="rounded-2xl" />
      </div>
    </section>
  );
}