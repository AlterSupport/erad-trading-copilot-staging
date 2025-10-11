import NavHeader from '@/components/NavHeader'
import PrivateRoute from '@/components/private-route'
import React from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PrivateRoute>
      <main className='flex min-h-screen flex-col bg-background'>
        <NavHeader />
        <div className='flex flex-col flex-grow min-h-0'>{children}</div>
      </main>
    </PrivateRoute>
  )
}
