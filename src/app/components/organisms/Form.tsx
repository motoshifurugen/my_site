import React from 'react'
import { useI18n } from '../../../i18n/context'
import SubmitButton from '../atoms/SubmitButton'
import InputLongText from '../molecules/InputLongText'
import InputText from '../molecules/InputText'

// honeypot フィールド名。人間には見えずボットだけが値を入れる想定。
// この値が入った送信を弾けるかは ssgform 側のスパムフィルタ設定に依存する（設定は未確認）。
const HONEYPOT_FIELD_NAME = 'wana'

const Form: React.FC = () => {
  const { t } = useI18n()

  return (
    <form
      action="https://ssgform.com/s/TQptUiQBhkQa"
      method="post"
      className="mx-auto space-y-8 rounded-lg bg-white p-4 dark:bg-night-gray md:p-8"
    >
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name={HONEYPOT_FIELD_NAME}
          id={HONEYPOT_FIELD_NAME}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <InputText
        label={t.contact.form.name}
        name={t.contact.form.name}
        id="name"
        required
      />
      <InputText
        label={t.contact.form.email}
        name={t.contact.form.email}
        id="email"
        required
      />
      <InputLongText
        label={t.contact.form.message}
        name={t.contact.form.message}
        id="message"
        required
      />
      <div className="flex justify-center">
        <SubmitButton>{t.contact.form.submit}</SubmitButton>
      </div>
    </form>
  )
}

export default Form
