// components/Card.tsx
import { ReactNode } from "react";
import Image from "next/image";

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
      <div className="flex p-10 mb-32 font-open-sans">
        <div className="flex w-1/2 text-lg leading-loose items-center">
          {content}
        </div>
        <div className="w-1/2 flex justify-end">
          <Image src={imageSrc} alt={imageAlt} width={500} height={500} className="rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default Card;