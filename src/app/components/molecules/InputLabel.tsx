import React from 'react'
import { useI18n } from '../../../i18n/context'
import Chip from '../atoms/Chip'

interface InputLabelProps {
  label: string
  id: string
  required?: boolean
}

const InputLabel: React.FC<InputLabelProps> = ({
  label,
  id,
  required = false,
}) => {
  const { t } = useI18n()

  return (
    <label htmlFor={id} className="mb-2 block text-sm font-bold md:text-base">
      <p className="text-main-black dark:text-night-white">
        {label}
        {required && (
          <Chip className="bg-red-500 text-white dark:text-night-white">
            {t.contact.form.required}
          </Chip>
        )}
      </p>
    </label>
  )
}

export default InputLabel
