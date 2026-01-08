"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Download, Package, Check } from "lucide-react"
import { format } from "date-fns"

interface OrderDetailProps {
  order: {
    id: string
    date: Date
    status: string
    deliveryDate: Date
    trackingId: string
    items: Array<{
      name: string
      brand: string
      quantity: number
      price: number
      image: string | null
    }>
    address: {
      name: string
      address: string
      phone: string
    }
    payment: {
      method: string
      subtotal: number
      deliveryFee: number
      total: number
    }
    timeline: Array<{
      status: string
      date: Date
      completed: boolean
    }>
  }
}

export function OrderDetailClient({ order }: OrderDetailProps) {
  const router = useRouter()

  return (
    <div className="container px-4 py-8 md:px-6">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => router.back()}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <p className="mt-1 text-muted-foreground">Placed on {format(order.date, "PPP")}</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Invoice
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-6 text-lg font-semibold">Order Status</h2>
              <div className="relative">
                {order.timeline.map((step, index) => (
                  <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.completed ? <Check className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div
                          className={`h-full w-0.5 ${step.completed ? "bg-primary" : "bg-muted"}`}
                          style={{ minHeight: "2rem" }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <h3 className="font-semibold">{step.status}</h3>
                      <p className="text-sm text-muted-foreground">{format(step.date, "PPP 'at' p")}</p>
                    </div>
                  </div>
                ))}
              </div>
              {order.trackingId && (
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <div className="text-sm text-muted-foreground">Tracking ID</div>
                  <div className="font-mono font-semibold">{order.trackingId}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image ? (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          Lab Test
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 justify-between">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                        <p className="mt-1 text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{item.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Delivery Address</h2>
              <div className="space-y-2">
                <p className="font-medium">{order.address.name}</p>
                <p className="text-sm text-muted-foreground">{order.address.address}</p>
                <p className="text-sm text-muted-foreground">{order.address.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Payment Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{order.payment.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  {order.payment.deliveryFee === 0 ? (
                    <span className="text-primary">FREE</span>
                  ) : (
                    <span>₹{order.payment.deliveryFee}</span>
                  )}
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{order.payment.total}</span>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">Paid via {order.payment.method}</div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full bg-transparent">
              Cancel Order
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Need Help?
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
