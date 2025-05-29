import React from 'react'
import GlossaryTerm from './GlossaryTerm'

interface GlossaryTermProps {
  term: string
  definition: string | string[]
  children?: React.ReactNode
}

interface TooltipProps {
  children: React.ReactNode
  content: string
}

export const GlossaryTermMDX = ({ term, definition, children }: GlossaryTermProps) => {
  return (
    <GlossaryTerm term={term} definition={definition}>
      {children}
    </GlossaryTerm>
  )
}

export const Tooltip = ({ children, content }: TooltipProps) => {
  return (
    <span className="relative inline-block group">
      <span className="text-[#111111]/70 hover:text-[#111111] cursor-help">
        {children}
      </span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-3 bg-[#496797]/[0.98] text-white text-base rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-pre-line z-50 min-w-[260px] max-w-xs shadow-lg">
        {content}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#496797]/[0.98]" />
      </span>
    </span>
  )
}

export const Link = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a href={href} className="text-[#B76651] hover:text-[#B76651]/80 underline">
      {children}
    </a>
  )
}

const components = {
  GlossaryTerm: GlossaryTermMDX,
  Tooltip,
  Link,
}

export default components 