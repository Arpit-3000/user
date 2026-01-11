import { API_BASE_URL, handleApiError } from "../api-config"

export interface LabTestParameter {
  name: string
  unit: string
  normalRange: string
  description?: string
}

export interface LabTest {
  _id: string
  testName: string
  testCode: string
  category: string
  description: string
  price: number
  discount: number
  discountedPrice: number
  isHomeCollectionAvailable: boolean
  homeCollectionPrice: number
  preparationInstructions: string
  reportDeliveryTime: string
  sampleType?: string
  sampleVolume?: string
  parameters: LabTestParameter[]
  isPopular: boolean
  isRecommended: boolean
  status: string
  metadata?: {
    createdBy: string
    lastUpdated: string
  }
  createdAt: string
  updatedAt: string
}

export interface LabTestsResponse {
  success: boolean
  count?: number
  pagination?: {
    next?: {
      page: number
      limit: number
    }
    prev?: {
      page: number
      limit: number
    }
  }
  data: LabTest[]
}

export interface LabTestDetailResponse {
  success: boolean
  data: LabTest
}

export interface AllTypesResponse {
  success: boolean
  message: string
  data: {
    tests: LabTest[]
    pagination: {
      currentPage: number
      totalPages: number
      totalTests: number
      hasNextPage: boolean
      hasPrevPage: boolean
      limit: number
      nextPage?: number
      prevPage?: number
    }
    statistics: {
      categories: Array<{
        _id: string
        count: number
        avgPrice: number
        minPrice: number
        maxPrice: number
      }>
      priceRange: {
        minPrice: number
        maxPrice: number
        avgPrice: number
        totalTests: number
      }
    }
    filters: {
      appliedFilters: {
        category: string | null
        isHomeCollection: boolean | null
        isPopular: boolean | null
        isRecommended: boolean | null
        status: string
        search: string | null
      }
      availableCategories: string[]
      availableStatuses: string[]
    }
  }
}

export const labTestsApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    sort?: string
    fields?: string
    category?: string
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

  getById: async (id: string): Promise<LabTestDetailResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lab-tests/${id}`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getAllTypes: async (params?: {
    page?: number
    limit?: number
    category?: string | string[]
    isHomeCollection?: boolean
    isPopular?: boolean
    isRecommended?: boolean
    status?: string
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<AllTypesResponse> => {
    try {
      const queryString = new URLSearchParams(params as any).toString()
      const response = await fetch(`${API_BASE_URL}/lab-tests/all-types?${queryString}`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  search: async (params: {
    q?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    isHomeCollection?: boolean
  }): Promise<LabTestsResponse> => {
    try {
      const queryString = new URLSearchParams(params as any).toString()
      const response = await fetch(`${API_BASE_URL}/lab-tests/search?${queryString}`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getCategories: async (): Promise<{ success: boolean; count: number; data: string[] }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lab-tests/categories`)
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
