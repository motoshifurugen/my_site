import styles from './CodeBlock.module.css'
import CopyButton from './CopyButton'
import { highlightCode } from './highlightCode'

type Props = {
  language: string
  fileName?: string
  children?: React.ReactNode
}

// prism のトークン CSS（prism-tomorrow）を効かせるためのクラス接頭辞。
const LANGUAGE_CLASS_PREFIX = 'language-'

const CodeBlock: React.FC<Props> = ({ language, fileName, children }) => {
  const code = String(children ?? '').replace(/\n$/, '')
  const highlighted = highlightCode(code, language)
  const languageClass = `${LANGUAGE_CLASS_PREFIX}${language.toLowerCase()}`
  const codeClass = fileName ? styles.codeWithTitle : styles.code

  return (
    <div className={styles.wrapper}>
      {fileName && <div className={styles.title}>{fileName}</div>}
      <div className={styles.container}>
        <pre className={`${languageClass} ${codeClass}`}>
          <code
            className={languageClass}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
        <CopyButton code={code} />
      </div>
    </div>
  )
}

export default CodeBlock
