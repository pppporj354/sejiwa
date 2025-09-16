import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  AlertTriangle,
  Eye,
  Users,
  Clock,
  BookOpen,
  PlusCircle,
  Crown,
} from "lucide-react"
import { listThreads } from "@/services/threads"
import { getUserActivity } from "@/services/user"
import { getReports, getModerationStats } from "@/services/moderation"
import { useAuthStore } from "@/store/auth"

export default function ModeratorHomePage() {
  const { user } = useAuthStore()

  const { data: recentThreads } = useQuery({
    queryKey: ["threads", "recent"],
    queryFn: () => listThreads({ page: 1, page_size: 5 }),
  })

  const { data: userActivity } = useQuery({
    queryKey: ["user-activity"],
    queryFn: getUserActivity,
  })

  const { data: reports } = useQuery({
    queryKey: ["reports"],
    queryFn: () => getReports({ page: 1, pageSize: 5, status: "pending" }),
  })

  const { data: moderationStats } = useQuery({
    queryKey: ["moderation-stats"],
    queryFn: () => getModerationStats(),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Welcome Header with Moderator Badge */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Welcome back, {user?.username}
                </h1>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                  <Crown className="w-3 h-3 mr-1" />
                  Moderator
                </Badge>
              </div>
              <p className="text-slate-600">
                Help keep our community safe and supportive
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link to="/moderation">
                  <Shield className="w-4 h-4 mr-2" />
                  Moderation Panel
                </Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/threads/new">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Start Discussion
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
            {/* Moderation Stats */}
            <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  Moderation Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="text-2xl font-bold text-red-600">
                      {moderationStats?.pending_reports || 0}
                    </div>
                    <div className="text-sm text-slate-600">
                      Pending Reports
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-2xl font-bold text-green-600">
                      {moderationStats?.resolved_reports || 0}
                    </div>
                    <div className="text-sm text-slate-600">Resolved Today</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">
                      {moderationStats?.total_reports || 0}
                    </div>
                    <div className="text-sm text-slate-600">Total Reports</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3 justify-center">
                  <Button asChild size="sm">
                    <Link to="/moderation/reports">View All Reports</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/moderation/actions">Moderation History</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Recent Reports
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
                      No pending reports. Great job keeping the community safe!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Discussions (Moderator View) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Community Discussions (Monitor)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentThreads?.threads?.slice(0, 5).map((thread) => (
                    <div
                      key={thread.id}
                      className="flex items-start gap-3 p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
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
                        </div>
                      </div>
                      <Button asChild size="sm" variant="ghost">
                        <Link to={`/threads/${thread.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Moderator Actions */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  Moderator Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link to="/moderation/reports">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Review Reports
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link to="/moderation/users">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link to="/moderation/actions">
                    <Clock className="w-4 h-4 mr-2" />
                    Action History
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Personal Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg bg-slate-50">
                    <span className="text-sm text-slate-600">
                      Discussions Started
                    </span>
                    <span className="font-medium">
                      {userActivity?.thread_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-slate-50">
                    <span className="text-sm text-slate-600">
                      Replies Posted
                    </span>
                    <span className="font-medium">
                      {userActivity?.reply_count || 0}
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
                    <Link to="/profile/activity">View Full Activity</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Actions</CardTitle>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
