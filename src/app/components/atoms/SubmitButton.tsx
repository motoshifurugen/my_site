import React from 'react'

interface SubmitButtonProps {
  children: React.ReactNode
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ children }) => {
  return (
    <button
      type="submit"
      className="
        my-10 rounded-full
        border border-teal/30 bg-teal-50 px-10 py-4
        font-bold tracking-wide text-teal-700 transition duration-300
        hover:-translate-y-0.5 hover:bg-teal-100
        dark:border-night-teal/40 dark:bg-night-teal/10 dark:text-teal-100 dark:hover:bg-night-teal/20"
    >
      {children}
    </button>
  )
}

export default SubmitButton
