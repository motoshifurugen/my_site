// ブログ一覧のナビゲーション中に表示するスケルトン。
// BlogGrid のグリッド（grid-cols-1 md:grid-cols-2 gap-6）に合わせたカード型プレースホルダ。
export default function Loading() {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="flex animate-pulse flex-col gap-4 rounded-lg bg-main-white p-4 dark:bg-night-black"
        >
          <div className="h-40 w-full rounded bg-gray dark:bg-night-gray" />
          <div className="h-5 w-3/4 rounded bg-gray dark:bg-night-gray" />
          <div className="h-4 w-1/2 rounded bg-gray dark:bg-night-gray" />
        </div>
      ))}
    </div>
  )
}
