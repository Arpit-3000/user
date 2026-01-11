import { API_BASE_URL, getAuthHeaders, handleApiError } from "../api-config"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Doctor {
  _id: string
  name: string
  email: string
  specialization: string
  qualification: string
  experience: string
  contact: string
  fee: number
  consultationType: "online" | "offline" | "both"
  bio: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
  }
  profileImage?: string
  source: string
}

export interface DoctorAvailability {
  _id: string
  doctorId: string
  dayOfWeek: string // "Monday", "Tuesday", etc.
  timeSlots: Array<{
    startTime: string
    endTime: string
    duration: number
    isAvailable: boolean
    _id: string
  }>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  _id: string
  patientId: string
  doctorId: Doctor | string
  date: string
  time: string
  duration: number
  consultationType: "online" | "offline" | "virtual"
  status: "pending" | "accepted" | "completed" | "cancelled" | "missed"
  reason?: string
  fee: number
  paymentStatus: "pending" | "paid" | "refunded"
  notes?: string
  prescription?: string
  virtualMeeting?: {
    meetLink: string
    isHost: boolean
    googleEventId?: string
  }
  doctor?: Doctor
  patient?: any
  createdAt: string
  updatedAt: string
}

export interface BookAppointmentRequest {
  doctorId: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  reason?: string
  consultationType?: "online" | "offline" | "virtual"
}

export interface PaymentOrderResponse {
  orderId: string
  amount: number
  currency: string
  appointmentId: string
  key: string
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get all doctors with filtering and pagination
 */
export async function getDoctors(params?: {
  specialization?: string | string[]
  consultationType?: string
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  try {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v))
          } else {
            queryParams.append(key, String(value))
          }
        }
      })
    }

    const url = `${API_BASE_URL}/appointments/doctors${queryParams.toString() ? `?${queryParams}` : ""}`
    const response = await fetch(url)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Get doctor availability schedule
 */
export async function getDoctorAvailability(doctorId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/doctors/${doctorId}/availability`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Book a new appointment
 */
export async function bookAppointment(data: BookAppointmentRequest) {
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
}

/**
 * Get user's appointments with optional status filter
 */
export async function getMyAppointments(status?: string) {
  try {
    const url = status
      ? `${API_BASE_URL}/appointments/patient?status=${status}`
      : `${API_BASE_URL}/appointments/patient`
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    })
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Get appointment details by ID
 */
export async function getAppointmentById(appointmentId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      headers: getAuthHeaders(),
    })
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(appointmentId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
      method: "PUT",
      headers: getAuthHeaders(),
    })
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * Create payment order for appointment
 */
export async function createAppointmentPayment(appointmentId: string): Promise<PaymentOrderResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/create-payment`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ appointmentId }),
    })
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create payment order")
    }
    
    return data.data
  } catch (error) {
    return handleApiError(error)
  }
}
