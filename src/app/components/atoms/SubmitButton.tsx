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
        bg-teal px-10 py-4
        font-bold tracking-wide text-main-white shadow-card transition duration-300
        hover:-translate-y-0.5 hover:bg-teal-600 hover:shadow-card-hover
        dark:bg-night-teal dark:hover:bg-teal-400"
    >
      {children}
    </button>
  )
}

export default SubmitButton
