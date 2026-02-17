import { useState } from "react"
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  PhoneAuthProvider,
} from "firebase/auth"
import { auth, isFirebaseConfigured } from "@/lib/firebase-config"
import { phoneAuthApi, type RegisterUserData } from "@/lib/api/phone-auth"

export const usePhoneAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)

  // Cleanup function
  const cleanup = () => {
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear()
        setRecaptchaVerifier(null)
        // Clear the container
        const element = document.getElementById("recaptcha-container")
        if (element) {
          element.innerHTML = ''
        }
      } catch (e) {
        console.log("Error during cleanup:", e)
      }
    }
  }

  // Reset function for changing phone number
  const reset = () => {
    cleanup()
    setConfirmationResult(null)
    setError(null)
    setLoading(false)
  }

  // Setup reCAPTCHA
  const setupRecaptcha = (elementId: string) => {
    try {
      if (!isFirebaseConfigured || !auth) {
        throw new Error("Firebase is not configured. Please add Firebase credentials to .env.local")
      }

      // Check if element exists in DOM
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error(`Element with id '${elementId}' not found in DOM`)
      }

      // Clear any existing reCAPTCHA and its DOM content
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear()
          setRecaptchaVerifier(null)
        } catch (e) {
          console.log("Error clearing previous reCAPTCHA:", e)
        }
      }

      // Clear the container's innerHTML to remove any leftover reCAPTCHA elements
      element.innerHTML = ''

      // Firebase v9+ modular syntax
      const verifier = new RecaptchaVerifier(auth, elementId, {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved")
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired")
          setError("reCAPTCHA expired. Please try again.")
        },
      })

      setRecaptchaVerifier(verifier)
      return verifier
    } catch (err: any) {
      console.error("Setup reCAPTCHA error:", err)
      setError(err.message)
      return null
    }
  }

  // Send OTP to phone number
  const sendOTP = async (phoneNumber: string) => {
    setLoading(true)
    setError(null)

    try {
      if (!isFirebaseConfigured || !auth) {
        throw new Error("Firebase is not configured. Please add Firebase credentials to .env.local")
      }

      console.log("Starting OTP send process for:", phoneNumber)

      // Wait a bit for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100))

      // Check if element exists
      const element = document.getElementById("recaptcha-container")
      if (!element) {
        throw new Error("reCAPTCHA container not found in DOM")
      }

      console.log("Setting up reCAPTCHA...")
      
      // Reuse existing verifier if available, otherwise create new one
      let verifier = recaptchaVerifier
      if (!verifier) {
        verifier = setupRecaptcha("recaptcha-container")
        if (!verifier) {
          throw new Error("Failed to setup reCAPTCHA")
        }
      }

      console.log("reCAPTCHA setup complete, sending OTP...")

      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier)
      setConfirmationResult(result)
      setLoading(false)
      
      console.log("OTP sent successfully")
      return { success: true }
    } catch (err: any) {
      console.error("Error sending OTP:", err)
      
      // Clear the verifier on error so it can be recreated
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear()
          setRecaptchaVerifier(null)
          // Clear the container
          const element = document.getElementById("recaptcha-container")
          if (element) {
            element.innerHTML = ''
          }
        } catch (e) {
          console.log("Error clearing reCAPTCHA:", e)
        }
      }
      
      let errorMessage = err.message || "Failed to send OTP"
      
      // Provide helpful error messages
      if (err.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format"
      } else if (err.code === "auth/missing-phone-number") {
        errorMessage = "Phone number is required"
      } else if (err.code === "auth/quota-exceeded") {
        errorMessage = "SMS quota exceeded. Please try again later"
      } else if (err.code === "auth/captcha-check-failed") {
        errorMessage = "reCAPTCHA verification failed. Please try again"
      }
      
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  // Verify OTP code
  const verifyOTP = async (code: string) => {
    setLoading(true)
    setError(null)

    try {
      if (!confirmationResult) {
        throw new Error("No confirmation result. Please request OTP first.")
      }

      const result = await confirmationResult.confirm(code)
      const idToken = await result.user.getIdToken()

      setLoading(false)
      return { success: true, idToken }
    } catch (err: any) {
      console.error("Error verifying OTP:", err)
      setError(err.message || "Invalid OTP")
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  // Login with Firebase token
  const loginWithPhone = async (idToken: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await phoneAuthApi.verifyAndLogin(idToken)

      if (response.needsRegistration) {
        setLoading(false)
        return { success: false, needsRegistration: true }
      }

      if (response.success && response.token && response.user) {
        // Save token and user data
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))

        setLoading(false)
        return { success: true, user: response.user, token: response.token }
      }

      throw new Error(response.message || "Login failed")
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Login failed")
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  // Register new user
  const registerUser = async (userData: RegisterUserData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await phoneAuthApi.register(userData)

      if (response.success && response.token && response.user) {
        // Save token and user data
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))

        setLoading(false)
        return { success: true, user: response.user, token: response.token }
      }

      throw new Error(response.message || "Registration failed")
    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "Registration failed")
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  // Complete phone auth flow (send OTP, verify, login/register)
  const completePhoneAuth = async (
    phoneNumber: string,
    otp: string,
    registrationData?: Omit<RegisterUserData, "idToken">
  ) => {
    try {
      // 1. Verify OTP and get idToken
      const verifyResult = await verifyOTP(otp)
      if (!verifyResult.success || !verifyResult.idToken) {
        return { success: false, error: verifyResult.error }
      }

      // 2. Try to login
      const loginResult = await loginWithPhone(verifyResult.idToken)

      // 3. If user needs registration and data provided, register
      if (loginResult.needsRegistration && registrationData) {
        return await registerUser({
          idToken: verifyResult.idToken,
          ...registrationData,
        })
      }

      return loginResult
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  return {
    loading,
    error,
    setupRecaptcha,
    sendOTP,
    verifyOTP,
    loginWithPhone,
    registerUser,
    completePhoneAuth,
    cleanup,
    reset,
  }
}
