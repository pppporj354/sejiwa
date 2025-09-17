import { useAuthStore } from "@/store/auth"
import UserHomePage from "@/pages/home/user-home"
import ModeratorHomePage from "@/pages/home/moderator-home"
import AdminHomePage from "@/pages/home/admin-home"
import PublicHomePage from "@/pages/home/public-home"

export default function HomePage() {
  const { user, isAuthenticated, accessToken } = useAuthStore()

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
