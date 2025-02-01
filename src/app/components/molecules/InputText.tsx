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
        className="mt-1 block w-full rounded-md border border-gray bg-white px-3 py-2 text-sm focus:border-main-black focus:outline-none md:py-4 md:text-base"
      />
    </div>
  )
}

export default InputText
