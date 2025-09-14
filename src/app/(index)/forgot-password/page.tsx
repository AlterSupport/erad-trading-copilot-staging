'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'
import Image from 'next/image'

export default function ForgotPassword() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = {
      email: formData.get('email'),
    }
    alert(JSON.stringify(data)) // 🔑 Replace with your login logic
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
            className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500'
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

        <Button type='submit' size={'lg'} className='w-full'>
          Reset Password
        </Button>
      </form>
    </main>
  )
}
