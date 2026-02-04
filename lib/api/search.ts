import { API_BASE_URL } from "../api-config"

export interface SearchResult {
  id: string
  type: "medicine" | "labTest" | "categoryProduct" | "category" | "doctor"
  name: string
  [key: string]: any
}

export interface CategoryResults {
  count: number
  total: number
  hasMore: boolean
  data: any[]
}

export interface SearchResponse {
  success: boolean
  query: string
  letter?: string
  page: number
  limit: number
  totalResults: number
  results: {
    medicines: CategoryResults
    labTests: CategoryResults
    categoryProducts: CategoryResults
    categories: CategoryResults
    doctors: CategoryResults
  }
}

export const searchApi = {
  // Unified search across all types with pagination
  search: async (
    query: string, 
    options?: { 
      limit?: number
      page?: number
      types?: string
      letter?: string
    }
  ): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams({ q: query })
    
    if (options?.limit) {
      queryParams.append("limit", options.limit.toString())
    }
    
    if (options?.page) {
      queryParams.append("page", options.page.toString())
    }
    
    if (options?.types) {
      queryParams.append("types", options.types)
    }

    if (options?.letter && options.letter !== 'all') {
      queryParams.append("letter", options.letter)
    }

    const response = await fetch(`${API_BASE_URL}/search?${queryParams}`)
    
    if (!response.ok) {
      throw new Error("Search failed")
    }

    return response.json()
  },

  // Search specific types with pagination
  searchMedicines: async (query: string, options?: { limit?: number; page?: number; letter?: string }) => {
    return searchApi.search(query, { types: "medicine", ...options })
  },

  searchLabTests: async (query: string, options?: { limit?: number; page?: number }) => {
    return searchApi.search(query, { types: "labtest", ...options })
  },

  searchProducts: async (query: string, options?: { limit?: number; page?: number }) => {
    return searchApi.search(query, { types: "categoryproduct", ...options })
  },

  searchDoctors: async (query: string, options?: { limit?: number; page?: number }) => {
    return searchApi.search(query, { types: "doctor", ...options })
  },
}
