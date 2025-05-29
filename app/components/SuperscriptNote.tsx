import React from 'react'

interface SuperscriptNoteProps {
  children: React.ReactNode
  note?: string
}

export default function SuperscriptNote({ children, note }: SuperscriptNoteProps) {
  return (
    <span className="relative inline-block group">
      <sup className="text-sm font-medium text-[#111111]/70 hover:text-[#111111] cursor-help">
        {children}
      </sup>
      {note && (
        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-3 bg-[#496797]/[0.98] text-white text-base rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-pre-line z-50 min-w-[260px] max-w-xs shadow-lg">
          <span className="flex items-center mb-2">
            <span className="inline-block font-bold text-lg bg-white/20 rounded px-2 py-0.5 mr-2">#{children}</span>
          </span>
          {note}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-[#496797]/[0.98]" />
        </span>
      )}
    </span>
  )
} 