import axios from "axios"
import storage from "@/lib/storage"

const api = axios.create({
  withCredentials: false,
  baseURL: "/api", // Add base URL for API calls
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
  (res) => {
    // Debug logging for development
    // if (process.env.NODE_ENV === "development") {
    //   console.log(
    //     `API Response [${res.config.method?.toUpperCase()} ${res.config.url}]:`,
    //     res.data
    //   )
    // }
    return res
  },
  (err) => {
    // Debug logging for errors
    // if (process.env.NODE_ENV === "development") {
    //   console.error(
    //     `API Error [${err.config?.method?.toUpperCase()} ${err.config?.url}]:`,
    //     err.response?.data || err.message
    //   )
    // }

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

        // Also clear the auth store state to trigger re-renders
        // We'll import this dynamically to avoid circular dependencies
        import("@/store/auth").then(({ useAuthStore }) => {
          useAuthStore.getState().clearSession()
        })
      }
      // If no token, just reject so pages like PublicHome can show fallbacks
    }
    return Promise.reject(err)
  }
)
