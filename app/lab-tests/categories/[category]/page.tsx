"use client"
import { use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FlaskConical, Home, Search, Clock, ChevronLeft } from "lucide-react"

export default function LabTestCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const category = decodeURIComponent(resolvedParams.category)

  const allTests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      category: "Blood Tests",
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
      name: "Hemoglobin Test",
      category: "Blood Tests",
      description: "Measures hemoglobin levels in blood",
      price: 199,
      mrp: 300,
      homeCollection: true,
      reportTime: "12 hours",
      parameters: 1,
      fasting: false,
    },
    {
      id: 3,
      name: "Lipid Profile",
      category: "Heart Tests",
      description: "Cholesterol and triglycerides test for heart health",
      price: 599,
      mrp: 900,
      homeCollection: true,
      reportTime: "24 hours",
      parameters: 8,
      fasting: true,
    },
    {
      id: 4,
      name: "ECG",
      category: "Heart Tests",
      description: "Electrocardiogram for heart rhythm analysis",
      price: 350,
      mrp: 500,
      homeCollection: false,
      reportTime: "2 hours",
      parameters: 1,
      fasting: false,
    },
    {
      id: 5,
      name: "HbA1c (Diabetes)",
      category: "Diabetes Tests",
      description: "Blood sugar monitoring for diabetes management",
      price: 450,
      mrp: 700,
      homeCollection: true,
      reportTime: "48 hours",
      parameters: 1,
      fasting: false,
    },
    {
      id: 6,
      name: "Fasting Blood Sugar",
      category: "Diabetes Tests",
      description: "Measures glucose levels after fasting",
      price: 150,
      mrp: 250,
      homeCollection: true,
      reportTime: "12 hours",
      parameters: 1,
      fasting: true,
    },
    {
      id: 7,
      name: "Thyroid Profile",
      category: "Hormone Tests",
      description: "TSH, T3, T4 for thyroid function assessment",
      price: 550,
      mrp: 800,
      homeCollection: true,
      reportTime: "24 hours",
      parameters: 3,
      fasting: false,
    },
    {
      id: 8,
      name: "Liver Function Test (LFT)",
      category: "Organ Tests",
      description: "Comprehensive liver health evaluation",
      price: 500,
      mrp: 750,
      homeCollection: true,
      reportTime: "24 hours",
      parameters: 12,
      fasting: true,
    },
    {
      id: 9,
      name: "Kidney Function Test",
      category: "Organ Tests",
      description: "Creatinine, urea, and other kidney markers",
      price: 480,
      mrp: 720,
      homeCollection: true,
      reportTime: "24 hours",
      parameters: 10,
      fasting: false,
    },
  ]

  const tests = allTests.filter((test) => test.category.toLowerCase() === category.toLowerCase())

  return (
    <div className="container px-4 py-8 md:px-6">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/lab-tests" className="hover:text-foreground">
              Lab Tests
            </Link>
            <span>/</span>
            <span className="text-foreground">{category}</span>
          </div>

          <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => router.back()}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold">{category}</h1>
            <p className="mt-2 text-muted-foreground">Browse all {category.toLowerCase()} with free home collection</p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tests..." className="pl-9" />
            </div>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">{tests.length} tests found</div>

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
  )
}
