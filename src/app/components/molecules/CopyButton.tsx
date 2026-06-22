'use client'

import { useState } from 'react'
import { BiCheck, BiCopy } from 'react-icons/bi'

import styles from './CopyButton.module.css'

type Props = {
  code: string
}

const CopyButton: React.FC<Props> = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <>
      <button className={styles.button} onClick={handleCopy}>
        {isCopied ? <BiCheck /> : <BiCopy />}
      </button>
      {isCopied && <div className={styles.message}>コピーしました</div>}
    </>
  )
}

export default CopyButton
