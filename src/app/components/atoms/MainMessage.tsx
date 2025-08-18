'use client'

import { useI18n } from '@/i18n'

export default function MainMessage() {
  const { t } = useI18n()
  
  // 改行文字で分割して配列にする
  const messageLines = t.home.mainMessage.split('\n')
  
  return (
    <>
      <h3 className="select-none leading-relaxed">
        {messageLines.map((line, index) => (
          <span key={index}>
            {line}
            {index < messageLines.length - 1 && <br />}
          </span>
        ))}
      </h3>
    </>
  )
}
