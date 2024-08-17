'use client'

import nextConfig from '../../../../next.config.mjs'
import MaintenanceTemplate from '../../components/templates/MaintenanceTemplate'
const BASE_PATH = nextConfig.basePath || ''

export default function Blog() {
  return (
    <>
      <MaintenanceTemplate
        title="開発ブログ"
        imagePath={`${BASE_PATH}/images/cats/coming_soon.png`}
      />
    </>
  )
}
