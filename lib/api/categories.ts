import { API_BASE_URL, handleApiError } from "../api-config"

export interface Category {
  _id: string
  name: string
  description: string
  slug: string
  image: {
    url: string
    key: string
  }
  parentCategory: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoryWithCount {
  id: string
  name: string
  description: string
  image: {
    url: string
    key: string
  }
  slug: string
  productCount: number
}

export interface CategoryProduct {
  id: string
  productName: string
  brandName: string
  genericName: string
  manufacturer: string
  images: string[]
  description: string
  pricing: {
    mrp: number
    sellingPrice: number
    discount: number
  }
  stock: {
    available: boolean
    quantity: number
  }
  packaging: {
    packSize: string
    expiryDate: string
    storageInstructions?: string
  }
  category: {
    _id: string
    name: string
    slug: string
    image: {
      url: string
    }
  }
  productCategory: string
  prescriptionRequired: boolean
  sortOrder: number
  productType: string
  createdAt: string
  updatedAt: string
}

export interface ProductDetail {
  _id: string
  category: {
    _id: string
    name: string
  }
  productDetails: {
    productName: string
    brandName: string
    genericName: string
    manufacturer: string
    description: string
    images: string[]
    pricing: {
      mrp: number
      sellingPrice: number
      discount: number
    }
    stock: {
      available: boolean
      quantity: number
    }
    packaging: {
      packSize: string
      expiryDate: string
      storageInstructions?: string
    }
    category: string
    prescriptionRequired: boolean
  }
  sortOrder: number
  isActive: boolean
}

export const categoriesApi = {
  getAll: async (): Promise<{ success: boolean; count: number; data: Category[] }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getById: async (id: string): Promise<{ success: boolean; data: Category }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getCategoriesWithCounts: async (): Promise<{
    success: boolean
    count: number
    data: CategoryWithCount[]
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/category-products/categories`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },
}

export const categoryProductsApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
    manufacturer?: string
    prescriptionRequired?: boolean
    inStock?: boolean
    minPrice?: number
    maxPrice?: number
    productCategory?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }): Promise<{
    success: boolean
    data: CategoryProduct[]
    pagination: {
      currentPage: number
      totalPages: number
      totalCount: number
      limit: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
    filters: any
    sort: any
  }> => {
    try {
      const queryString = new URLSearchParams(params as any).toString()
      const response = await fetch(
        `${API_BASE_URL}/category-products/category/category-products?${queryString}`
      )
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getByCategory: async (
    categoryId: string,
    params?: {
      page?: number
      limit?: number
      sortBy?: string
    }
  ): Promise<{
    success: boolean
    category: {
      id: string
      name: string
      description: string
    }
    pagination: {
      currentPage: number
      totalPages: number
      totalProducts: number
      hasNext: boolean
      hasPrev: boolean
    }
    count: number
    data: CategoryProduct[]
  }> => {
    try {
      const queryString = new URLSearchParams(params as any).toString()
      const response = await fetch(
        `${API_BASE_URL}/category-products/category/${categoryId}/products?${queryString}`
      )
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getProductById: async (
    categoryId: string,
    productId: string
  ): Promise<{ success: boolean; data: ProductDetail }> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/category-products/categories/${categoryId}/products/${productId}`
      )
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  search: async (
    name: string,
    categoryId?: string
  ): Promise<{ success: boolean; count: number; data: ProductDetail[] }> => {
    try {
      const queryParams = new URLSearchParams({ name })
      if (categoryId) {
        queryParams.append("categoryId", categoryId)
      }
      const response = await fetch(`${API_BASE_URL}/category-products/search?${queryParams}`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },
}
