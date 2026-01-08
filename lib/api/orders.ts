import { API_BASE_URL, getAuthHeaders, handleApiError } from "../api-config"

export const ordersApi = {
  getAll: async (params?: {
    status?: string
    page?: number
    limit?: number
    startDate?: string
    endDate?: string
  }) => {
    try {
      const queryString = new URLSearchParams(params as any).toString()
      const response = await fetch(`${API_BASE_URL}/orders?${queryString}`, {
        headers: getAuthHeaders(),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: getAuthHeaders(),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  checkPrescription: async (cartId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/check-prescription/${cartId}`, {
        headers: getAuthHeaders(),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  createPayment: async (data: { cartId: string; addressId: string; paymentMethod: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/orders/create-payment`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  verifyPayment: async (data: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
    cartId: string
    addressId: string
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/verify`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  cancel: async (id: string, reason?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/stats/overview`, {
        headers: getAuthHeaders(),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },
}
