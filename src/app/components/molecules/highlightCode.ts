import Prism from 'prismjs'

// 記事フェンスで使う prism 言語定義をこのモジュールに集約する（操作の一覧性）。
// markup / css / clike / javascript は prismjs コアに同梱されるため再登録不要。
// php は markup-templating（と clike）に依存する。import は organize-imports により
// パス昇順へ整列され、'markup-templating' < 'php' のため依存読み込み順は保たれる。
import 'prismjs/components/prism-bash.js'
import 'prismjs/components/prism-json.js'
import 'prismjs/components/prism-markup-templating.js'
import 'prismjs/components/prism-php.js'
import 'prismjs/components/prism-python.js'
import 'prismjs/components/prism-typescript.js'

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// コードをサーバー側で prism ハイライト済み HTML に変換する単一の操作。
// 投稿には大文字キー（HTML 等）が存在するため小文字化して文法を引く。
// 文法のない言語は素のコードを必ずエスケープして返す（XSS / タグ崩れ防止）。
export function highlightCode(code: string, language: string): string {
  const languageKey = language.toLowerCase()
  const grammar = Prism.languages[languageKey]
  return grammar
    ? Prism.highlight(code, grammar, languageKey)
    : escapeHtml(code)
}
