// 指が少し横にぶれただけでページがめくれないようにする
const SWIPE_THRESHOLD_PX = 50

const nextPage = (currentPage: number, totalPages: number): number =>
  Math.min(currentPage + 1, totalPages - 1)

const previousPage = (currentPage: number): number =>
  Math.max(currentPage - 1, 0)

// 右開きの本なので、左→右のスワイプで次のページ、右→左で前のページへ移る
export const getPageAfterSwipe = (
  currentPage: number,
  deltaX: number,
  deltaY: number,
  totalPages: number,
): number => {
  // 縦スクロールをページ送りと取り違えないため
  if (Math.abs(deltaY) > Math.abs(deltaX)) return currentPage
  if (deltaX > SWIPE_THRESHOLD_PX) return nextPage(currentPage, totalPages)
  if (deltaX < -SWIPE_THRESHOLD_PX) return previousPage(currentPage)
  return currentPage
}

// 右開きの本なので、枠の左半分のタップで次のページ、それ以外で前のページへ移る
export const getPageAfterTap = (
  currentPage: number,
  clickX: number,
  frameWidth: number,
  totalPages: number,
): number =>
  clickX < frameWidth / 2
    ? nextPage(currentPage, totalPages)
    : previousPage(currentPage)
