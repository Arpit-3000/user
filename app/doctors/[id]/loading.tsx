import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container px-4 py-8 md:px-6">
          <Skeleton className="mb-4 h-8 w-20" />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-8 w-64" />
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32" />
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-7 w-48" />
                  <div className="mt-6 space-y-6">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
  )
}
