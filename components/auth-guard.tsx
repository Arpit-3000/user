"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-utils"
import { useToast } from "@/hooks/use-toast"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      const isAuthPage = pathname === "/login" || pathname === "/register"

      if (!authenticated && !isAuthPage) {
        // Not authenticated and trying to access protected page
        toast({
          title: "Login Required",
          description: "Please login to access this page. Redirecting to login...",
          variant: "destructive",
        })
        
        // Redirect after 5 seconds
        setTimeout(() => {
          router.push("/login")
        }, 5000)
      } else if (authenticated && isAuthPage) {
        // Authenticated but on auth page, redirect to home
        router.push("/")
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [pathname, router, toast])

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
