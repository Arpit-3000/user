import { API_BASE_URL, handleApiError } from "../api-config"

export const bannersApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/banners`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getMedicineBanners: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/banners/medicines`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getLabTestBanners: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/banners/labtests`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getCategoryProductBanners: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/banners/category-products`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },
}
