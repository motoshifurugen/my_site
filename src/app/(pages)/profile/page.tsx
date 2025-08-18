'use client'

import AnimatedLine from '../../components/atoms/AnimatedLine'
import MainMessage from '../../components/atoms/MainMessage'
import Article from '../../components/molecules/Article'
import PageFace from '../../components/organisms/PageFace'
import { useArticles } from './articles'
import { useI18n } from '../../../i18n/context'

export default function Page() {
  const { t } = useI18n()
  const articles = useArticles()

  return (
    <>
      <section className="content-wrapper container mx-auto">
        <PageFace
          title={t.profile.title}
          subtitle={t.profile.subtitle}
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
