"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Heart,
  Share2,
  Package,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  Plus,
  Minus,
  Calendar,
  Info,
  FileText,
  Box,
} from "lucide-react"
import { categoryProductsApi, type ProductDetail } from "@/lib/api/categories"
import { addToCart } from "@/lib/api/cart"
import { useToast } from "@/hooks/use-toast"
import { isAuthenticated } from "@/lib/auth-utils"
import { format } from "date-fns"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = React.useState<ProductDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [quantity, setQuantity] = React.useState(1)
  const [addingToCart, setAddingToCart] = React.useState(false)
  const [selectedImage, setSelectedImage] = React.useState(0)

  React.useEffect(() => {
    if (params.categoryId && params.productId) {
      loadProduct(params.categoryId as string, params.productId as string)
    }
  }, [params.categoryId, params.productId])

  const loadProduct = async (categoryId: string, productId: string) => {
    setLoading(true)
    try {
      const data = await categoryProductsApi.getProductById(categoryId, productId)
      if (data.success && data.data) {
        setProduct(data.data)
      }
    } catch (error) {
      console.error("Failed to load product:", error)
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    if (!isAuthenticated()) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setAddingToCart(true)
    try {
      const result = await addToCart({
        categoryProductId: product._id,
        quantity,
      })

      if (result.message) {
        toast({
          title: "Success",
          description: `${product.productDetails.productName} added to cart`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading product details...</p>
          </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Product Not Found</h2>
            <p className="mt-2 text-muted-foreground">The product you're looking for doesn't exist</p>
            <Button className="mt-4" onClick={() => router.push("/products")}>
              Browse Products
            </Button>
          </div>
      </div>
    )
  }

  const inStock = product.productDetails.stock.available

  return (
    <div className="container px-4 py-8 md:px-6">
          {/* Breadcrumb */}
          <Button variant="ghost" className="mb-4 -ml-4" onClick={() => router.back()}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Images Section */}
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={product.productDetails.images[selectedImage] || "/placeholder.svg"}
                      alt={product.productDetails.productName}
                      className="h-full w-full object-contain p-8"
                    />
                    {product.productDetails.prescriptionRequired && (
                      <Badge className="absolute top-4 right-4" variant="destructive">
                        Prescription Required
                      </Badge>
                    )}
                    {product.productDetails.pricing.discount > 0 && (
                      <Badge className="absolute top-4 left-4 bg-primary">
                        {product.productDetails.pricing.discount}% OFF
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {product.productDetails.images.length > 1 && (
                <div className="flex gap-2">
                  {product.productDetails.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square w-20 overflow-hidden rounded-lg border-2 ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.productDetails.productName} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.productDetails.productName}</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  {product.productDetails.brandName} • {product.productDetails.manufacturer}
                </p>
                <p className="text-sm text-muted-foreground">Generic: {product.productDetails.genericName}</p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">₹{product.productDetails.pricing.sellingPrice}</span>
                {product.productDetails.pricing.discount > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.productDetails.pricing.mrp}
                    </span>
                    <Badge className="bg-primary">{product.productDetails.pricing.discount}% OFF</Badge>
                  </>
                )}
              </div>

              <Separator />

              {/* Key Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pack Size</p>
                    <p className="font-medium">{product.productDetails.packaging.packSize}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">
                      {format(new Date(product.productDetails.packaging.expiryDate), "MMM yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{product.productDetails.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <p className="font-medium">
                      {product.productDetails.stock.available ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Available</Badge>
                      ) : (
                        <Badge variant="destructive">Not Available</Badge>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Stock Status */}
              <div>
                {inStock ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="destructive">Not Available</Badge>
                )}
              </div>

              {/* Quantity Selector */}
              {inStock && (
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.productDetails.stock.quantity, quantity + 1))}
                      disabled={quantity >= product.productDetails.stock.quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  size="lg"
                  disabled={!inStock || addingToCart}
                  onClick={handleAddToCart}
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {product.productDetails.prescriptionRequired && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Prescription Required</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        You'll need to upload a valid prescription to purchase this product
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Description & Details Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </TabsTrigger>
                <TabsTrigger value="details" className="gap-2">
                  <Info className="h-4 w-4" />
                  Product Details
                </TabsTrigger>
                <TabsTrigger value="packaging" className="gap-2">
                  <Box className="h-4 w-4" />
                  Packaging Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-semibold">Product Description</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product.productDetails.description}
                    </p>

                    {product.productDetails.packaging.storageInstructions && (
                      <>
                        <Separator className="my-6" />
                        <div>
                          <h4 className="mb-3 text-lg font-semibold">Storage Instructions</h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {product.productDetails.packaging.storageInstructions}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-semibold">Product Details</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Brand</p>
                          <p className="font-medium text-lg">{product.productDetails.brandName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Manufacturer</p>
                          <p className="font-medium text-lg">{product.productDetails.manufacturer}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Generic Name</p>
                          <p className="font-medium text-lg">{product.productDetails.genericName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Category</p>
                          <p className="font-medium text-lg">{product.productDetails.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Prescription</p>
                          <p className="font-medium text-lg">
                            {product.productDetails.prescriptionRequired ? (
                              <Badge variant="destructive">Required</Badge>
                            ) : (
                              <Badge variant="secondary">Not Required</Badge>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Stock Status</p>
                          <p className="font-medium text-lg">
                            {product.productDetails.stock.available ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Not Available</Badge>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="packaging" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-semibold">Packaging Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Pack Size</p>
                          <p className="font-medium text-lg">{product.productDetails.packaging.packSize}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Expiry Date</p>
                          <p className="font-medium text-lg">
                            {format(new Date(product.productDetails.packaging.expiryDate), "MMMM dd, yyyy")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">MRP</p>
                          <p className="font-medium text-lg">₹{product.productDetails.pricing.mrp}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Selling Price</p>
                          <p className="font-medium text-lg text-primary">
                            ₹{product.productDetails.pricing.sellingPrice}
                          </p>
                        </div>
                        {product.productDetails.pricing.discount > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Discount</p>
                            <p className="font-medium text-lg text-green-600">
                              {product.productDetails.pricing.discount}% OFF
                            </p>
                          </div>
                        )}
                      </div>

                      {product.productDetails.packaging.storageInstructions && (
                        <>
                          <Separator className="my-4" />
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Storage Instructions</p>
                            <p className="font-medium leading-relaxed">
                              {product.productDetails.packaging.storageInstructions}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
  )
}
