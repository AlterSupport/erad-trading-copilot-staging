import { auth } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

export const signIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => {
  await signOut(auth)
}
