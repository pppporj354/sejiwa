import { useAuthStore } from "@/store/auth"
import UserHomePage from "@/pages/home/user-home"
import ModeratorHomePage from "@/pages/home/moderator-home"
import AdminHomePage from "@/pages/home/admin-home"
import PublicHomePage from "@/pages/home/public-home"

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore()

  // If not authenticated, show public home page
  if (!isAuthenticated || !user) {
    return <PublicHomePage />
  }

  // Route to role-specific home pages
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
