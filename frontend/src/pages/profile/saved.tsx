import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import {
  Bookmark,
  BookmarkX,
  MessageSquare,
  Clock,
  Lock,
  ArrowLeft,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { listSavedThreads, unsaveThread } from "@/services/user"

export default function SavedThreadsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    data: savedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["saved-threads"],
    queryFn: listSavedThreads,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  const unsaveMutation = useMutation({
    mutationFn: unsaveThread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-threads"] })
      queryClient.invalidateQueries({ queryKey: ["user-stats"] })
      toast({
        title: "Thread unsaved",
        description: "Thread removed from your saved list.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unsave thread. Please try again.",
        variant: "error",
      })
    },
  })

  const handleUnsave = (threadId: string) => {
    unsaveMutation.mutate(threadId)
  }

  const savedThreads = Array.isArray(savedData?.items) ? savedData.items : []
  const total =
    savedData?.total && typeof savedData.total === "number"
      ? savedData.total
      : 0

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">
            Error loading saved threads
          </h2>
          <p className="text-muted-foreground mb-4">
            We couldn't load your saved threads. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-blue-600" />
              Saved Threads
            </h1>
            <p className="text-muted-foreground">
              {total > 0
                ? `${total} saved thread${total === 1 ? "" : "s"}`
                : "No saved threads yet"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : savedThreads.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold mb-2">No saved threads yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            When you save threads for later reading, they'll appear here. Start
            exploring and bookmark content that interests you!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/categories")}>
              Browse Categories
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {savedThreads.map(
            (thread: {
              id: string
              title: string
              preview: string
              category: string
              category_slug: string
              replies: number
              created_at: string
              is_locked?: boolean
              has_new_replies?: boolean
            }) => (
              <Card
                key={thread.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight mb-2">
                        <button
                          onClick={() => navigate(`/threads/${thread.id}`)}
                          className="text-left hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {thread.title}
                        </button>
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-blue-100"
                          onClick={() =>
                            navigate(`/categories/${thread.category_slug}`)
                          }
                        >
                          {thread.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {thread.replies} replies
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {thread.created_at}
                        </div>
                        {thread.is_locked && (
                          <div className="flex items-center gap-1 text-amber-600">
                            <Lock className="w-3 h-3" />
                            Locked
                          </div>
                        )}
                        {thread.has_new_replies && (
                          <Badge variant="default" className="text-xs">
                            New replies
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnsave(thread.id)}
                      disabled={unsaveMutation.isPending}
                      className="flex-shrink-0 text-muted-foreground hover:text-red-600"
                    >
                      <BookmarkX className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {thread.preview}
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  )
}
