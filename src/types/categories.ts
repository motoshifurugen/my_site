import nextConfig from '../../next.config.mjs'

const BASE_PATH = nextConfig.basePath || ''

export const Categories = [
  'フロントエンド',
  'バックエンド',
  'インフラ',
  'AI',
  'その他',
] as const

export type Category = (typeof Categories)[number]

export const CategoryIcons: Record<Category, string> = {
  フロントエンド: `${BASE_PATH}/images/category-icon//frontend.svg`,
  バックエンド: `${BASE_PATH}/images/category-icon//backend.svg`,
  インフラ: `${BASE_PATH}/images/category-icon//infra.svg`,
  AI: `${BASE_PATH}/images/category-icon//ai.svg`,
  その他: `${BASE_PATH}/images/category-icon//other.svg`,
}
