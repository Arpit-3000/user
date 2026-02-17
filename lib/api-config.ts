export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const handleApiError = (error: any) => {
  console.error("[API Error]:", error)
  
  // Check if it's an authentication error
  if (error?.status === 401 || error?.response?.status === 401) {
    // Clear auth data
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      
      // Dispatch custom event for toast notification
      const event = new CustomEvent("auth-error", {
        detail: { message: "You are not logged in! Please login to continue." }
      })
      window.dispatchEvent(event)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
    }
  }
  
  throw error
}

