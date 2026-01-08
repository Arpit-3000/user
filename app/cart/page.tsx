"use client"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, Upload, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const cartItems = [
    {
      id: 1,
      type: "medicine",
      name: "Paracetamol 500mg",
      brand: "Crocin",
      price: 45,
      mrp: 60,
      quantity: 2,
      prescription: false,
      image: "/medicine-tablets.jpg",
    },
    {
      id: 2,
      type: "medicine",
      name: "Azithromycin 500mg",
      brand: "Azithral",
      price: 120,
      mrp: 150,
      quantity: 1,
      prescription: true,
      prescriptionUploaded: false,
      image: "/medicine-capsules.jpg",
    },
    {
      id: 3,
      type: "lab-test",
      name: "Complete Blood Count (CBC)",
      description: "24 hours report time",
      price: 399,
      mrp: 600,
      quantity: 1,
      image: null,
    },
  ]

  const hasPrescriptionRequired = cartItems.some((item) => item.type === "medicine" && item.prescription)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = cartItems.reduce((sum, item) => sum + (item.mrp - item.price) * item.quantity, 0)
  const deliveryFee = subtotal > 500 ? 0 : 40
  const total = subtotal + deliveryFee

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
                <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
                <p className="mb-6 text-muted-foreground">Add items to your cart to checkout</p>
                <Button asChild>
                  <Link href="/medicines">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                {hasPrescriptionRequired && (
                  <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Upload className="mt-0.5 h-5 w-5 text-destructive" />
                        <div>
                          <h3 className="font-semibold">Prescription Required</h3>
                          <p className="text-sm text-muted-foreground">
                            Some items in your cart require a valid prescription. Please upload after checkout.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {item.image ? (
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              {item.type === "lab-test" ? "Lab Test" : "Item"}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                {item.brand && <p className="text-sm text-muted-foreground">{item.brand}</p>}
                                {item.description && (
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                )}
                              </div>
                              <Button variant="ghost" size="icon" className="shrink-0">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>

                            {item.prescription && (
                              <div className="mt-2">
                                {item.prescriptionUploaded ? (
                                  <Badge variant="secondary">Prescription Uploaded</Badge>
                                ) : (
                                  <Badge variant="destructive">Prescription Required</Badge>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold">₹{item.price}</span>
                              <span className="text-sm text-muted-foreground line-through">₹{item.mrp}</span>
                            </div>

                            {item.type === "medicine" && (
                              <div className="flex items-center rounded-lg border">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-2">
                      <Input placeholder="Enter coupon code" />
                      <Button variant="outline">Apply</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                          <span className="font-medium">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-primary">
                          <span>Discount</span>
                          <span className="font-medium">-₹{discount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Delivery Fee</span>
                          {deliveryFee === 0 ? (
                            <span className="font-medium text-primary">FREE</span>
                          ) : (
                            <span className="font-medium">₹{deliveryFee}</span>
                          )}
                        </div>
                      </div>

                      {deliveryFee > 0 && (
                        <div className="mt-3 rounded-lg bg-muted p-3 text-sm">
                          <span className="text-muted-foreground">Add ₹{500 - subtotal} more to get FREE delivery</span>
                        </div>
                      )}

                      <Separator className="my-4" />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{total}</span>
                      </div>

                      <Button className="mt-6 w-full" size="lg" asChild>
                        <Link href="/checkout">Proceed to Checkout</Link>
                      </Button>

                      <div className="mt-4 text-center text-xs text-muted-foreground">
                        By proceeding, you agree to our Terms & Conditions
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
