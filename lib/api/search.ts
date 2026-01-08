import { API_BASE_URL, handleApiError } from "../api-config"

export const searchApi = {
  search: async (query: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },
}
