import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Shield,
  Heart,
  TrendingUp,
  BookOpen,
  PlusCircle,
} from "lucide-react"
import { listCategories } from "@/services/categories"
import { listThreads } from "@/services/threads"
import { getUserActivity } from "@/services/user"
import { useAuthStore } from "@/store/auth"

export default function UserHomePage() {
  const { user } = useAuthStore()

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  })

  const { data: recentThreads } = useQuery({
    queryKey: ["threads", "recent"],
    queryFn: () => listThreads({ page: 1, page_size: 5 }),
  })

  const { data: userActivity } = useQuery({
    queryKey: ["user-activity"],
    queryFn: getUserActivity,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Welcome Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, {user?.username}
              </h1>
              <p className="text-slate-600 mt-1">
                Continue your mental wellness journey in our supportive
                community
              </p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/threads/new">
                <PlusCircle className="w-4 h-4 mr-2" />
                Start Discussion
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Activity Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Your Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {userActivity?.thread_count || 0}
                    </div>
                    <div className="text-sm text-slate-600">
                      Discussions Started
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {userActivity?.reply_count || 0}
                    </div>
                    <div className="text-sm text-slate-600">Replies Posted</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(userActivity?.thread_count || 0) +
                        (userActivity?.reply_count || 0)}
                    </div>
                    <div className="text-sm text-slate-600">
                      Total Contributions
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/profile/activity">View Full Activity</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Discussions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  Recent Discussions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentThreads?.threads?.slice(0, 5).map((thread) => (
                    <div
                      key={thread.id}
                      className="flex items-start gap-3 p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 hover:text-blue-600">
                          <Link to={`/threads/${thread.id}`}>
                            {thread.title}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                          <Badge variant="secondary" className="text-xs">
                            {thread.category_name}
                          </Badge>
                          <span>•</span>
                          <span>{thread.reply_count} replies</span>
                          <span>•</span>
                          <span>
                            {new Date(thread.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link to="/threads/new">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Start Discussion
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link to="/categories">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Categories
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link to="/profile/saved">
                    <Heart className="w-4 h-4 mr-2" />
                    Saved Threads
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories?.slice(0, 5).map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50"
                    >
                      <div>
                        <div className="font-medium text-slate-900">
                          {category.name}
                        </div>
                        <div className="text-sm text-slate-600">
                          {category.thread_count} threads
                        </div>
                      </div>
                      <Button asChild size="sm" variant="ghost">
                        <Link to={`/categories/${category.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button
                    asChild
                    className="w-full"
                    variant="outline"
                    size="sm"
                  >
                    <Link to="/categories">View All Categories</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines Reminder */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">
                  Remember to be respectful, protect privacy, and support each
                  other. Report any concerning content to keep our community
                  safe.
                </p>
                <Button
                  asChild
                  className="w-full mt-3"
                  variant="outline"
                  size="sm"
                >
                  <Link to="/guidelines">Read Full Guidelines</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
