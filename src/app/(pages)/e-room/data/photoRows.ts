import { E_ROOM_PHOTOS } from '../photos'
import type { PhotoRows } from '../types'

// 全写真を前半/後半の 2 スライドショーに分割し、各群を idx % 3 で 3 行へ振り分ける。
const createPhotoRows = (photos: typeof E_ROOM_PHOTOS): PhotoRows =>
  Array.from({ length: 3 }, (_, rowIndex) =>
    photos.filter((_, idx) => idx % 3 === rowIndex),
  )

const half = Math.floor(E_ROOM_PHOTOS.length / 2)

export const FIRST_PHOTO_ROWS: PhotoRows = createPhotoRows(
  E_ROOM_PHOTOS.slice(0, half),
)
export const SECOND_PHOTO_ROWS: PhotoRows = createPhotoRows(
  E_ROOM_PHOTOS.slice(half),
)
