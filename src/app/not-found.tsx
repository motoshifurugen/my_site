import PageFace from '../app/components/PageFace';
import { Metadata } from 'next';
import Image from "next/image";
import nextConfig from "../../next.config.mjs";
const BASE_PATH = nextConfig.basePath || "";

export const metadata: Metadata = {
  title: 'notfound - ページが見つかりません',
};

export default function NotFound() {
  return (
    <section className="blog">
      <PageFace
        title="404"
        subtitle=""
        mainMessage={<>
        </>}
      />
      <div className="flex w-full justify-center my-5 md:my-0">
        <Image src={`${BASE_PATH}/images/cats/page_not_found.png`} alt="coming soon" width={500} height={500} className="rounded-2xl" />
      </div>
    </section>
  );
}