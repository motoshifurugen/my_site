import React from 'react'
import InputLabel from './InputLabel'

interface InputLongTextProps {
  label: string
  name: string
  id: string
  required?: boolean
  rows?: number
}

const InputLongText: React.FC<InputLongTextProps> = ({
  label,
  name,
  id,
  required = false,
  rows = 3,
}) => {
  return (
    <div>
      <InputLabel label={label} id={id} required={required} />
      <textarea
        name={name}
        id={id}
        required={required}
        rows={rows}
        className="
          noto-sans-jp block
          w-full rounded-md border
          border-gray bg-white px-3 py-2 text-sm
          focus:border-main-black focus:outline-none md:py-4 md:text-base"
      ></textarea>
    </div>
  )
}

export default InputLongText
