import PrivateRoute from '@/components/private-route'
import React from 'react'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PrivateRoute>
      <main className='flex flex-1 flex-col bg-[#F9F9F9] overflow-x-hidden'>
        {children}
      </main>
    </PrivateRoute>
  )
}
