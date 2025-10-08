import { create } from 'zustand'
import { User } from 'firebase/auth'

interface AuthState {
  showPassword: boolean
  togglePassword: () => void
  showDialog: boolean
  toggleDialog: () => void
  isAuthenticated: boolean
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  showPassword: false,
  togglePassword: () => set((state) => ({ showPassword: !state.showPassword })),
  showDialog: false,
  toggleDialog: () => set((state) => ({ showDialog: !state.showDialog })),
  isAuthenticated: false,
  user: null,
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
}))
