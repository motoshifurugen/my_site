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
    <div className="card px-20">
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="flex p-10 mb-32 custom-font-open-sans">
        <div className="flex w-1/2 text-lg leading-loose items-center">
          {content}
        </div>
        <div className="w-1/2 flex justify-end">
          <Image src={`${BASE_PATH}${imageSrc}`} alt={imageAlt} width={500} height={500} className="rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default Card;