'use client'

import { useCopyToClipboard } from '@/app/hooks/useCopyToClipboard'
import { useI18n } from '@/i18n'
import React from 'react'
import { FiCheck, FiLink } from 'react-icons/fi'

interface CopyLinkButtonProps {
  url: string
  className: string
}

const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ url, className }) => {
  const { t } = useI18n()
  const { isCopied, copy } = useCopyToClipboard()

  return (
    <button type="button" onClick={() => copy(url)} className={className}>
      {isCopied ? <FiCheck aria-hidden /> : <FiLink aria-hidden />}
      <span aria-live="polite">
        {isCopied ? t.blog.share.copied : t.blog.share.copyLink}
      </span>
    </button>
  )
}

export default CopyLinkButton
