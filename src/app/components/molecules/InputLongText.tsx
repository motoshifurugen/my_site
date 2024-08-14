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
          block w-full
          px-3 py-2 md:py-4
          border border-gray rounded-md focus:outline-none focus:border-main-black
          noto-sans-jp text-sm md:text-md"
      ></textarea>
    </div>
  )
}

export default InputLongText
