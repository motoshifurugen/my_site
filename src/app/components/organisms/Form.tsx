import React from 'react'
import { useI18n } from '../../../i18n/context'
import SubmitButton from '../atoms/SubmitButton'
import InputLongText from '../molecules/InputLongText'
import InputText from '../molecules/InputText'

const Form: React.FC = () => {
  const { t } = useI18n()

  return (
    <form
      action="https://ssgform.com/s/TQptUiQBhkQa"
      method="post"
      className="mx-auto space-y-8 rounded-lg bg-white p-4 dark:bg-night-gray md:p-8"
    >
      <div className="hidden">
        <input type="text" name="trap-column" />
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
