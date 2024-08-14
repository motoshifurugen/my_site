import Image from 'next/image'
import { ReactNode } from 'react'
import nextConfig from '../../../../next.config.mjs'
const BASE_PATH = nextConfig.basePath || ''

interface ArticleProps {
  title: string
  content: ReactNode
  imageSrc: string
  imageAlt: string
}

const Article: React.FC<ArticleProps> = ({
  title,
  content,
  imageSrc,
  imageAlt,
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <div className="md:flex pb-12">
        <div className="flex w-full md:w-1/2 items-center md:pr-10">
          {content}
        </div>
        <div className="flex w-full md:w-1/2 justify-center mt-10 md:mt-0">
          <Image
            src={`${BASE_PATH}${imageSrc}`}
            alt={imageAlt}
            width={500}
            height={500}
            className="rounded-2xl"
          />
        </div>
      </div>
    </div>
  )
}

export default Article
