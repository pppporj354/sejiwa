import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Settings,
  Users,
  BookOpen,
  BarChart3,
  Crown,
  Eye,
  AlertTriangle,
  PlusCircle,
} from "lucide-react"
import { listCategories } from "@/services/categories"
import { listThreads } from "@/services/threads"
import { getUsers } from "@/services/users"
import { getReports, getModerationStats } from "@/services/moderation"
import { useAuthStore } from "@/store/auth"

export default function AdminHomePage() {
  const { user } = useAuthStore()

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  })

  const { data: recentThreads } = useQuery({
    queryKey: ["threads", "recent"],
    queryFn: () => listThreads({ page: 1, page_size: 5 }),
  })

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({ page: 1, pageSize: 10 }),
  })

  const { data: reports } = useQuery({
    queryKey: ["reports"],
    queryFn: () => getReports({ page: 1, pageSize: 5 }),
  })

  const { data: moderationStats } = useQuery({
    queryKey: ["moderation-stats"],
    queryFn: () => getModerationStats(),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Welcome Header with Admin Badge */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Admin Dashboard - {user?.username}
                </h1>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  <Crown className="w-3 h-3 mr-1" />
                  Administrator
                </Badge>
              </div>
              <p className="text-slate-600">
                Manage the community platform and oversee all operations
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link to="/admin">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Panel
                </Link>
              </Button>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link to="/admin/categories">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Category
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Platform Overview */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Platform Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">
                      {users?.total || 0}
                    </div>
                    <div className="text-sm text-slate-600">Total Users</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-2xl font-bold text-green-600">
                      {categories?.length || 0}
                    </div>
                    <div className="text-sm text-slate-600">Categories</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="text-2xl font-bold text-orange-600">
                      {recentThreads?.total || 0}
                    </div>
                    <div className="text-sm text-slate-600">Total Threads</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="text-2xl font-bold text-red-600">
                      {moderationStats?.pending_reports || 0}
                    </div>
                    <div className="text-sm text-slate-600">
                      Pending Reports
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3 justify-center">
                  <Button asChild size="sm">
                    <Link to="/admin/analytics">View Analytics</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin/settings">Platform Settings</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Activity Monitor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Community Activity Monitor
                  <Badge variant="secondary" className="ml-2">
                    Admin View
                  </Badge>
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
                          <span>by {thread.author.username}</span>
                          <span>•</span>
                          <span>
                            {new Date(thread.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="ghost">
                          <Link to={`/threads/${thread.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link to={`/admin/threads/${thread.id}/manage`}>
                            <Settings className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Moderation Queue
                  {reports?.reports && reports.reports.length > 0 && (
                    <Badge variant="danger" className="ml-2">
                      {reports.reports.length} pending
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reports?.reports && reports.reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.reports.slice(0, 3).map((report) => (
                      <div
                        key={report.id}
                        className="flex items-start gap-3 p-4 rounded-lg border border-red-100 bg-red-50/50"
                      >
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {report.content_type}
                            </Badge>
                            <Badge
                              variant={
                                report.priority === "high"
                                  ? "danger"
                                  : report.priority === "medium"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {report.priority} priority
                            </Badge>
                          </div>
                          <p className="font-medium text-slate-900">
                            {report.reason}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            Reported{" "}
                            {new Date(report.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/moderation/reports/${report.id}`}>
                            Review
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Shield className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>
                      No pending reports. The community is running smoothly!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Admin Sidebar */}
          <div className="space-y-6">
            {/* Admin Tools */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  Admin Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link to="/admin/categories">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Manage Categories
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link to="/admin/users">
                    <Users className="w-4 h-4 mr-2" />
                    User Management
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link to="/admin/moderators">
                    <Shield className="w-4 h-4 mr-2" />
                    Manage Moderators
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link to="/admin/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Platform Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg bg-slate-50">
                    <span className="text-sm text-slate-600">Active Users</span>
                    <span className="font-medium">
                      {users?.items?.filter((u) => u.status === "active")
                        .length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-slate-50">
                    <span className="text-sm text-slate-600">Moderators</span>
                    <span className="font-medium">
                      {users?.items?.filter((u) => u.role === "moderator")
                        .length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-slate-50">
                    <span className="text-sm text-slate-600">
                      Public Categories
                    </span>
                    <span className="font-medium">
                      {categories?.filter((c) => !c.is_private).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-slate-50">
                    <span className="text-sm text-slate-600">
                      Private Categories
                    </span>
                    <span className="font-medium">
                      {categories?.filter((c) => c.is_private).length || 0}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    asChild
                    className="w-full"
                    variant="outline"
                    size="sm"
                  >
                    <Link to="/admin/analytics">Detailed Analytics</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Platform Status
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Moderation Queue
                    </span>
                    <Badge
                      className={
                        (moderationStats?.pending_reports || 0) > 5
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {(moderationStats?.pending_reports || 0) > 5
                        ? "Attention Needed"
                        : "Good"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Community Health
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      Healthy
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
