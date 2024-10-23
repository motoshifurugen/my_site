import { Categories, CategoryIcons } from '@/types/categories'
import Image from 'next/image'
import Link from 'next/link'

const CategoryList = () => {
  return (
    <div className="mt-4 flex w-full flex-col space-y-2 rounded bg-white p-4 text-left shadow">
      <h1 className="mb-2 text-2xl font-bold">カテゴリー</h1>
      {Categories.map((category, index) => (
        <Link key={index} href={`/category/${category}`}>
          <button className="flex w-full max-w-md items-center border-b p-2 text-left text-black">
            <Image
              src={CategoryIcons[category]}
              alt={`${category} Icon`}
              width={20}
              height={20}
              className="mr-2 opacity-70"
            />
            {category}
          </button>
        </Link>
      ))}
    </div>
  )
}

export default CategoryList
