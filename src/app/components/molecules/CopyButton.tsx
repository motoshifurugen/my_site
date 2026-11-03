'use client'

import { useCopyToClipboard } from '@/app/hooks/useCopyToClipboard'
import { BiCheck, BiCopy } from 'react-icons/bi'

import styles from './CopyButton.module.css'

type Props = {
  code: string
}

const CopyButton: React.FC<Props> = ({ code }) => {
  const { isCopied, copy } = useCopyToClipboard()

  return (
    <>
      <button
        className={styles.button}
        onClick={() => copy(code)}
        aria-label={isCopied ? 'コピーしました' : 'コードをコピー'}
      >
        {isCopied ? <BiCheck /> : <BiCopy />}
      </button>
      {isCopied && <div className={styles.message}>コピーしました</div>}
    </>
  )
}

export default CopyButton
