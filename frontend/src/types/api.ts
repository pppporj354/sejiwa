// Shared API response types based on swagger.yaml

export type ApiErrorDetail = {
  field: string
  code: string
  message: string
}

export type ErrorResponse = {
  success: boolean
  message: string
  error: string
  code: string
  details?: ApiErrorDetail[]
  timestamp: string
}

export type UserProfile = {
  id: string
  username: string
  email?: string
  role: "user" | "moderator" | "admin"
  status: "active" | "inactive" | "suspended" | "banned"
  created_at: string
  updated_at: string
  last_active_at: string
  thread_count: number
  reply_count: number
  violations_count?: number
  banned?: boolean
}

export type AuthResponse = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: UserProfile
}

// Moderation/Report DTOs
export type AnonymousAuthor = {
  id: string
  username: string
  role: "user" | "moderator" | "admin"
}

export type ReportedUserHistory = {
  previous_reports_count: number
  previous_violations_count: number
  account_age_days: number
  recent_activity_level: string
}

export type ModerationReport = {
  id: string
  content_type: "thread" | "reply"
  content_id: string
  reason: string
  description: string
  status: string
  priority: string
  reporter: AnonymousAuthor
  reported_user: AnonymousAuthor
  content: unknown
  content_preview: string
  user_history: ReportedUserHistory
  created_at: string | Date
  updated_at: string | Date
}

export type ReportListResponse = {
  reports: ModerationReport[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type ModerationActionRequest = {
  action:
    | "dismiss"
    | "warn_user"
    | "hide_content"
    | "delete_content"
    | "ban_user_temp"
    | "ban_user_permanent"
  reason: string
  ban_duration_days?: number
  internal_notes?: string
}

export type ModerationStatsResponse = {
  total_reports: number
  pending_reports: number
  resolved_reports: number
  content_hidden: number
  content_deleted: number
  users_warned: number
  users_banned_temp: number
  users_banned_perm: number
  actions_this_week: number
  actions_this_month: number
  average_response_time_hours: number
}

// Admin DTOs
export type CreateAdminRequest = {
  username: string
  password: string
  email: string
  full_name?: string
}

export type CreateModeratorRequest = {
  username: string
  password: string
  email: string
  full_name?: string
  permissions?: string[]
}

export type ModeratorProfile = {
  id: string
  username: string
  email: string
  full_name?: string
  created_at: string
  updated_at: string
  status: string
  role: "moderator" | "admin"
  permissions: string[]
  thread_count: number
  reply_count: number
  last_active_at: string
  created_by?: string
}

// Category DTOs
export type Category = {
  id: string
  name: string
  slug: string
  description: string
  thread_count: number
  is_locked: boolean
  is_private: boolean
  has_password: boolean
  created_at: string | Date
  updated_at: string | Date
}

export type CreateCategoryRequest = {
  name: string
  description?: string
  is_private?: boolean
  password?: string
}

export type UpdateCategoryRequest = {
  name?: string
  description?: string
  is_locked?: boolean
  is_private?: boolean
  set_password?: string
}

export type SubscribeRequest = {
  category_id: string
  password?: string
}

// Thread DTOs
export type Thread = {
  author: AnonymousAuthor | UserProfile
  id: string
  title: string
  content: string
  author_username: string
  category_id: string
  category_name: string
  category_slug: string
  reply_count: number
  view_count: number
  is_pinned: boolean
  is_locked: boolean
  is_private: boolean
  assigned_moderator_id?: string
  assigned_moderator_username?: string
  moderation_status: string
  is_edited: boolean
  created_at: string | Date
  updated_at: string | Date
  last_reply_at?: string | Date
}

export type ThreadListResponse = {
  threads: Thread[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type CreateThreadRequest = {
  title: string
  content: string
  category_id: string
  is_private?: boolean
  password?: string
  assigned_moderator_id?: string
}

export type UpdateThreadRequest = {
  title?: string
  content?: string
  is_private?: boolean
  set_password?: string
  assigned_moderator_id?: string
}

// Reply DTOs
export type Reply = {
  id: string
  content: string
  author_username: string
  thread_id: string
  parent_reply_id?: string
  depth: number
  reply_count: number
  moderation_status: string
  is_edited: boolean
  created_at: string | Date
  updated_at: string | Date
}

export type ReplyListResponse = {
  replies: Reply[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type CreateReplyRequest = {
  content: string
  parent_reply_id?: string
}

// Moderation Action Response
export type ModerationActionResponse = {
  id: string
  report_id: string
  content_type: "thread" | "reply"
  content_id: string
  reported_user: AnonymousAuthor
  action: string
  reason: string
  moderator: AnonymousAuthor
  created_at: string | Date
  ban_expires_at?: string | Date
}

// User Activity Response
export type UserActivity = {
  thread_count: number
  reply_count: number
  threads: Array<{
    id: string
    title: string
    category_name: string
    category: string
    reply_count: number
    replies: number
    created_at: string
    preview: string
    has_new_replies: boolean
  }>
  replies: Array<{
    id: string
    thread_id: string
    thread_title: string
    category_name: string
    created_at: string
    content: string
  }>
  recent_replies: Array<{
    id: string
    thread_id: string
    thread_title: string
    category_name: string
    category: string
    created_at: string
    replied_at: string
    content: string
    preview: string
  }>
}
