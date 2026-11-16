// Issue #355: /api/tanka の page・limit の検査。
// parseInt は '2abc' を 2、'1.5' を 1 として通し、Number は '' や ' 1' を通すため、
// 数字だけの文字列かを先に確かめてから数値にする。

export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 12
export const MAX_LIMIT = 100

type PaginationResult =
  { ok: true; page: number; limit: number } | { ok: false; error: string }

// u フラグを付けないので \d は ASCII の 0-9 だけに当たる（全角数字を通さない）。
const DIGITS_ONLY = /^\d+$/

function parsePositiveInt(raw: string, max: number): number | null {
  if (!DIGITS_ONLY.test(raw)) return null
  const value = Number(raw)
  if (!Number.isSafeInteger(value) || value < 1 || value > max) return null
  return value
}

// 既定値を使うのは searchParams.get() が null（クエリに無い）のときだけ。
// 空文字（?page=）は指定された不正な値として拒否する。
export function parsePagination(
  rawPage: string | null,
  rawLimit: string | null,
): PaginationResult {
  const page =
    rawPage === null
      ? DEFAULT_PAGE
      : parsePositiveInt(rawPage, Number.MAX_SAFE_INTEGER)
  if (page === null) {
    return { ok: false, error: 'page must be an integer of 1 or more' }
  }

  const limit =
    rawLimit === null ? DEFAULT_LIMIT : parsePositiveInt(rawLimit, MAX_LIMIT)
  if (limit === null) {
    return {
      ok: false,
      error: `limit must be an integer from 1 to ${MAX_LIMIT}`,
    }
  }

  return { ok: true, page, limit }
}
