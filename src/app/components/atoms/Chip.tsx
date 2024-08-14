import React from 'react'

interface ChipProps {
  children: React.ReactNode
  className?: string
}

const Chip: React.FC<ChipProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-block rounded-xl px-3 py-1 ml-2 text-xs md:text-sm noto-sans-jp font-semibold ${className}`}
    >
      {children}
    </span>
  )
}

export default Chip
