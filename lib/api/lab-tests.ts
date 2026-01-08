import { API_BASE_URL, handleApiError } from "../api-config"

export const labTestsApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    category?: string
    isPopular?: boolean
    isHomeCollectionAvailable?: boolean
  }) => {
    try {
      const queryString = new URLSearchParams(params as any).toString()
      const response = await fetch(`${API_BASE_URL}/lab-tests?${queryString}`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/lab-tests/${id}`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getByCategory: async (category: string, params?: { page?: number; limit?: number }) => {
    try {
      const queryString = new URLSearchParams({ category, ...params } as any).toString()
      const response = await fetch(`${API_BASE_URL}/lab-tests?${queryString}`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },
}
