// Issue #158: ハイスコアの改ざん対策。
// 現行の `typeof score !== 'number'` は typeof NaN / typeof Infinity が 'number' のため
// NaN・Infinity・負値・巨大値・小数を通してしまう。isValidScore はこの穴を塞ぐ。

// 人間のプレイで到達しうる範囲を超える値を偽装として拒否する安全上限。
export const MAX_HIGH_SCORE = 100_000

// 「0 以上 MAX_HIGH_SCORE 以下の整数」のみを受理する型ガード。
export function isValidScore(score: unknown): score is number {
  return (
    typeof score === 'number' &&
    Number.isInteger(score) &&
    score >= 0 &&
    score <= MAX_HIGH_SCORE
  )
}
