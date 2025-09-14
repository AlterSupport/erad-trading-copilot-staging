'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'
import {
  FileText,
  LayoutGridIcon,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

const NavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutGridIcon size={15} />,
  },
  {
    label: 'Blotters',
    href: '/dashboard/blotters',
    icon: <FileText size={15} />,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings size={15} />,
  },
]

export default function NavHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className='h-16 sticky top-0 left-0 z-50 border-b border-border w-full bg-white flex justify-between items-center gap-2 px-4 lg:px-10'>
      <div className='flex items-center gap-4 lg:gap-10'>
        <Link href={'/'} className='flex items-center gap-2'>
          <Image
            src={'/logo.png'}
            alt='logo '
            width={30}
            height={30}
            className='object-cover'
          />
          {!pathname.startsWith('/dashboard') && (
            <h1 className='font-semibold'>Project X</h1>
          )}
        </Link>

        {pathname.startsWith('/dashboard') && (
          <nav className='hidden lg:flex items-center gap-3 lg:gap-5'>
            {NavItems.map((item) => (
              <Button
                variant={'ghost'}
                key={item.href}
                asChild
                className={cn(
                  'text-sm flex items-center gap-2',
                  pathname === item.href
                    ? 'text-primary bg-accent ring-1 ring-input'
                    : 'text-muted-foreground hover:ring-1 hover:ring-input'
                )}
              >
                <Link href={item.href}>
                  <span className='flex items-center gap-2'>
                    {item.icon}
                    <span className='hidden lg:inline'>{item.label}</span>
                  </span>
                </Link>
              </Button>
            ))}
          </nav>
        )}
      </div>

      {pathname.startsWith('/dashboard') && (
        <div className='flex items-center gap-2 lg:gap-5'>
          <Badge className='hidden lg:inline-flex rounded-3xl h-9 w-22 text-sm bg-badge-foreground text-badge'>
            <ShieldCheck size={15} />
            <span className='hidden lg:inline'>Secure</span>
          </Badge>
          <Badge className='hidden lg:inline-flex rounded-3xl h-9 w-50 text-sm bg-secondary-badge-foreground text-secondary-badge'>
            Erad Partners Exclusive
          </Badge>

          <div className='items-center gap-2 hidden lg:flex'>
            <Image
              src={'/portrait.jpg'}
              alt='User Portrait'
              width={40}
              height={40}
              className='object-cover w-9 h-9 rounded-full ring-1 ring-ring'
            />

            <div className='flex flex-col'>
              <span className='font-medium'>John Doe</span>
              <span className='text-sm font-light text-muted-foreground'>
                johndoe@example.com
              </span>
            </div>
            <Button variant={'ghost'} size={'icon'} onClick={handleLogout}>
              <LogOut size={15} />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className='lg:hidden'>
          <Menu className='h-5 w-5' />
        </SheetTrigger>
        <SheetContent side='left' className='w-4/5 md:w-3/5'>
          <div className='flex flex-col gap-6 mt-8'>
            <div className='flex items-center gap-2 px-2'>
              <Image
                src={'/portrait.jpg'}
                alt='User Portrait'
                width={40}
                height={40}
                className='object-cover w-10 h-10 rounded-full ring-1 ring-ring'
              />
              <div className='flex flex-col'>
                <span className='font-medium'>John Doe</span>
                <span className='text-sm font-light text-muted-foreground'>
                  johndoe@example.com
                </span>
              </div>
            </div>

            <nav className='flex flex-col gap-1 px-2'>
              {NavItems.map((item) => (
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  key={item.href}
                  asChild
                  className='justify-start w-full'
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={item.href}>
                    <span className='flex items-center gap-3'>
                      {item.icon}
                      {item.label}
                    </span>
                  </Link>
                </Button>
              ))}
            </nav>

            <div className='flex flex-col gap-2 px-2'>
              <Badge className='flex justify-center items-center gap-2 rounded-3xl h-9 w-full text-sm bg-badge-foreground text-badge'>
                <ShieldCheck />
                Secure Connection
              </Badge>
              <Badge
                variant='secondary'
                className='flex justify-center items-center gap-2 rounded-3xl h-9 w-full text-sm bg-secondary-badge-foreground text-secondary-badge'
              >
                Erad Partners Exclusive
              </Badge>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
