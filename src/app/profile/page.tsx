'use client'

import AnimatedLine from '../components/atoms/AnimatedLine'
import MainMessage from '../components/atoms/MainMessage'
import Article from '../components/molecules/Article'
import PageFace from '../components/organism/PageFace'
import { articles } from './articles'

export default function Page() {
  return (
    <>
      <section className="content-wrapper container mx-auto">
        <PageFace
          title="プロフィール"
          subtitle="古堅基史（Furugen Motoshi）"
          mainMessage={<MainMessage />}
        />
      </section>

      <AnimatedLine />

      <section className="content-wrapper container mx-auto">
        {articles.map((article, index) => (
          <Article
            key={index}
            title={article.title}
            content={article.content}
            imageSrc={article.imageSrc}
            imageAlt={article.imageAlt}
          />
        ))}
      </section>
    </>
  )
}
