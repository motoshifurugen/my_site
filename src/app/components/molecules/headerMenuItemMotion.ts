// モバイルメニュー内の各項目（HeaderLinkButton / HeaderDropdownButton /
// GithubLinkButton）が共有する可視制御・モーション契約クラス（Issue #227）。
//
// - モバイル: 既定 opacity-0（閉時は不可視）。nav の open（group-data-[open=true]）で
//   opacity-100 へ opacity フェードし、開く時だけ --stagger-delay 分だけ遅らせて stagger。
//   閉じる時は遅延なしで同時にフェードアウトする。
// - md（デスクトップ）: 常時可視（md:opacity-100）で #224 の水平ヘッダー挙動を回帰させない。
//   mount 時の 1s keyframe（fadeInUp）は md 限定（md:animate-fade-in-up）で温存する。
//   opacity フェードの transition は max-md 限定にして、デスクトップの hover:opacity-50 を
//   即時のまま保つ（transition を md まで及ぼさない）。
// - prefers-reduced-motion: transition / keyframe とも無効化し即表示/即非表示。
//
// この文字列がメニュー項目の可視契約の単一の情報源。3 コンポーネントで共有する。
export const headerMenuItemMotionClass =
  'opacity-0 max-md:transition-opacity max-md:duration-200 max-md:ease-out group-data-[open=true]:opacity-100 group-data-[open=true]:[transition-delay:var(--stagger-delay)] motion-reduce:transition-none motion-reduce:animate-none md:animate-fade-in-up md:opacity-100'
