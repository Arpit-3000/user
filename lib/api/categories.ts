import { API_BASE_URL, handleApiError } from "../api-config"

export const categoriesApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getProducts: async (params?: { page?: number; limit?: number; category?: string; search?: string }) => {
    try {
      const queryString = new URLSearchParams(params as any).toString()
      const response = await fetch(`${API_BASE_URL}/category-products/category/category-products?${queryString}`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },
}
