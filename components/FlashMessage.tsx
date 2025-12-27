'use client'

import { useEffect, useState } from 'react'

interface FlashMessageProps {
  initialMessage?: string | null
  initialType?: 'success' | 'error'
}

/**
 * FlashMessage Component
 *
 * Displays one-time success or error messages that auto-clear
 * Must be mounted globally in layout.tsx
 *
 * The flash message is:
 * - Set server-side via setFlashMessage()
 * - Automatically cleared after reading
 * - Displayed to user with auto-dismiss
 */
export function FlashMessage({ initialMessage, initialType = 'success' }: FlashMessageProps) {
  const [message, setMessage] = useState<string | null>(initialMessage || null)
  const [type, setType] = useState<'success' | 'error'>(initialType)
  const [isVisible, setIsVisible] = useState(!!initialMessage)

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [isVisible])

  if (!isVisible || !message) {
    return null
  }

  return (
    <div
      className={`fixed top-4 right-4 max-w-md rounded-lg shadow-lg p-4 text-white flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 z-50 ${
        type === 'success'
          ? 'bg-green-600'
          : 'bg-red-600'
      }`}
      role="alert"
    >
      {/* Icon */}
      <svg
        className="w-5 h-5 mt-0.5 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {type === 'success' ? (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        )}
      </svg>

      {/* Message */}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="flex-shrink-0 text-white hover:text-opacity-80 focus:outline-none"
        aria-label="Dismiss message"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}
