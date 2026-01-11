import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container px-4 py-8 md:px-6">
          <Skeleton className="mb-4 h-8 w-32" />
          <Skeleton className="mb-6 h-10 w-64" />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="mb-4 h-6 w-48" />
                  <div className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32" />
                  <div className="mt-4 space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
  )
}
