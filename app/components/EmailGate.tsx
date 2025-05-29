'use client'

import React, { useState, useEffect } from 'react'

interface EmailGateProps {
  onUnlock: () => void
}

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbygIRHIVp_L4dOZxuQfxXLyGjB0vGceVFEFDiPpKgUe4Xt2z_LOYduVOSbLzeYDcTE0/exec";

export default function EmailGate({ onUnlock }: EmailGateProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('nsmEmailSubmitted') === 'true') {
      setIsSubmitted(true);
      onUnlock();
    }
  }, [onUnlock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    } catch (err) {
      // Optionally handle error
    }

    setIsSubmitting(false)
    setIsSubmitted(true)
    localStorage.setItem('nsmEmailSubmitted', 'true');
    onUnlock()
  }

  return (
    <div className="p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200">
      {!isSubmitted ? (
        <>
          <h3 className="text-lg font-bold mb-2">Want to read more?</h3>
          <p className="text-sm mb-3">Enter your email to be notified about new content. We will only ever get in touch to share new content or ask for your feedback.</p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-sm bg-[#111111] text-white rounded-md hover:bg-[#111111]/90 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              Submit
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-2">
          <p className="text-lg font-bold text-[#111111] mb-1">Thank you!</p>
          <p className="text-sm text-gray-600">The full guide is now unlocked.</p>
          <button
            onClick={onUnlock}
            className="mt-3 px-4 py-1.5 text-sm bg-[#111111] text-white rounded-md hover:bg-[#111111]/90 transition-colors"
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  )
} 