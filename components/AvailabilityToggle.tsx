'use client'

import { useState } from 'react'

interface AvailabilityToggleProps {
  itemId: string
  initialAvailable: boolean
}

export default function AvailabilityToggle({ itemId, initialAvailable }: AvailabilityToggleProps) {
  const [isAvailable, setIsAvailable] = useState(initialAvailable)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/thrift/${itemId}/toggle-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: !isAvailable }),
      })

      if (response.ok) {
        setIsAvailable(!isAvailable)
      } else {
        console.error('Failed to toggle availability status')
      }
    } catch (error) {
      console.error('Error toggling availability status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        isAvailable
          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          : 'bg-red-100 text-red-800 hover:bg-red-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isLoading ? '...' : (isAvailable ? 'Available' : 'Sold')}
    </button>
  )
}