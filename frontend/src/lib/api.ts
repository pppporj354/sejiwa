import axios from "axios"
import storage from "@/lib/storage"

const api = axios.create({
  withCredentials: false,
})

// Token management (in-memory; synced by store)
let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

export default api

// Global 401 handling: clear session and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // For guests (no token), don't force redirect; let UI handle 401 gracefully
      const hasToken = Boolean(accessToken)

      // If already on auth pages, just surface error
      if (
        typeof location !== "undefined" &&
        (location.pathname.startsWith("/login") ||
          location.pathname.startsWith("/register"))
      ) {
        return Promise.reject(err)
      }

      if (hasToken) {
        // Authenticated user: clear session; route guards will handle redirects
        storage.setAccessToken(null)
        storage.setRefreshToken(null)
        storage.setUser(null)
        setAccessToken(null)
      }
      // If no token, just reject so pages like PublicHome can show fallbacks
    }
    return Promise.reject(err)
  }
)
