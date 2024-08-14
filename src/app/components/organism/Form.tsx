import React from 'react';
import InputLongText from '../molecules/InputLongText';
import InputText from '../molecules/InputText';
import SubmitButton from '../atoms/SubmitButton';

const Form: React.FC = () => {
  return (
    <form
      action="https://ssgform.com/s/TQptUiQBhkQa"
      method="post"
      className="bg-white space-y-8 mx-auto p-4 md:p-8 rounded-lg"
    >
      <div className="hidden"><input type="text" name="trap-column" /></div>
      <InputText label="お名前" name="お名前" id="name" required />
      <InputText label="メールアドレス" name="メールアドレス" id="email" required />
      <InputLongText label="お問い合わせ内容" name="お問い合わせ内容" id="message" required />
      <div className="flex justify-center">
        <SubmitButton>送信する</SubmitButton>
      </div>
    </form>
  );
};

export default Form;
