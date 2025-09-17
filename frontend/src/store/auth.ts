import { create } from "zustand"
import { login as apiLogin, register as apiRegister } from "@/services/auth"
import type { UserProfile, AuthResponse } from "@/types/api"
import storage from "@/lib/storage"
import { setAccessToken } from "@/lib/api"

export type AuthState = {
  user: UserProfile | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  lastAuthChangeAt: number | null
  setSession: (auth: AuthResponse) => void
  clearSession: () => void
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storage.getUser(),
  accessToken: storage.getAccessToken(),
  refreshToken: storage.getRefreshToken(),
  lastAuthChangeAt: null,
  isAuthenticated: !!storage.getAccessToken(),
  setSession: (auth) => {
    storage.setAccessToken(auth.access_token)
    storage.setRefreshToken(auth.refresh_token)
    storage.setUser(auth.user)
    setAccessToken(auth.access_token)
    set((state) => ({
      ...state,
      accessToken: auth.access_token,
      refreshToken: auth.refresh_token,
      user: auth.user,
      isAuthenticated: true,
      lastAuthChangeAt: Date.now(),
    }))
  },
  clearSession: () => {
    storage.setAccessToken(null)
    storage.setRefreshToken(null)
    storage.setUser(null)
    setAccessToken(null)
    set((state) => ({
      ...state,
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      lastAuthChangeAt: Date.now(),
    }))
  },
  login: async (username, password) => {
    const res = await apiLogin({ username, password })
    get().setSession(res)
  },
  register: async (username, password) => {
    const res = await apiRegister({ username, password })
    get().setSession(res)
  },
  logout: () => {
    get().clearSession()
  },
}))

// Initialize axios token from persisted state
setAccessToken(storage.getAccessToken())
