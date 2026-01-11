"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileImageDebugProps {
  imageUrl?: string | null
  name?: string
}

export function ProfileImageDebug({ imageUrl, name = "User" }: ProfileImageDebugProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">Image Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <strong>Image URL:</strong>{" "}
          <span className="break-all">{imageUrl || "No image URL"}</span>
        </div>
        <div>
          <strong>Image Status:</strong>{" "}
          {imageError ? (
            <span className="text-red-600">Failed to load</span>
          ) : imageLoaded ? (
            <span className="text-green-600">Loaded successfully</span>
          ) : (
            <span className="text-yellow-600">Loading...</span>
          )}
        </div>
        <div>
          <strong>Fallback Initials:</strong> {getInitials(name)}
        </div>
        <div className="pt-2">
          <strong>Preview:</strong>
          <div className="mt-2 flex justify-center">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={imageUrl || "/placeholder-user.jpg"}
                alt={name}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
