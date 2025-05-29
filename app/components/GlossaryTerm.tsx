import React from 'react'

interface GlossaryTermProps {
  term: string
  definition: string | string[]
  onClick?: (term: string) => void
  children?: React.ReactNode
  className?: string
}

const GlossaryTerm = React.forwardRef<HTMLSpanElement, GlossaryTermProps>(
  ({ term, definition, onClick, children, className }, ref) => {
    // Show only the first paragraph if definition is an array
    const preview = Array.isArray(definition) ? definition[0] : definition
    return (
      <span className={`relative inline-block ${className || ''}`} ref={ref}>
        <button
          type="button"
          onClick={onClick ? () => onClick(term) : undefined}
          className={`text-[#111111] hover:text-[#111111]/70 underline cursor-pointer font-medium`}
        >
          {children || term}
        </button>
        <span className="sr-only">: {preview}</span>
      </span>
    )
  }
)

export default GlossaryTerm 