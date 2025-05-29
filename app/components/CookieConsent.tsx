'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 z-50">
      <div className="max-w-[800px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          We use cookies to remember your preferences and improve your experience. By continuing to use this site, you agree to our use of cookies.
        </p>
        <button
          onClick={acceptCookies}
          className="px-4 py-2 text-sm bg-[#111111] text-white rounded-md hover:bg-[#111111]/90 transition-colors whitespace-nowrap"
        >
          Got it!
        </button>
      </div>
    </div>
  )
} 