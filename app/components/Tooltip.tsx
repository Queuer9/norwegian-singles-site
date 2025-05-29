'use client'

import { useState } from 'react'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
}

export default function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md whitespace-nowrap z-50">
          {content}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45"></div>
        </div>
      )}
    </span>
  )
} 