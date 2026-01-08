"use client"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FlaskConical, Home, Search, Clock } from "lucide-react"

export default function LabTestsPage() {
  const tests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      description: "Comprehensive blood analysis for overall health assessment",
      price: 399,
      mrp: 600,
      homeCollection: true,
      reportTime: "24 hours",
      parameters: 28,
      fasting: false,
    },
    {
      id: 2,
      name: "Lipid Profile",
      description: "Cholesterol and triglycerides test for heart health",
      price: 599,
      mrp: 900,
      homeCollection: true,
      reportTime: "24 hours",
      parameters: 8,
      fasting: true,
    },
    {
      id: 3,
      name: "HbA1c (Diabetes)",
      description: "Blood sugar monitoring for diabetes management",
      price: 450,
      mrp: 700,
      homeCollection: true,
      reportTime: "48 hours",
      parameters: 1,
      fasting: false,
    },
    {
      id: 4,
      name: "Thyroid Profile",
      description: "TSH, T3, T4 for thyroid function assessment",
      price: 550,
      mrp: 800,
      homeCollection: true,
      reportTime: "24 hours",
      parameters: 3,
      fasting: false,
    },
    {
      id: 5,
      name: "Liver Function Test (LFT)",
      description: "Comprehensive liver health evaluation",
      price: 500,
      mrp: 750,
      homeCollection: true,
      reportTime: "24 hours",
      parameters: 12,
      fasting: true,
    },
    {
      id: 6,
      name: "Kidney Function Test",
      description: "Creatinine, urea, and other kidney markers",
      price: 480,
      mrp: 720,
      homeCollection: true,
      reportTime: "24 hours",
      parameters: 10,
      fasting: false,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Lab Tests</h1>
            <p className="mt-2 text-muted-foreground">Book lab tests with free home sample collection</p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search lab tests..." className="pl-9" />
            </div>
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

                  <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>{test.parameters} parameters included</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{test.reportTime}</span>
                      </div>
                    </div>
                    {test.fasting && <Badge variant="outline">Fasting Required</Badge>}
                  </div>

                  <div className="mb-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">₹{test.price}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{test.mrp}</span>
                    <Badge className="bg-primary">{Math.round(((test.mrp - test.price) / test.mrp) * 100)}% OFF</Badge>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/lab-tests/${test.id}`}>Book Test</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
