"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, Wallet, DollarSign, Upload } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = React.useState("online")

  const savedAddresses = [
    {
      id: 1,
      type: "Home",
      name: "John Doe",
      address: "123 Main Street, Andheri West, Mumbai, Maharashtra 400058",
      phone: "+91 98765 43210",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      name: "John Doe",
      address: "456 Business Park, BKC, Mumbai, Maharashtra 400051",
      phone: "+91 98765 43210",
      isDefault: false,
    },
  ]

  const cartItems = [
    { name: "Paracetamol 500mg", quantity: 2, price: 90 },
    { name: "Azithromycin 500mg (Rx)", quantity: 1, price: 120 },
    { name: "CBC Lab Test", quantity: 1, price: 399 },
  ]

  const subtotal = 609
  const deliveryFee = 0
  const total = 609

  const handlePlaceOrder = () => {
    // Simulate order placement
    router.push("/orders/123")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-8 md:px-6">
          <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Delivery Address</h2>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-1 h-4 w-4" />
                      Add New
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {savedAddresses.map((address) => (
                      <div key={address.id} className="flex items-start gap-3 rounded-lg border p-4">
                        <input type="radio" name="address" defaultChecked={address.isDefault} className="mt-1" />
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <Badge variant="secondary">{address.type}</Badge>
                            {address.isDefault && <Badge>Default</Badge>}
                          </div>
                          <p className="font-medium">{address.name}</p>
                          <p className="text-sm text-muted-foreground">{address.address}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{address.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Prescription Upload */}
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Upload Prescription</h2>
                  <div className="rounded-lg border-2 border-dashed border-destructive/50 bg-background p-8 text-center">
                    <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="mb-2 font-medium">Upload your prescription</p>
                    <p className="mb-4 text-sm text-muted-foreground">Required for Azithromycin 500mg</p>
                    <Button variant="outline">Choose File</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Payment Method</h2>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex flex-1 cursor-pointer items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">Online Payment</div>
                          <div className="text-sm text-muted-foreground">UPI, Cards, Netbanking</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex flex-1 cursor-pointer items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                          <Wallet className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <div className="font-medium">Digital Wallet</div>
                          <div className="text-sm text-muted-foreground">PhonePe, Google Pay, Paytm</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex flex-1 cursor-pointer items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-3/10">
                          <DollarSign className="h-5 w-5 text-chart-3" />
                        </div>
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-muted-foreground">Pay when you receive</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

                    <div className="mb-4 space-y-2">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">₹{item.price}</span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Fee</span>
                        <span className="font-medium text-primary">FREE</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>

                    <Button className="mt-6 w-full" size="lg" onClick={handlePlaceOrder}>
                      Place Order
                    </Button>

                    <div className="mt-4 text-center text-xs text-muted-foreground">
                      Your payment information is secure
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
