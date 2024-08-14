'use client'

import { Metadata } from 'next'
import nextConfig from '../../next.config.mjs'
import MaintenanceTemplate from './components/templates/MaintenanceTemplate'
const BASE_PATH = nextConfig.basePath || ''

export const metadata: Metadata = {
  title: 'notfound - ページが見つかりません',
}

export default function NotFound() {
  return (
    <>
      <MaintenanceTemplate
        title="404"
        imagePath={`${BASE_PATH}/images/cats/page_not_found.png`}
      />
    </>
  )
}
