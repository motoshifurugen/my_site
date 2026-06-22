// 記事本文のナビゲーション中に表示するスケルトン。
// タイトルバーと本文行のプレースホルダを描画する。
export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl animate-pulse flex-col gap-4">
      <div className="h-8 w-2/3 rounded bg-gray dark:bg-night-gray" />
      <div className="h-4 w-1/3 rounded bg-gray dark:bg-night-gray" />
      <div className="mt-6 flex flex-col gap-3">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="h-4 w-full rounded bg-gray dark:bg-night-gray"
          />
        ))}
      </div>
    </div>
  )
}
