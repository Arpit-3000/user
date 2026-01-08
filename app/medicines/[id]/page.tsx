"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { MedicineDetailClient } from "@/components/medicine-detail-client"

export default async function MedicineDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = params

  // Mock data - in production, fetch based on params.id
  const medicine = {
    id: resolvedParams.id,
    name: "Paracetamol 500mg",
    brand: "Crocin",
    manufacturer: "GlaxoSmithKline",
    price: 45,
    mrp: 60,
    discount: 25,
    prescription: false,
    rating: 4.5,
    reviews: 120,
    stock: true,
    quantity: 10,
    images: ["/medicine-tablets.jpg", "/medicine-tablets.jpg", "/medicine-tablets.jpg"],
    description:
      "Crocin Advance contains paracetamol which provides fast and effective relief from pain. It is used to relieve headaches, migraines, toothaches, period pain, and other aches and pains.",
    uses: [
      "Headache and migraine relief",
      "Fever reduction",
      "Muscle pain relief",
      "Toothache relief",
      "Cold and flu symptoms",
    ],
    sideEffects: ["Nausea", "Vomiting", "Allergic reactions", "Stomach upset"],
    dosage: "1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.",
    storage: "Store in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  }

  const relatedMedicines = [
    {
      id: 2,
      name: "Ibuprofen 400mg",
      brand: "Brufen",
      price: 55,
      mrp: 75,
      image: "/medicine-capsules.jpg",
    },
    {
      id: 3,
      name: "Aspirin 75mg",
      brand: "Disprin",
      price: 30,
      mrp: 45,
      image: "/medicine-tablets.jpg",
    },
    {
      id: 4,
      name: "Dolo 650",
      brand: "Dolo",
      price: 40,
      mrp: 55,
      image: "/medicine-tablets.jpg",
    },
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
            <span className="text-foreground">{medicine.name}</span>
          </div>

          <MedicineDetailClient medicine={medicine} relatedMedicines={relatedMedicines} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
