'use client'

import { useState } from 'react'

interface ActiveToggleProps {
  jobId: string
  initialActive: boolean
}

export default function ActiveToggle({ jobId, initialActive }: ActiveToggleProps) {
  const [isActive, setIsActive] = useState(initialActive)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/clipping/${jobId}/toggle-active`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !isActive }),
      })

      if (response.ok) {
        setIsActive(!isActive)
      } else {
        console.error('Failed to toggle active status')
      }
    } catch (error) {
      console.error('Error toggling active status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        isActive
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isLoading ? '...' : (isActive ? 'Active' : 'Inactive')}
    </button>
  )
}