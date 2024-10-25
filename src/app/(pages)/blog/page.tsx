'use client'

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
        <ArticleList />
      ) : (
        <MaintenanceTemplate
          title="開発ブログ"
          imagePath={`${BASE_PATH}/images/cats/coming_soon.png`}
        />
      )}
    </>
  )
}
