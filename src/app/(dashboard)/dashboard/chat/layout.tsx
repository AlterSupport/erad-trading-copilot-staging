import PrivateRoute from '@/components/private-route'
import React from 'react'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PrivateRoute>
      <main className='flex flex-col h-screen bg-[#F9F9F9]'>
        {children}
      </main>
    </PrivateRoute>
  )
}
