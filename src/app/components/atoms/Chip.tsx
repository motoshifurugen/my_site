import React from 'react'

interface ChipProps {
  children: React.ReactNode
  className?: string
}

const Chip: React.FC<ChipProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`noto-sans-jp ml-2 inline-block rounded-xl px-3 py-1 text-xs font-semibold md:text-sm ${className}`}
    >
      {children}
    </span>
  )
}

export default Chip
