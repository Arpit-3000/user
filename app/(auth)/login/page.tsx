"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Phone, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authApi } from "@/lib/api/auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const [emailLogin, setEmailLogin] = React.useState({ email: "", password: "" })
  const [phoneLogin, setPhoneLogin] = React.useState({ phone: "" })
  const [otpSent, setOtpSent] = React.useState(false)
  const [otp, setOtp] = React.useState("")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await authApi.login({
        email: emailLogin.email,
        password: emailLogin.password,
      })

      if (result.success && result.token) {
        toast({
          title: "Login successful",
          description: "Welcome back to ArogyaRx!",
        })
        router.push("/")
      } else {
        setError(result.message || "Invalid credentials")
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otpSent) {
      setLoading(true)
      // Simulate sending OTP
      setTimeout(() => {
        setOtpSent(true)
        setLoading(false)
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code.",
        })
      }, 1000)
    } else {
      setLoading(true)
      // Simulate verifying OTP
      setTimeout(() => {
        setLoading(false)
        router.push("/")
      }, 1500)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
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

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <Link href="/" className="inline-flex items-center justify-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="ArogyaRx Logo" 
              className="h-16 w-auto transition-transform group-hover:scale-110 duration-300"
            />
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-balance animate-in fade-in slide-in-from-top-4 duration-700" style={{ animationDelay: '100ms' }}>
            Welcome to ArogyaRx
          </h1>
          <p className="mt-2 text-sm text-muted-foreground text-balance animate-in fade-in slide-in-from-top-4 duration-700" style={{ animationDelay: '200ms' }}>
            Sign in to access your healthcare dashboard
          </p>
        </div>

        <Card className="shadow-2xl border animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '300ms' }}>
          <CardHeader className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Choose your preferred login method</CardDescription>
          </CardHeader>
          <CardContent className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '500ms' }}>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  {error && (
                    <div className="text-center py-2 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        value={emailLogin.email}
                        onChange={(e) => setEmailLogin({ ...emailLogin, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        value={emailLogin.password}
                        onChange={(e) => setEmailLogin({ ...emailLogin, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handlePhoneLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <div className="absolute left-9 top-2.5 text-sm text-muted-foreground">+91</div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="98765 43210"
                        className="pl-[4.5rem]"
                        value={phoneLogin.phone}
                        onChange={(e) => setPhoneLogin({ ...phoneLogin, phone: e.target.value })}
                        disabled={otpSent}
                        required
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        OTP sent to {phoneLogin.phone}.{" "}
                        <button type="button" className="text-primary hover:underline">
                          Resend OTP
                        </button>
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : otpSent ? (
                      "Verify OTP"
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="text-sm text-muted-foreground text-center">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
