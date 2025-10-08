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
      <main className='flex flex-col min-h-screen bg-[#F9F9F9]'>
        <NavHeader />
        <div className='flex flex-col flex-grow'>{children}</div>
      </main>
    </PrivateRoute>
  )
}
