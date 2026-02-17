"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, Phone, Pill, Calendar, MapPin, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authApi } from "@/lib/api/auth"
import { useToast } from "@/hooks/use-toast"
import { usePhoneAuth } from "@/hooks/use-phone-auth"
import { Select } from "@/components/ui/select"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [acceptTerms, setAcceptTerms] = React.useState(false)
  const [registrationMethod, setRegistrationMethod] = React.useState<"email" | "phone">("email")

  // Phone auth states
  const [otpSent, setOtpSent] = React.useState(false)
  const [otp, setOtp] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [firebaseIdToken, setFirebaseIdToken] = React.useState("")

  const { 
    loading: phoneLoading, 
    error: phoneError, 
    sendOTP, 
    verifyOTP, 
    registerUser: registerPhoneUser,
    reset 
  } = usePhoneAuth()

  React.useEffect(() => {
    if (phoneError) {
      setError(phoneError)
    }
  }, [phoneError])

  // Check for pre-verified phone from login redirect
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const isVerified = urlParams.get("verified") === "true"
    
    if (isVerified) {
      const savedPhone = sessionStorage.getItem("signupPhone")
      const savedIdToken = sessionStorage.getItem("signupIdToken")
      
      if (savedPhone && savedIdToken) {
        setRegistrationMethod("phone")
        setPhoneNumber(savedPhone)
        setFirebaseIdToken(savedIdToken)
        setOtpSent(true)
        
        toast({
          title: "Phone Verified",
          description: "Please complete your registration details",
        })
        
        // Clear session storage
        sessionStorage.removeItem("signupPhone")
        sessionStorage.removeItem("signupIdToken")
      }
    }
  }, [])

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    contact: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (registrationMethod === "email") {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions")
      return
    }

    setLoading(true)

    try {
      if (registrationMethod === "email") {
        const result = await authApi.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "patient",
          age: formData.age ? parseInt(formData.age) : undefined,
          gender: formData.gender || undefined,
          contact: formData.contact || undefined,
          address: formData.street
            ? {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
              }
            : undefined,
        })

        if (result.success && result.token) {
          toast({
            title: "Registration successful",
            description: "Welcome to ArogyaRx!",
          })
          router.push("/")
        } else {
          setError(result.message || "Registration failed")
        }
      } else {
        // Phone registration - verify OTP first if not done
        if (!otpSent) {
          setError("Please verify your phone number first")
          setLoading(false)
          return
        }

        if (!firebaseIdToken) {
          setError("Please verify OTP first")
          setLoading(false)
          return
        }

        const result = await registerPhoneUser({
          idToken: firebaseIdToken,
          name: formData.name,
          role: "patient",
          email: formData.email || undefined,
          age: formData.age ? parseInt(formData.age) : undefined,
          gender: formData.gender as "male" | "female" | "other" | undefined,
          address: formData.street
            ? {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
              }
            : undefined,
        })

        if (result.success) {
          toast({
            title: "Registration successful",
            description: "Welcome to ArogyaRx!",
          })
          router.push("/")
        } else {
          setError(result.error || "Registration failed")
        }
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      return
    }

    setError("")
    setLoading(true)
    const fullPhoneNumber = `+91${phoneNumber}`
    const result = await sendOTP(fullPhoneNumber)
    setLoading(false)

    if (result.success) {
      setOtpSent(true)
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      })
    } else {
      setError(result.error || "Failed to send OTP")
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setError("")
    setLoading(true)
    const result = await verifyOTP(otp)
    setLoading(false)

    if (result.success && result.idToken) {
      setFirebaseIdToken(result.idToken)
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully.",
      })
    } else {
      setError(result.error || "Invalid OTP")
    }
  }

  const handleResendOTP = async () => {
    setError("")
    
    // Clear existing reCAPTCHA before resending
    reset()
    
    // Wait a bit for cleanup
    await new Promise(resolve => setTimeout(resolve, 200))
    
    setLoading(true)
    const fullPhoneNumber = `+91${phoneNumber}`
    const result = await sendOTP(fullPhoneNumber)
    setLoading(false)

    if (result.success) {
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your phone.",
      })
    } else {
      setError(result.error || "Failed to resend OTP")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 z-20"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      {/* Animated background elements - Medical themed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating medical icons/shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 opacity-10">
          <Pill className="w-full h-full text-primary animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }} />
        </div>
        <div className="absolute top-40 right-20 w-16 h-16 opacity-10">
          <Pill className="w-full h-full text-primary animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 opacity-10">
          <Pill className="w-full h-full text-primary animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-20 right-1/3 w-14 h-14 opacity-10">
          <Pill className="w-full h-full text-primary animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
      </div>

      <div 
        className="w-full max-w-2xl relative z-10"
        style={{
          animation: 'slideUp 0.6s ease-out',
        }}
      >
        <style jsx>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(100px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="ArogyaRx Logo" 
              className="h-16 w-auto transition-transform group-hover:scale-110 duration-300"
            />
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-balance">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground text-balance">
            Join ArogyaRx for better healthcare
          </p>
        </div>

        <Card className="shadow-2xl border">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Enter your details to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue={registrationMethod} 
              value={registrationMethod}
              className="w-full" 
              onValueChange={(value) => {
                setRegistrationMethod(value as "email" | "phone")
                setError("")
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          className="pl-9"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-9"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contact">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="contact"
                          type="tel"
                          placeholder="9876543210"
                          className="pl-9"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="age"
                          type="number"
                          placeholder="30"
                          className="pl-9"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      className="w-full rounded-md border px-3 py-2"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-9"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          className="pl-9"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="mb-3 text-sm font-medium">Address (Optional)</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="street"
                            type="text"
                            placeholder="123 Main Street"
                            className="pl-9"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            type="text"
                            placeholder="Mumbai"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            type="text"
                            placeholder="Maharashtra"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            type="text"
                            placeholder="400001"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            type="text"
                            placeholder="India"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Hidden reCAPTCHA container - must be visible in DOM */}
                  <div id="recaptcha-container" className="flex justify-center"></div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Phone Verification Section */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="text-sm font-medium">Phone Verification</h3>
                    
                    {firebaseIdToken ? (
                      // Already verified from login
                      <div className="space-y-2">
                        <Label htmlFor="phone-register">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <div className="absolute left-9 top-2.5 text-sm text-muted-foreground">+91</div>
                          <Input
                            id="phone-register"
                            type="tel"
                            className="pl-[4.5rem]"
                            value={phoneNumber}
                            disabled
                            required
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Phone verified successfully
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="phone-register">Phone Number *</Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <div className="absolute left-9 top-2.5 text-sm text-muted-foreground">+91</div>
                              <Input
                                id="phone-register"
                                type="tel"
                                placeholder="98765 43210"
                                className="pl-[4.5rem]"
                                value={phoneNumber}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, "")
                                  setPhoneNumber(value)
                                }}
                                disabled={otpSent}
                                required
                                maxLength={10}
                              />
                            </div>
                            {!otpSent && (
                              <Button 
                                type="button" 
                                onClick={handleSendOTP}
                                disabled={loading || phoneLoading || phoneNumber.length !== 10}
                              >
                                Send OTP
                              </Button>
                            )}
                          </div>
                        </div>

                        {otpSent && (
                          <div className="space-y-2">
                            <Label htmlFor="otp-register">Enter OTP</Label>
                            <div className="flex gap-2">
                              <Input
                                id="otp-register"
                                type="text"
                                placeholder="123456"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, "")
                                  setOtp(value)
                                }}
                                required
                              />
                              <Button 
                                type="button" 
                                onClick={handleVerifyOTP}
                                disabled={loading || phoneLoading || otp.length !== 6}
                              >
                                Verify
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              OTP sent to +91{phoneNumber}.{" "}
                              <button 
                                type="button" 
                                className="text-primary hover:underline"
                                onClick={handleResendOTP}
                                disabled={loading || phoneLoading}
                              >
                                Resend OTP
                              </button>
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* User Details Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-phone">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name-phone"
                          type="text"
                          placeholder="John Doe"
                          className="pl-9"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-phone">Email (Optional)</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email-phone"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-9"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="age-phone">Age</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="age-phone"
                            type="number"
                            placeholder="30"
                            className="pl-9"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender-phone">Gender</Label>
                        <select
                          id="gender-phone"
                          className="w-full rounded-md border px-3 py-2"
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms-phone"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms-phone" className="text-sm font-normal leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || phoneLoading || !firebaseIdToken}
                  >
                    {loading || phoneLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
