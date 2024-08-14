import React from 'react'
import InputLabel from './InputLabel'

interface InputTextProps {
  label: string
  name: string
  id: string
  required?: boolean
}

const InputText: React.FC<InputTextProps> = ({
  label,
  name,
  id,
  required = false,
}) => {
  return (
    <div>
      <InputLabel label={label} id={id} required={required} />
      <input
        type="text"
        name={name}
        id={id}
        required={required}
        className="mt-1 block w-full px-3 py-2 md:py-4 border border-gray rounded-md focus:outline-none focus:border-main-black text-sm md:text-md"
      />
    </div>
  )
}

export default InputText
