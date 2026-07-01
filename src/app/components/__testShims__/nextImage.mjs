// テスト専用シム: node:test + tsx の ESM/CJS interop 差異で
// `import Image from 'next/image'` が実コンポーネント（forwardRef）ではなく
// module.exports オブジェクト（{ default, getImageProps }）へ二重ラップされるため、
// CJS を require で直接取得して default を正規化する。webpack ビルドには影響しない。
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const mod = require('next/image')
export default mod.default ?? mod
