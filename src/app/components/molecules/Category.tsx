import { Categories } from '@/types/posts'

const CategoryItem = ({ category }: { category: string }) => {
  return (
    <div className="w-full max-w-md border-b border-gray p-2">{category}</div>
  )
}

const CategoryList = () => {
  return (
    <div className="mt-4 flex w-full flex-col items-center space-y-2 rounded bg-white p-4 shadow">
      <h1 className="mb-4 text-2xl font-bold">Categories</h1>
      {Categories.map((category, index) => (
        <CategoryItem key={index} category={category} />
      ))}
    </div>
  )
}

export default CategoryList
