import { API_BASE_URL, getAuthHeaders, handleApiError } from "../api-config"

export const appointmentsApi = {
  getDoctors: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/doctors`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getDoctorAvailability: async (doctorId: string, date?: string) => {
    try {
      const queryString = date ? `?date=${date}` : ""
      const response = await fetch(`${API_BASE_URL}/appointments/doctors/${doctorId}/availability${queryString}`)
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  createPayment: async (data: {
    doctorId: string
    appointmentDate: string
    appointmentTime: string
    consultationType: string
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/appointments/create-payment`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  book: async (data: {
    doctorId: string
    appointmentDate: string
    appointmentTime: string
    consultationType: string
    symptoms: string
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getMyAppointments: async (params?: { status?: string; page?: number; limit?: number }) => {
    try {
      const queryString = new URLSearchParams(params as any).toString()
      const response = await fetch(`${API_BASE_URL}/appointments/patient?${queryString}`, {
        headers: getAuthHeaders(),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        headers: getAuthHeaders(),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },

  cancel: async (id: string, reason: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      })
      return await response.json()
    } catch (error) {
      return handleApiError(error)
    }
  },
}
