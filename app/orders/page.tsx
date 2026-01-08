"use client"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ChevronRight } from "lucide-react"
import { format } from "date-fns"

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD123456",
      date: new Date("2025-01-20"),
      status: "delivered",
      items: 3,
      total: 609,
      items_list: ["Paracetamol 500mg x2", "Azithromycin 500mg", "CBC Lab Test"],
    },
    {
      id: "ORD123455",
      date: new Date("2025-01-15"),
      status: "processing",
      items: 2,
      total: 950,
      items_list: ["Vitamin D3 60K", "Lipid Profile Test"],
    },
    {
      id: "ORD123454",
      date: new Date("2025-01-10"),
      status: "shipped",
      items: 1,
      total: 550,
      items_list: ["Doctor Consultation - Dr. Priya Sharma"],
    },
    {
      id: "ORD123453",
      date: new Date("2025-01-05"),
      status: "cancelled",
      items: 2,
      total: 385,
      items_list: ["Cetrizine 10mg", "Omeprazole 20mg"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-primary text-primary-foreground"
      case "shipped":
        return "bg-accent text-accent-foreground"
      case "processing":
        return "bg-chart-3 text-chart-3-foreground"
      case "cancelled":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const filterOrders = (status?: string) => {
    if (!status || status === "all") return orders
    return orders.filter((order) => order.status === status)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            {["all", "processing", "shipped", "delivered", "cancelled"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                <div className="space-y-4">
                  {filterOrders(tab === "all" ? undefined : tab).length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <Package className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h2 className="mb-2 text-xl font-semibold">No orders found</h2>
                        <p className="mb-6 text-muted-foreground">You haven't placed any orders yet</p>
                        <Button asChild>
                          <Link href="/medicines">Start Shopping</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    filterOrders(tab === "all" ? undefined : tab).map((order) => (
                      <Card key={order.id} className="transition-shadow hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-3">
                                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                                <Badge className={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Placed on {format(order.date, "PPP")} • {order.items} items
                              </p>
                              <div className="mt-3 space-y-1">
                                {order.items_list.map((item, index) => (
                                  <p key={index} className="text-sm text-muted-foreground">
                                    • {item}
                                  </p>
                                ))}
                              </div>
                              <div className="mt-4 text-lg font-bold">Total: ₹{order.total}</div>
                            </div>
                            <Button variant="outline" asChild>
                              <Link href={`/orders/${order.id}`}>
                                View Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
