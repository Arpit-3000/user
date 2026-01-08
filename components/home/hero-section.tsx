import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Pill, FlaskConical } from "lucide-react"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl">
                Your Health,
                <br />
                <span className="text-primary">Our Priority</span>
              </h1>
              <p className="text-lg text-muted-foreground text-balance leading-relaxed md:text-xl">
                Order medicines, book lab tests, and consult with top doctors from the comfort of your home.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search medicines, tests, doctors..."
                className="h-12 pl-12 pr-4 text-base shadow-md"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/medicines">
                  <Pill className="mr-2 h-4 w-4" />
                  Order Medicines
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/lab-tests">
                  <FlaskConical className="mr-2 h-4 w-4" />
                  Book Lab Test
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Licensed Pharmacy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Verified Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>NABL Labs</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl" />
            <img
              src="/healthcare-professional-with-medical-equipment.jpg"
              alt="Healthcare Professional"
              className="relative z-10 h-full w-full rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
