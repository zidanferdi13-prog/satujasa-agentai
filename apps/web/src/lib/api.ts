import axios from "axios"
import { authStore } from "../stores/auth"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:4000"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = authStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.getState().logout?.()
    }
    return Promise.reject(error)
  }
)

export const ApiError = {
  getErrorMessage: (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.error || error.message || "Unknown error"
    }
    return "An unexpected error occurred"
  },
}
