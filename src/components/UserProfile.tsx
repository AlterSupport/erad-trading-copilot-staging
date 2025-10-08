'use client'

import { LogOut, User as UserIcon } from 'lucide-react'
import { Button } from './ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { signOutUser } from '@/lib/auth'

export default function UserProfile({ mobile }: { mobile?: boolean }) {
  const router = useRouter()

  const handleLogout = async () => {
    await signOutUser()
    router.push('/')
  }

  return (
    <div className={`items-center gap-2 ${mobile ? 'flex' : 'hidden lg:flex'}`}>
      <div
        className={`rounded-full ring-1 ring-ring flex items-center justify-center ${
          mobile ? 'w-10 h-10' : 'w-9 h-9'
        }`}
      >
        <UserIcon size={20} />
      </div>

      <div className='flex flex-col'>
        <span className='font-medium'>Admin</span>
        <span className='text-sm font-light text-muted-foreground'>
          oo@eradpartners.com
        </span>
      </div>
      <Button variant={'ghost'} size={'icon'} onClick={handleLogout}>
        <LogOut size={15} />
      </Button>
    </div>
  )
}
