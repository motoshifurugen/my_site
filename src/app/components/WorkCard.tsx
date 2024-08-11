import Image from "next/image";

interface WorkCardProps {
  src: string;
  alt: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
}

const WorkCard: React.FC<WorkCardProps> = ({ src, alt, title, description, tags,date }) => {
  return (
    <div className="relative max-w-sm rounded overflow-hidden mb-24">
      <Image src={src} alt={alt} width={500} height={500} className="w-full" />
      <div className="absolute bottom-0 right-0 bg-white bg-opacity-75 text-sm p-1 px-4">{date}</div>
      <div className="px-6 py-4 my-2">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {tags.map((tag, index) => (
          <span key={index} className="inline-block bg-gray rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WorkCard;
