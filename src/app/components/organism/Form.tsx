import React from 'react'
import SubmitButton from '../atoms/SubmitButton'
import InputLongText from '../molecules/InputLongText'
import InputText from '../molecules/InputText'

const Form: React.FC = () => {
  return (
    <form
      action="https://ssgform.com/s/TQptUiQBhkQa"
      method="post"
      className="mx-auto space-y-8 rounded-lg bg-white p-4 dark:bg-main-white md:p-8"
    >
      <div className="hidden">
        <input type="text" name="trap-column" />
      </div>
      <InputText label="お名前" name="お名前" id="name" required />
      <InputText
        label="メールアドレス"
        name="メールアドレス"
        id="email"
        required
      />
      <InputLongText
        label="お問い合わせ内容"
        name="お問い合わせ内容"
        id="message"
        required
      />
      <div className="flex justify-center">
        <SubmitButton>送信する</SubmitButton>
      </div>
    </form>
  )
}

export default Form
