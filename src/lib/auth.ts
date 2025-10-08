import { auth } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { useAuthStore } from '@/store/useAuthStore'

export const signIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => {
  await signOut(auth)
}
