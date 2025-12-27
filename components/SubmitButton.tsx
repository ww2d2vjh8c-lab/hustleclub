"use client"

import { useFormStatus } from "react-dom"

interface SubmitButtonProps {
  children: React.ReactNode
  className?: string
  confirm?: string
}

export function SubmitButton({
  children,
  className = "",
  confirm,
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) {
          e.preventDefault()
        }
      }}
      className={`px-3 py-1 rounded disabled:opacity-50 ${className}`}
    >
      {pending ? "Processing..." : children}
    </button>
  )
}