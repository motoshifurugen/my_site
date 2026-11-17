// Issue #378: /api/tags の search の検査。
// route は search を .or() の文字列へそのまま入れる。.or() は , で条件を区切り、
// ( ) " \ も構文に使うので、これらを含む値と長すぎる値を拒否する。

export const MAX_SEARCH_LENGTH = 100

type SearchResult =
  { ok: true; search: string | null } | { ok: false; error: string }

const OR_SYNTAX_CHARS = /[,()"\\]/

// 空文字（?search=）はクエリに無いときと同じく絞り込み無しとして扱う。
export function parseSearch(rawSearch: string | null): SearchResult {
  if (rawSearch === null || rawSearch === '') {
    return { ok: true, search: null }
  }
  if (rawSearch.length > MAX_SEARCH_LENGTH) {
    return {
      ok: false,
      error: `search must be at most ${MAX_SEARCH_LENGTH} characters`,
    }
  }
  if (OR_SYNTAX_CHARS.test(rawSearch)) {
    return { ok: false, error: 'search must not contain , ( ) " or \\' }
  }
  return { ok: true, search: rawSearch }
}
