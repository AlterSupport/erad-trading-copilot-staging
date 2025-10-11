'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/useAuthStore'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const { showPassword, togglePassword, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    try {
      await signIn(email, password)
    } catch (error) {
      console.error(error)
    }
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <main className='flex flex-col justify-center items-center gap-5 h-full px-4'>
      <Image
        src='/logo.png'
        alt='Project X Logo'
        width={40}
        height={40}
        className='object-contain'
      />
      <h3 className='font-semibold text-lg'>Erad Partners Exclusive</h3>

      <form onSubmit={handleSubmit} className='w-full max-w-sm space-y-4'>
        <div className='relative'>
          <Mail
            size={15}
            className='absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground'
          />
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='Email Address'
            required
            className='pl-8 h-11'
          />
        </div>
        <div className='relative'>
          <Lock
            size={15}
            className='absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground'
          />
          <Input
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            required
            className='pl-8 h-11'
          />

          <button
            type='button'
            onClick={togglePassword}
            className='absolute right-2 top-1/2 -translate-y-1/2 transform text-muted-foreground'
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <Link
          href={'/forgot-password'}
          className='ml-auto flex items-end justify-end font-semibold text-sm '
        >
          Forgot Password?
        </Link>

        <Button type='submit' size={'lg'} className='w-full'>
          Sign In
        </Button>
      </form>
    </main>
  )
}
