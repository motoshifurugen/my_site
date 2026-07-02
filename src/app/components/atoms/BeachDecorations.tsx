import React from 'react'

// ライトモードのフッター上端に「上に飛び出す」形で置くビーチ装飾（純装飾）。
// - aria-hidden / pointer-events-none: 支援技術から隠し、クリック不可にする
// - absolute + -translate-y-full: 通常フロー外に置きフッター上端の外側へせり出す（レイアウトシフトなし）
// - dark:hidden: 夜フッターを崩さないためダークでは非表示
// 配置は固定。窮屈さを避けるため、貝殻・ヒトデはモバイル（sm 未満）で非表示にする。
const BeachDecorations: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 -translate-y-full select-none dark:hidden"
    >
      {/* 浮き輪 */}
      <svg
        className="absolute bottom-0 left-6 md:left-12"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <circle cx="24" cy="24" r="20" fill="#FFFFFF" opacity="0.9" />
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="#E95B6B"
          strokeWidth="8"
        />
        <path
          d="M24 4 A20 20 0 0 1 44 24"
          stroke="#FFFFFF"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M24 44 A20 20 0 0 1 4 24"
          stroke="#FFFFFF"
          strokeWidth="8"
          fill="none"
        />
        <circle cx="24" cy="24" r="9" fill="#F3E9D2" />
      </svg>

      {/* くまで（砂遊び用の熊手） */}
      <svg
        className="absolute bottom-0 left-24 md:left-40"
        width="40"
        height="52"
        viewBox="0 0 40 52"
        fill="none"
      >
        <rect x="18" y="2" width="4" height="34" rx="2" fill="#B98A4B" />
        <rect x="6" y="34" width="28" height="6" rx="3" fill="#33A597" />
        <rect x="8" y="38" width="3" height="10" rx="1.5" fill="#33A597" />
        <rect x="15" y="38" width="3" height="12" rx="1.5" fill="#33A597" />
        <rect x="22" y="38" width="3" height="12" rx="1.5" fill="#33A597" />
        <rect x="29" y="38" width="3" height="10" rx="1.5" fill="#33A597" />
      </svg>

      {/* ヒトデ（モバイルでは非表示） */}
      <svg
        className="absolute bottom-0 right-24 hidden sm:block md:right-40"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
      >
        <path
          d="M18 2 L22 13 L34 13 L24 20 L28 32 L18 25 L8 32 L12 20 L2 13 L14 13 Z"
          fill="#F2A65A"
          opacity="0.9"
        />
      </svg>

      {/* 貝殻（モバイルでは非表示） */}
      <svg
        className="absolute bottom-0 right-8 hidden sm:block md:right-16"
        width="34"
        height="30"
        viewBox="0 0 34 30"
        fill="none"
      >
        <path
          d="M17 28 C4 28 2 12 17 3 C32 12 30 28 17 28 Z"
          fill="#F6C6C9"
          opacity="0.9"
        />
        <path
          d="M17 4 L17 27 M9 8 L14 26 M25 8 L20 26"
          stroke="#E39FA3"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  )
}

export default BeachDecorations
