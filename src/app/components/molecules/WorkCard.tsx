import Image from 'next/image'
import nextConfig from '../../../../next.config.mjs'
import Chip from '../atoms/Chip'
const BASE_PATH = nextConfig.basePath || ''

interface WorkCardProps {
  src: string
  alt: string
  title: string
  description: string
  tags: string[]
  date: string
}

const WorkCard: React.FC<WorkCardProps> = ({
  src,
  alt,
  title,
  description,
  tags,
  date,
}) => {
  return (
    <div className="relative rounded overflow-hidden p-3 md:p-5 mb-8">
      <Image
        src={`${BASE_PATH}${src}`}
        alt={alt}
        width={500}
        height={500}
        className="w-full"
      />
      <div className="py-2 md:py-4 my-2">
        <div className="noto-sans-jp font-bold text-lg md:text-xl mb-2">
          {title}
        </div>
        <p className="text-sm md:text-base">{description}</p>
      </div>
      <div className="pt-2">
        {tags.map((tag, index) => (
          <Chip key={index} className="bg-gray">
            {tag}
          </Chip>
        ))}
      </div>
      <div className="absolute bottom-0 right-0 bg-white bg-opacity-75 text-sm px-4 py-1">
        {date}
      </div>
    </div>
  )
}

export default WorkCard
