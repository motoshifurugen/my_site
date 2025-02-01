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
    <div className="relative mb-8 overflow-hidden rounded p-3 md:p-5">
      <Image
        src={`${BASE_PATH}${src}`}
        alt={alt}
        width={500}
        height={500}
        className="w-full"
      />
      <div className="my-2 py-2 md:py-4">
        <div className="noto-sans-jp mb-2 text-lg font-bold text-main-black dark:text-main-white md:text-xl">
          {title}
        </div>
        <p>{description}</p>
      </div>
      <div className="pt-2">
        {tags.map((tag, index) => (
          <Chip key={index} className="bg-gray">
            {tag}
          </Chip>
        ))}
      </div>
      <div className="absolute bottom-0 right-0 bg-white bg-opacity-75 px-4 py-1 text-sm text-main-black dark:text-main-black">
        {date}
      </div>
    </div>
  )
}

export default WorkCard
