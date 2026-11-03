import { useState } from 'react'

const COPIED_RESET_MS = 2000

export const copyWithFeedback = async (
  text: string,
  setCopied: (copied: boolean) => void,
): Promise<void> => {
  await navigator.clipboard.writeText(text)
  setCopied(true)
  setTimeout(() => setCopied(false), COPIED_RESET_MS)
}

export const useCopyToClipboard = (): {
  isCopied: boolean
  copy: (text: string) => void
} => {
  const [isCopied, setIsCopied] = useState(false)

  const copy = (text: string) => {
    void copyWithFeedback(text, setIsCopied)
  }

  return { isCopied, copy }
}
