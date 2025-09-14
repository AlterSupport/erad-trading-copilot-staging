import NavHeader from '@/components/NavHeader'
import { PropsWithChildren } from 'react'

export default function IndexLayout({ children }: PropsWithChildren) {
  return (
    <main className='overflow-hidden h-screen flex flex-col'>
      <NavHeader />
      <div className='flex-1'>{children}</div>
    </main>
  )
}
