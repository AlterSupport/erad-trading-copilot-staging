'use client'

import { cn } from '@/lib/utils'
import {
  BarChart3,
  FileText,
  LayoutGridIcon,
  Menu,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import UserProfile from './UserProfile'
import { ThemeToggle } from './theme-toggle'

const NavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutGridIcon size={15} />,
  },
  {
    label: 'Market Report',
    href: '/dashboard/market-report',
    icon: <BarChart3 size={15} />,
  },
  {
    label: 'Blotter Management',
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

  return (
    <header className='h-16 sticky top-0 left-0 z-50 border-b border-border w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 flex justify-between items-center gap-2 px-4 lg:px-10'>
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
            <h1 className='font-semibold'>ERP Co-Pilot</h1>
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

          <ThemeToggle className='hidden lg:inline-flex' />
          <UserProfile />
        </div>
      )}

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className='lg:hidden'>
          <Menu className='h-5 w-5' />
        </SheetTrigger>
        <SheetContent side='left' className='w-4/5 md:w-3/5'>
          <div className='flex flex-col gap-6 mt-8'>
            <UserProfile mobile />

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

            <div className='flex items-center justify-between px-2'>
              <span className='text-sm font-medium text-muted-foreground'>
                Theme
              </span>
              <ThemeToggle />
            </div>

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
