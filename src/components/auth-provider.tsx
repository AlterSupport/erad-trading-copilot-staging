'use client'

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/useAuthStore'
import { useBlotterStore } from '@/store/useBlotterStore'
import { fetchLatestBlotterAnalysis } from '@/lib/blotter-storage'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const blotterStore = useBlotterStore.getState()
      if (user) {
        blotterStore.reset()
        useAuthStore.getState().login(user)
        fetchLatestBlotterAnalysis(user.uid)
          .then((storedAnalysis) => {
            if (storedAnalysis) {
              blotterStore.hydrateFromCloud({
                fileName: storedAnalysis.fileName,
                result: storedAnalysis.analysis,
                fileSize: storedAnalysis.fileSize,
                uploadedAt: storedAnalysis.uploadedAt,
              })
            } else {
              blotterStore.markCloudHydrated()
            }
          })
          .catch((error) => {
            console.error(
              'Unable to hydrate blotter analysis from Firestore:',
              error,
            )
            blotterStore.markCloudHydrated()
          })
      } else {
        useAuthStore.getState().logout()
        blotterStore.reset()
      }
    })

    return () => unsubscribe()
  }, [])

  return <>{children}</>
}
