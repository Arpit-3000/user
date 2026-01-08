"use client"

import * as React from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingCart, Star, ChevronLeft } from "lucide-react"

export default function MedicineCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")

  // Decode the category from URL
  const category = decodeURIComponent(resolvedParams.category)

  // Mock data - filter by category
  const allMedicines = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      brand: "Crocin",
      category: "Pain Relief",
      price: 45,
      mrp: 60,
      discount: 25,
      prescription: false,
      rating: 4.5,
      reviews: 120,
      image: "/medicine-tablets.jpg",
      stock: true,
    },
    {
      id: 2,
      name: "Ibuprofen 400mg",
      brand: "Brufen",
      category: "Pain Relief",
      price: 55,
      mrp: 75,
      discount: 27,
      prescription: false,
      rating: 4.6,
      reviews: 98,
      image: "/medicine-capsules.jpg",
      stock: true,
    },
    {
      id: 3,
      name: "Azithromycin 500mg",
      brand: "Azithral",
      category: "Antibiotics",
      price: 120,
      mrp: 150,
      discount: 20,
      prescription: true,
      rating: 4.7,
      reviews: 85,
      image: "/medicine-capsules.jpg",
      stock: true,
    },
    {
      id: 4,
      name: "Amoxicillin 500mg",
      brand: "Amoxil",
      category: "Antibiotics",
      price: 90,
      mrp: 120,
      discount: 25,
      prescription: true,
      rating: 4.5,
      reviews: 150,
      image: "/medicine-capsules.jpg",
      stock: true,
    },
    {
      id: 5,
      name: "Vitamin D3 60K",
      brand: "HealthKart",
      category: "Vitamins",
      price: 80,
      mrp: 100,
      discount: 20,
      prescription: false,
      rating: 4.6,
      reviews: 200,
      image: "/vitamin-supplements.jpg",
      stock: true,
    },
    {
      id: 6,
      name: "Multivitamin",
      brand: "HealthVit",
      category: "Vitamins",
      price: 120,
      mrp: 160,
      discount: 25,
      prescription: false,
      rating: 4.4,
      reviews: 180,
      image: "/vitamin-supplements.jpg",
      stock: true,
    },
    {
      id: 7,
      name: "Cetrizine 10mg",
      brand: "Zyrtec",
      category: "Allergy",
      price: 35,
      mrp: 50,
      discount: 30,
      prescription: false,
      rating: 4.4,
      reviews: 95,
      image: "/allergy-medicine.png",
      stock: true,
    },
    {
      id: 8,
      name: "Omeprazole 20mg",
      brand: "Prilosec",
      category: "Digestive",
      price: 55,
      mrp: 75,
      discount: 27,
      prescription: false,
      rating: 4.6,
      reviews: 110,
      image: "/medicine-tablets.jpg",
      stock: true,
    },
  ]

  const medicines = allMedicines.filter((med) => med.category.toLowerCase() === category.toLowerCase())

  const priceRanges = [
    { label: "Under ₹50", value: "0-50" },
    { label: "₹50 - ₹100", value: "50-100" },
    { label: "₹100 - ₹200", value: "100-200" },
    { label: "Above ₹200", value: "200+" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/medicines" className="hover:text-foreground">
              Medicines
            </Link>
            <span>/</span>
            <span className="text-foreground">{category}</span>
          </div>

          <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => router.back()}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold">{category} Medicines</h1>
            <p className="mt-2 text-muted-foreground">Browse all {category.toLowerCase()} medicines</p>
          </div>

          {/* Search & Sort */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="popularity">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="discount">Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filters & Products */}
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            {/* Filters */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm">
                    Clear All
                  </Button>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <div key={range.value} className="flex items-center gap-2">
                        <Checkbox id={range.value} />
                        <Label htmlFor={range.value} className="cursor-pointer text-sm">
                          {range.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold">Prescription</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="no-rx" />
                      <Label htmlFor="no-rx" className="cursor-pointer text-sm">
                        No Prescription
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="rx" />
                      <Label htmlFor="rx" className="cursor-pointer text-sm">
                        Prescription Required
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold">Availability</h3>
                  <div className="flex items-center gap-2">
                    <Checkbox id="in-stock" />
                    <Label htmlFor="in-stock" className="cursor-pointer text-sm">
                      In Stock
                    </Label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div>
              <div className="mb-4 text-sm text-muted-foreground">{medicines.length} medicines found</div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {medicines.map((medicine) => (
                  <Card key={medicine.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                    <CardContent className="p-4">
                      <Link href={`/medicines/${medicine.id}`}>
                        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
                          <img
                            src={medicine.image || "/placeholder.svg"}
                            alt={medicine.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          {medicine.prescription && (
                            <Badge className="absolute top-2 right-2" variant="destructive">
                              Rx
                            </Badge>
                          )}
                          {medicine.discount > 0 && (
                            <Badge className="absolute top-2 left-2 bg-primary">{medicine.discount}% OFF</Badge>
                          )}
                        </div>
                      </Link>

                      <div className="space-y-2">
                        <Link href={`/medicines/${medicine.id}`}>
                          <h3 className="font-semibold text-balance leading-tight hover:text-primary">
                            {medicine.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{medicine.brand}</p>

                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <span className="text-sm font-medium">{medicine.rating}</span>
                          <span className="text-xs text-muted-foreground">({medicine.reviews})</span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold">₹{medicine.price}</span>
                          <span className="text-sm text-muted-foreground line-through">₹{medicine.mrp}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" size="sm">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
