import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <h1 className="mb-8 text-3xl font-bold">Healthcare Products</h1>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Healthcare products section coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
