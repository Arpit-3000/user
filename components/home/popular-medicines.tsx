import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"

export function PopularMedicines() {
  const medicines = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      brand: "Crocin",
      price: 45,
      mrp: 60,
      discount: 25,
      prescription: false,
      rating: 4.5,
      image: "/medicine-tablets.jpg",
    },
    {
      id: 2,
      name: "Azithromycin 500mg",
      brand: "Azithral",
      price: 120,
      mrp: 150,
      discount: 20,
      prescription: true,
      rating: 4.7,
      image: "/medicine-capsules.jpg",
    },
    {
      id: 3,
      name: "Vitamin D3 60K",
      brand: "HealthKart",
      price: 80,
      mrp: 100,
      discount: 20,
      prescription: false,
      rating: 4.6,
      image: "/vitamin-supplements.jpg",
    },
    {
      id: 4,
      name: "Cetrizine 10mg",
      brand: "Zyrtec",
      price: 35,
      mrp: 50,
      discount: 30,
      prescription: false,
      rating: 4.4,
      image: "/allergy-medicine.png",
    },
  ]

  return (
    <section className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Popular Medicines</h2>
          <p className="mt-2 text-muted-foreground">Trusted medicines for common ailments</p>
        </div>
        <Button variant="outline" asChild className="hidden md:inline-flex bg-transparent">
          <Link href="/medicines">View All</Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {medicines.map((medicine) => (
          <Card key={medicine.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="p-4">
              <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={medicine.image || "/placeholder.svg"}
                  alt={medicine.name}
                  className="h-full w-full object-cover"
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

              <div className="space-y-2">
                <h3 className="font-semibold text-balance leading-tight">{medicine.name}</h3>
                <p className="text-sm text-muted-foreground">{medicine.brand}</p>

                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span className="text-sm font-medium">{medicine.rating}</span>
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

      <div className="mt-8 text-center md:hidden">
        <Button variant="outline" asChild className="w-full sm:w-auto bg-transparent">
          <Link href="/medicines">View All Medicines</Link>
        </Button>
      </div>
    </section>
  )
}
