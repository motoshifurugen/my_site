'use client'

import ArticleList from '@/app/components/templates/ArticleList'
import nextConfig from '../../../../next.config.mjs'
import MaintenanceTemplate from '../../components/templates/MaintenanceTemplate'

const BASE_PATH = nextConfig.basePath || ''
const public_flag = true

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
