'use client'

import { ReactNode } from 'react'
import { ToastProvider } from '../components/ToastProvider'
import { ToastContainer } from '../components/ToastContainer'

interface ClientLayoutProps {
  children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  )
}