import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, Home } from "lucide-react"

export function LabTestsSection() {
  const tests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      description: "Comprehensive blood analysis",
      price: 399,
      mrp: 600,
      homeCollection: true,
      reportTime: "24 hours",
    },
    {
      id: 2,
      name: "Lipid Profile",
      description: "Cholesterol & triglycerides test",
      price: 599,
      mrp: 900,
      homeCollection: true,
      reportTime: "24 hours",
    },
    {
      id: 3,
      name: "HbA1c (Diabetes)",
      description: "Blood sugar monitoring",
      price: 450,
      mrp: 700,
      homeCollection: true,
      reportTime: "48 hours",
    },
  ]

  return (
    <section className="bg-muted/30 py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Popular Lab Tests</h2>
            <p className="mt-2 text-muted-foreground">Book tests with free home sample collection</p>
          </div>
          <Button variant="outline" asChild className="hidden md:inline-flex bg-transparent">
            <Link href="/lab-tests">View All</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card key={test.id} className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <FlaskConical className="h-6 w-6 text-accent" />
                  </div>
                  {test.homeCollection && (
                    <Badge variant="secondary" className="gap-1">
                      <Home className="h-3 w-3" />
                      Home Collection
                    </Badge>
                  )}
                </div>

                <h3 className="mb-2 text-lg font-semibold text-balance leading-tight">{test.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{test.description}</p>

                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">₹{test.price}</span>
                  <span className="text-sm text-muted-foreground line-through">₹{test.mrp}</span>
                </div>

                <div className="mb-4 text-sm text-muted-foreground">Report in {test.reportTime}</div>

                <Button className="w-full" asChild>
                  <Link href={`/lab-tests/${test.id}`}>Book Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
