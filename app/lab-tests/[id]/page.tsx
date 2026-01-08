"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LabTestDetailClient } from "@/components/lab-test-detail-client"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function LabTestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params

  const test = {
    id: resolvedParams.id,
    name: "Complete Blood Count (CBC)",
    description: "Comprehensive blood analysis for overall health assessment",
    price: 399,
    mrp: 600,
    homeCollection: true,
    reportTime: "24 hours",
    parameters: 28,
    fasting: false,
    preparations: [
      "No special preparation required",
      "You can have your normal diet before the test",
      "Inform the technician about any medications you're taking",
    ],
    includes: ["Hemoglobin", "RBC Count", "WBC Count", "Platelet Count", "MCV, MCH, MCHC", "Differential WBC Count"],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
            <Link href="/lab-tests">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <LabTestDetailClient test={test} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
