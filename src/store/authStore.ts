import { create } from 'zustand'
import { API_BASE } from '@/config'

export interface User {
  id: string
  [key: string]: any
}

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('lithos_token'),
  user: localStorage.getItem('lithos_user') ? JSON.parse(localStorage.getItem('lithos_user') as string) : null,
  setAuth: (token, user) => {
    localStorage.setItem('lithos_token', token)
    localStorage.setItem('lithos_user', JSON.stringify(user))
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem('lithos_token')
    localStorage.removeItem('lithos_user')
    set({ token: null, user: null })
  },
  fetchUser: async () => {
    const { token } = get()
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        const user = data.user || data
        localStorage.setItem('lithos_user', JSON.stringify(user))
        set({ user })
      } else if (res.status === 401) {
        get().logout()
      }
    } catch (err) {
      console.error(err)
    }
  }
}))
