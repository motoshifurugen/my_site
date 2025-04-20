import Image from 'next/image'

const SearchBar: React.FC = () => {
  return (
    <div className="mt-4 flex w-full items-center justify-center space-x-2">
      <input
        type="text"
        placeholder="検索"
        className="w-full max-w-md rounded border px-4 py-2"
      />
      <button className="rounded bg-blue-500 p-2 text-white">
        <Image
          src="/search.svg"
          alt="Search Logo"
          className="dark:invert"
          width={24}
          height={24}
          priority
        />
      </button>
    </div>
  )
}

export default SearchBar
