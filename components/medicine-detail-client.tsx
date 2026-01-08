"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Star, Minus, Plus, Upload, Check, Truck, Shield, AlertCircle, ChevronLeft } from "lucide-react"
import Link from "next/link"

interface Medicine {
  id: string
  name: string
  brand: string
  manufacturer: string
  price: number
  mrp: number
  discount: number
  prescription: boolean
  rating: number
  reviews: number
  stock: boolean
  quantity: number
  images: string[]
  description: string
  uses: string[]
  sideEffects: string[]
  dosage: string
  storage: string
}

interface RelatedMedicine {
  id: number
  name: string
  brand: string
  price: number
  mrp: number
  image: string
}

export function MedicineDetailClient({
  medicine,
  relatedMedicines,
}: {
  medicine: Medicine
  relatedMedicines: RelatedMedicine[]
}) {
  const router = useRouter()
  const [quantity, setQuantity] = React.useState(1)
  const [selectedImage, setSelectedImage] = React.useState(0)

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => router.back()}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <img
              src={medicine.images[selectedImage] || "/placeholder.svg"}
              alt={medicine.name}
              className="h-full w-full object-cover"
            />
            {medicine.prescription && (
              <Badge className="absolute top-4 right-4" variant="destructive">
                Prescription Required
              </Badge>
            )}
            {medicine.discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-primary">{medicine.discount}% OFF</Badge>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4">
            {medicine.images.map((image, index) => (
              <button
                key={index}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${medicine.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">{medicine.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              By {medicine.brand} | {medicine.manufacturer}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="text-lg font-medium">{medicine.rating}</span>
            </div>
            <span className="text-muted-foreground">({medicine.reviews} reviews)</span>
          </div>

          <Separator />

          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">₹{medicine.price}</span>
              <span className="text-xl text-muted-foreground line-through">₹{medicine.mrp}</span>
              <Badge className="bg-primary">{medicine.discount}% OFF</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Inclusive of all taxes</p>
          </div>

          <Separator />

          {medicine.prescription && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This medicine requires a valid prescription. You can upload your prescription after adding to cart.
              </AlertDescription>
            </Alert>
          )}

          {/* Quantity Selector */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Quantity</Label>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(medicine.quantity, quantity + 1))}
                  disabled={quantity >= medicine.quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {medicine.stock ? `${medicine.quantity} available` : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1" size="lg" disabled={!medicine.stock}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            {medicine.prescription && (
              <Button variant="outline" size="lg">
                <Upload className="mr-2 h-5 w-5" />
                Upload Rx
              </Button>
            )}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium">100% Authentic</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium">Quality Assured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="uses">Uses</TabsTrigger>
            <TabsTrigger value="side-effects">Side Effects</TabsTrigger>
            <TabsTrigger value="dosage">Dosage & Storage</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">About {medicine.name}</h3>
                <p className="leading-relaxed text-muted-foreground">{medicine.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uses" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Uses & Benefits</h3>
                <ul className="space-y-2">
                  {medicine.uses.map((use, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{use}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="side-effects" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Possible Side Effects</h3>
                <ul className="space-y-2">
                  {medicine.sideEffects.map((effect, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      <span className="text-muted-foreground">{effect}</span>
                    </li>
                  ))}
                </ul>
                <Alert className="mt-4">
                  <AlertDescription>
                    If you experience any severe side effects, discontinue use and consult your doctor immediately.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dosage" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Dosage</h3>
                    <p className="leading-relaxed text-muted-foreground">{medicine.dosage}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Storage Instructions</h3>
                    <p className="leading-relaxed text-muted-foreground">{medicine.storage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Related Medicines</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedMedicines.map((related) => (
            <Card key={related.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-4">
                <Link href={`/medicines/${related.id}`}>
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
                    <img
                      src={related.image || "/placeholder.svg"}
                      alt={related.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <h3 className="font-semibold text-balance leading-tight hover:text-primary">{related.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{related.brand}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold">₹{related.price}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{related.mrp}</span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
