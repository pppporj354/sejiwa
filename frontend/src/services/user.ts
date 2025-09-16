import api from "@/lib/api"
import type { UserProfile, UserActivity } from "@/types/api"

// Types for user dashboard
export type UserStats = {
  threads_created: number
  replies_posted: number
  threads_liked: number
  threads_saved: number
  active_days: number
  streak_days: number
  categories_joined: number
  report_count: number
  karma_points: number
}

export type ThreadPreview = {
  id: string
  title: string
  category: string
  category_slug: string
  replies: number
  created_at: string
  preview: string
  has_new_replies: boolean
  is_locked: boolean
}

export type ReplyPreview = {
  thread_id: string
  thread_title: string
  category: string
  category_slug: string
  replied_at: string
  preview: string
}

export type CategorySubscription = {
  id: string
  name: string
  slug: string
  thread_count: number
  description: string
}

// Get user profile
export async function getUserProfile(): Promise<UserProfile> {
  const { data } = await api.get("/users/me/profile")
  return data
}

// Update user profile (password change)
export async function updateUserProfile(updates: {
  current_password?: string
  new_password?: string
}): Promise<UserProfile> {
  const { data } = await api.put("/users/me/profile", updates)
  return data
}

// Get user statistics
export async function getUserStats(): Promise<UserStats> {
  const { data } = await api.get("/users/me/stats")
  return data
}

// Get user activity (threads, replies, saved)
export async function getUserActivity(): Promise<UserActivity> {
  const { data } = await api.get("/users/me/activity")
  return data
}

// Get user's subscribed categories
export async function getUserCategories(): Promise<CategorySubscription[]> {
  // Prefer subscriptions endpoint now that it's backed by a real table
  const { data } = await api.get("/users/me/subscriptions")
  return data
}

// Saved threads APIs
export async function listSavedThreads() {
  try {
    const { data } = await api.get("/users/me/saved-threads")
    // Ensure we have a valid response with items array
    if (data && typeof data === "object" && Array.isArray(data.items)) {
      return data
    } else {
      console.warn(
        "listSavedThreads: Expected object with items array but got:",
        data
      )
      return { items: [], total: 0 }
    }
  } catch (error) {
    console.error("listSavedThreads error:", error)
    return { items: [], total: 0 }
  }
}

export async function saveThread(thread_id: string) {
  const { data } = await api.post("/users/me/saved-threads", {
    thread_id,
  })
  return data
}

export async function unsaveThread(thread_id: string) {
  const { data } = await api.delete("/users/me/saved-threads", {
    data: { thread_id },
  })
  return data
}

// Get user's notification preferences
export async function getUserNotificationPreferences() {
  const { data } = await api.get("/users/me/preferences")
  return data.notifications
}

// Update user notification preferences
export async function updateUserNotificationPreferences(preferences: {
  thread_replies?: boolean
  mentions?: boolean
  category_updates?: boolean
  community_announcements?: boolean
}) {
  const { data } = await api.put(
    "/users/me/preferences/notifications",
    preferences
  )
  return data
}

// Get user privacy settings
export async function getUserPrivacySettings() {
  const { data } = await api.get("/users/me/preferences")
  return data.privacy
}

// Update user privacy settings
export async function updateUserPrivacySettings(settings: {
  show_active_status?: boolean
  allow_direct_messages?: boolean
  content_visibility?: "all" | "categories" | "none"
}) {
  const { data } = await api.put("/users/me/preferences/privacy", settings)
  return data
}
