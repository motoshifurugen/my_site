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
      <div className="pb-12 md:flex">
        <div className="flex w-full items-center md:w-1/2 md:pr-10">
          {content}
        </div>
        <div className="mt-10 flex w-full justify-center md:mt-0 md:w-1/2">
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
