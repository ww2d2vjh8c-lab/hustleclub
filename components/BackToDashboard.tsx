'use client'

import { useRouter } from 'next/navigation'

export default function BackToDashboard() {
  const router = useRouter()

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <button
      onClick={handleBackToDashboard}
      className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium mb-6 transition-colors"
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back to Dashboard
    </button>
  )
}