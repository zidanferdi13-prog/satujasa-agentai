/**
 * Frontend-specific types
 * Extends @stnk/contracts types with local UI state
 */

export interface UIState {
  isLoading: boolean
  error: string | null
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface ListResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}
