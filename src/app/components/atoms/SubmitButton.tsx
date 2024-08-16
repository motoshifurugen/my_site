import React from 'react'

interface SubmitButtonProps {
  children: React.ReactNode
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ children }) => {
  return (
    <button
      type="submit"
      className="
        group
        my-10 rounded-3xl
        px-20 py-4
        uppercase tracking-widest
        shadow-[inset_0_0_0_2px_#4A4A4A] transition
        duration-300 hover:bg-main-black hover:text-main-white md:px-32"
    >
      <p className="bg-transparent font-bold transition duration-300 group-hover:text-main-white">
        {children}
      </p>
    </button>
  )
}

export default SubmitButton
