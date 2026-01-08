import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { CategoryCards } from "@/components/home/category-cards"
import { PopularMedicines } from "@/components/home/popular-medicines"
import { LabTestsSection } from "@/components/home/lab-tests-section"
import { DoctorsSection } from "@/components/home/doctors-section"
import { FeaturesSection } from "@/components/home/features-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryCards />
        <PopularMedicines />
        <LabTestsSection />
        <DoctorsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
