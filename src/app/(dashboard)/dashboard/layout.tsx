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
        <div className='p-4 lg:p-10 '>{children}</div>
      </main>
    </PrivateRoute>
  )
}
