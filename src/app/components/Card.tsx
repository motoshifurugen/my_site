// components/Card.tsx
import { ReactNode } from "react";
import Image from "next/image";
import nextConfig from "../../../next.config.mjs";
const BASE_PATH = nextConfig.basePath || "";

interface CardProps {
  title: string;
  content: ReactNode;
  imageSrc: string;
  imageAlt: string;
}

const Card: React.FC<CardProps> = ({ title, content, imageSrc, imageAlt }) => {
  return (
    <div className="card mx-6 md:px-20">
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      <div className="md:flex py-5 md:p-10 md:mb-32 custom-font-open-sans">
        <div className="flex w-full md:w-1/2 text-sm md:text-lg leading-snug md:leading-loose items-center">
          {content}
        </div>
        <div className="flex w-full md:w-1/2 justify-end my-10 md:my-0">
          <Image src={`${BASE_PATH}${imageSrc}`} alt={imageAlt} width={500} height={500} className="rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default Card;