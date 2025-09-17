import { useAuthStore } from "@/store/auth"
import UserHomePage from "@/pages/home/user-home"
import ModeratorHomePage from "@/pages/home/moderator-home"
import AdminHomePage from "@/pages/home/admin-home"
import PublicHomePage from "@/pages/home/public-home"
import { useEffect } from "react"
import storage from "@/lib/storage"

export default function HomePage() {
  const { user, isAuthenticated, accessToken, setSession } = useAuthStore()

  // Hydration effect to ensure auth state is properly loaded from localStorage
  useEffect(() => {
    const storedToken = storage.getAccessToken()
    const storedUser = storage.getUser()
    
    console.log("HomePage useEffect - checking stored auth:", {
      storedToken: storedToken ? `${storedToken.substring(0, 20)}...` : null,
      storedUser,
      currentAuthenticated: isAuthenticated,
      currentUser: user
    })
    
    // If we have stored auth but the store is not authenticated, restore the session
    if (storedToken && storedUser && !isAuthenticated) {
      console.log("Restoring auth session from localStorage")
      // Simulate auth response to restore session
      setSession({
        access_token: storedToken,
        refresh_token: storage.getRefreshToken() || '',
        token_type: 'Bearer',
        expires_in: 86400,
        user: storedUser
      })
    }
  }, [isAuthenticated, user, setSession])

  // Debug logging to see what's happening
  console.log("HomePage Debug:", { 
    isAuthenticated, 
    user, 
    role: user?.role,
    accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
    hasToken: !!accessToken,
    hasUser: !!user
  })

  // If not authenticated, show public home page
  if (!isAuthenticated || !user) {
    console.log("Showing PublicHomePage - not authenticated or no user")
    return <PublicHomePage />
  }

  // Route to role-specific home pages
  console.log(`Routing to ${user.role} home page`)
  switch (user.role) {
    case "admin":
      return <AdminHomePage />
    case "moderator":
      return <ModeratorHomePage />
    case "user":
    default:
      return <UserHomePage />
  }
}
