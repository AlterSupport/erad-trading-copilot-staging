'use client'

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/useAuthStore'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        useAuthStore.getState().login(user)
      } else {
        useAuthStore.getState().logout()
      }
    })

    return () => unsubscribe()
  }, [])

  return <>{children}</>
}
