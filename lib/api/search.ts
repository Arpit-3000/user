import { API_BASE_URL } from "../api-config"

export interface SearchResult {
  id: string
  type: "medicine" | "labTest" | "categoryProduct" | "category" | "doctor"
  name: string
  [key: string]: any
}

export interface SearchResponse {
  success: boolean
  query: string
  totalResults: number
  results: {
    medicines: {
      count: number
      data: any[]
    }
    labTests: {
      count: number
      data: any[]
    }
    categoryProducts: {
      count: number
      data: any[]
    }
    categories: {
      count: number
      data: any[]
    }
    doctors: {
      count: number
      data: any[]
    }
  }
}

export const searchApi = {
  // Unified search across all types
  search: async (query: string, options?: { limit?: number; types?: string }): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams({ q: query })
    
    if (options?.limit) {
      queryParams.append("limit", options.limit.toString())
    }
    
    if (options?.types) {
      queryParams.append("types", options.types)
    }

    const response = await fetch(`${API_BASE_URL}/search?${queryParams}`)
    
    if (!response.ok) {
      throw new Error("Search failed")
    }

    return response.json()
  },

  // Search specific types
  searchMedicines: async (query: string, limit?: number) => {
    return searchApi.search(query, { types: "medicine", limit })
  },

  searchLabTests: async (query: string, limit?: number) => {
    return searchApi.search(query, { types: "labtest", limit })
  },

  searchProducts: async (query: string, limit?: number) => {
    return searchApi.search(query, { types: "categoryproduct", limit })
  },

  searchDoctors: async (query: string, limit?: number) => {
    return searchApi.search(query, { types: "doctor", limit })
  },
}
