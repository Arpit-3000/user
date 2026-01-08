"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OrderDetailClient } from "@/components/order-detail-client"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params

  const order = {
    id: resolvedParams.id,
    date: new Date("2025-01-20"),
    status: "delivered",
    deliveryDate: new Date("2025-01-23"),
    trackingId: "TRK9876543210",
    items: [
      { name: "Paracetamol 500mg", brand: "Crocin", quantity: 2, price: 90, image: "/medicine-tablets.jpg" },
      { name: "Azithromycin 500mg", brand: "Azithral", quantity: 1, price: 120, image: "/medicine-capsules.jpg" },
      { name: "Complete Blood Count (CBC)", brand: "Lab Test", quantity: 1, price: 399, image: null },
    ],
    address: {
      name: "John Doe",
      address: "123 Main Street, Andheri West, Mumbai, Maharashtra 400058",
      phone: "+91 98765 43210",
    },
    payment: {
      method: "Online Payment",
      subtotal: 609,
      deliveryFee: 0,
      total: 609,
    },
    timeline: [
      { status: "Order Placed", date: new Date("2025-01-20T10:00:00"), completed: true },
      { status: "Processing", date: new Date("2025-01-20T14:00:00"), completed: true },
      { status: "Shipped", date: new Date("2025-01-21T09:00:00"), completed: true },
      { status: "Delivered", date: new Date("2025-01-23T15:30:00"), completed: true },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <OrderDetailClient order={order} />
      </main>
      <Footer />
    </div>
  )
}
