import { create } from 'zustand'

interface AuthState {
  showPassword: boolean
  togglePassword: () => void
  showDialog: boolean
  toggleDialog: () => void
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  showPassword: false,
  togglePassword: () => set((state) => ({ showPassword: !state.showPassword })),
  showDialog: false,
  toggleDialog: () => set((state) => ({ showDialog: !state.showDialog })),
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}))
