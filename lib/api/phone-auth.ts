import { API_BASE_URL, handleApiError } from "../api-config"

export interface PhoneAuthUser {
  _id: string
  name: string
  email?: string
  role: "patient" | "doctor"
  phoneNumber: string
  isPhoneVerified: boolean
  authMethod: "phone" | "email"
  age?: number
  gender?: "male" | "female" | "other"
  contact: string
  address?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  specialization?: string
  profileImage?: string | null
  createdAt: string
}

export interface PhoneAuthResponse {
  message: string
  token: string
  success: boolean
  user: PhoneAuthUser
}

export interface PhoneLoginResponse {
  message: string
  token?: string
  success?: boolean
  user?: PhoneAuthUser
  needsRegistration?: boolean
}

export interface RegisterUserData {
  idToken: string
  name: string
  role: "patient" | "doctor"
  email?: string
  age?: number
  gender?: "male" | "female" | "other"
  specialization?: string
  address?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
}

export const phoneAuthApi = {
  // Verify Firebase token and login if user exists
  verifyAndLogin: async (idToken: string): Promise<PhoneLoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/phone-auth/verify-and-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      })

      const data = await response.json()

      if (response.status === 404) {
        return {
          message: data.message,
          needsRegistration: true,
        }
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      return data
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Register new user with phone number
  register: async (userData: RegisterUserData): Promise<PhoneAuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/phone-auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      return data
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get user by phone number
  getUserByPhone: async (phoneNumber: string): Promise<PhoneAuthUser> => {
    try {
      const response = await fetch(`${API_BASE_URL}/phone-auth/user/${encodeURIComponent(phoneNumber)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "User not found")
      }

      return data
    } catch (error) {
      return handleApiError(error)
    }
  },
}
