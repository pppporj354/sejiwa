import api from "@/lib/api"
import type {
  Thread,
  ThreadListResponse,
  CreateThreadRequest,
  UpdateThreadRequest,
  Reply,
  ReplyListResponse,
  CreateReplyRequest,
} from "@/types/api"

// Thread APIs
export async function createThread(data: CreateThreadRequest) {
  const res = await api.post<Thread>("/threads", data)
  return res.data
}

export async function getThread(id: string, opts?: { password?: string }) {
  const params: Record<string, string> = {}
  if (opts?.password) params.password = opts.password
  const res = await api.get<Thread>(`/threads/${id}`, { params })
  return res.data
}

export async function updateThread(id: string, data: UpdateThreadRequest) {
  const res = await api.put<Thread>(`/threads/${id}`, data)
  return res.data
}

export async function deleteThread(id: string) {
  const res = await api.delete<{ success: boolean; message: string }>(
    `/threads/${id}`
  )
  return res.data
}

export async function listThreads(params?: {
  category_id?: string
  page?: number
  page_size?: number
  sort?: string
}) {
  try {
    const searchParams = new URLSearchParams()
    if (params?.category_id) searchParams.set("category_id", params.category_id)
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.page_size)
      searchParams.set("page_size", params.page_size.toString())
    if (params?.sort) searchParams.set("sort", params.sort)

    const res = await api.get<ThreadListResponse>(
      `/threads${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
    )

    // Ensure we have a valid ThreadListResponse structure
    if (
      res.data &&
      typeof res.data === "object" &&
      Array.isArray(res.data.threads)
    ) {
      return res.data
    } else {
      console.warn(
        "listThreads: Expected ThreadListResponse but got:",
        res.data
      )
      return {
        threads: [],
        total: 0,
        page: 1,
        page_size: params?.page_size || 20,
        total_pages: 0,
      }
    }
  } catch (error) {
    console.error("listThreads error:", error)
    return {
      threads: [],
      total: 0,
      page: 1,
      page_size: params?.page_size || 20,
      total_pages: 0,
    }
  }
}

// Reply APIs
export async function createReply(threadId: string, data: CreateReplyRequest) {
  const res = await api.post<Reply>(`/threads/${threadId}/replies`, data)
  return res.data
}

export async function listReplies(
  threadId: string,
  params?: {
    page?: number
    page_size?: number
    sort?: string
  }
) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set("page", params.page.toString())
  if (params?.page_size)
    searchParams.set("page_size", params.page_size.toString())
  if (params?.sort) searchParams.set("sort", params.sort)

  const res = await api.get<ReplyListResponse>(
    `/threads/${threadId}/replies${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`
  )
  return res.data
}
