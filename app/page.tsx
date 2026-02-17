"use client"

import { HeroSection } from "@/components/home/hero-section"
import { CategoryCards } from "@/components/home/category-cards"
import { PopularMedicines } from "@/components/home/popular-medicines"
import { LabTestsSection } from "@/components/home/lab-tests-section"
import { DoctorsSection } from "@/components/home/doctors-section"
import { FeaturesSection } from "@/components/home/features-section"
import { BannerCarousel } from "@/components/banner-carousel"

export default function HomePage() {
  return (
    <>
      <BannerCarousel />
      <HeroSection />
      <CategoryCards />
      <PopularMedicines />
      <LabTestsSection />
      <DoctorsSection />
      <FeaturesSection />
    </>
  )
}
