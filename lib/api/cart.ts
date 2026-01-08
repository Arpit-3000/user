import { API_BASE_URL, getAuthHeaders, handleApiError } from "../api-config"

export interface AddMedicineToCartData {
  medicineId: string
  quantity: number
}

export interface AddLabTestToCartData {
  labTestId: string
  quantity: number
  isHomeCollection?: boolean
  preferredDate?: string
  preferredSlot?: {
    start: string
    end: string
  }
  labTestPatientDetails?: {
    name: string
    phone: string
    gender: string
    age: number
    disease?: string
  }
}

export interface AddCategoryProductToCartData {
  categoryProductId: string
  quantity: number
}

export const cartApi = {
  get: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: getAuthHeaders(),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  addMedicine: async (data: AddMedicineToCartData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  addLabTest: async (data: AddLabTestToCartData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  addCategoryProduct: async (data: AddCategoryProductToCartData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  updateQuantity: async (data: {
    medicineId?: string
    labTestId?: string
    categoryProductId?: string
    quantity: number
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/update-quantity`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  removeItem: async (data: { medicineId?: string; labTestId?: string; categoryProductId?: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  clear: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },
}
