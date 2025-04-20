'use client'

import AnimatedLine from '@/app/components/atoms/AnimatedLine'
import PageFace from '@/app/components/organisms/PageFace'
import dynamic from 'next/dynamic'
import nextConfig from '../../../../next.config.mjs'
import MaintenanceTemplate from '../../components/templates/MaintenanceTemplate'

const BASE_PATH = nextConfig.basePath || ''
const public_flag = true

const ArticleList = dynamic(
  () => import('@/app/components/templates/ArticleList'),
  { ssr: false },
)

export default function Blog() {
  return (
    <>
      {public_flag ? (
        <>
          <section>
            <PageFace title="Blog" subtitle="" mainMessage={<></>} />
          </section>

          <AnimatedLine />

          <section>
            <ArticleList />
          </section>
        </>
      ) : (
        <MaintenanceTemplate
          title="Blog"
          imagePath={`${BASE_PATH}/images/cats/coming_soon.png`}
        />
      )}
    </>
  )
}
