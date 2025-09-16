import api from "@/lib/api"
import type {
  ModerationActionRequest,
  ModerationActionResponse,
  ModerationStatsResponse,
  ReportListResponse,
} from "@/types/api"

export async function getReports(params: {
  page?: number
  pageSize?: number
  status?: string
  priority?: string
}) {
  try {
    const { page = 1, pageSize = 20, status, priority } = params
    const res = await api.get<ReportListResponse>(`/moderation/reports`, {
      params: {
        page,
        pageSize,
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
      },
    })

    // Ensure we have a valid ReportListResponse structure
    if (
      res.data &&
      typeof res.data === "object" &&
      Array.isArray(res.data.reports)
    ) {
      return res.data
    } else {
      console.warn("getReports: Expected ReportListResponse but got:", res.data)
      return {
        reports: [],
        total: 0,
        page: 1,
        page_size: pageSize,
        total_pages: 0,
      }
    }
  } catch (error) {
    console.error("getReports error:", error)
    return {
      reports: [],
      total: 0,
      page: 1,
      page_size: params.pageSize || 20,
      total_pages: 0,
    }
  }
}

export async function processReport(
  reportId: string,
  body: ModerationActionRequest
) {
  const res = await api.post<ModerationActionResponse>(
    `/moderation/reports/${reportId}/actions`,
    body
  )
  return res.data
}

export async function getModerationStats(moderatorId?: string) {
  const res = await api.get<ModerationStatsResponse>(`/moderation/stats`, {
    params: moderatorId ? { moderator_id: moderatorId } : undefined,
  })
  return res.data
}

export async function getModerationActions(params?: {
  action?: string
  page?: number
  pageSize?: number
}) {
  const { page = 1, pageSize = 20, action } = params || {}
  const res = await api.get(`/moderation/actions`, {
    params: {
      page,
      pageSize,
      ...(action ? { action } : {}),
    },
  })
  return res.data
}
