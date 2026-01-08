import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Pill, FlaskConical, Stethoscope, Package, ArrowRight } from "lucide-react"

export function CategoryCards() {
  const categories = [
    {
      icon: Pill,
      title: "Medicines",
      description: "Order prescription & OTC medicines",
      href: "/medicines",
      color: "text-primary",
      bgColor: "bg-primary/10",
      subcategories: ["Pain Relief", "Antibiotics", "Vitamins", "Allergy", "Digestive"],
    },
    {
      icon: FlaskConical,
      title: "Lab Tests",
      description: "Book tests with home collection",
      href: "/lab-tests",
      color: "text-accent",
      bgColor: "bg-accent/10",
      subcategories: ["Blood Tests", "Heart Tests", "Diabetes Tests", "Hormone Tests", "Organ Tests"],
    },
    {
      icon: Stethoscope,
      title: "Consult Doctors",
      description: "Online & offline consultations",
      href: "/doctors",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      icon: Package,
      title: "Healthcare Products",
      description: "Wellness & personal care items",
      href: "/products",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <section className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-balance">What are you looking for?</h2>
        <p className="mt-2 text-muted-foreground text-balance">Comprehensive healthcare services at your fingertips</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.href} href={category.href} className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${category.bgColor}`}>
                  <category.icon className={`h-8 w-8 ${category.color}`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{category.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground text-balance leading-relaxed">
                  {category.description}
                </p>
                <div className="mt-auto flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Explore
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Pill className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Medicine Categories</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Pain Relief", "Antibiotics", "Vitamins", "Allergy", "Digestive"].map((cat) => (
                <Link
                  key={cat}
                  href={`/medicines/categories/${encodeURIComponent(cat)}`}
                  className="rounded-full border px-3 py-1 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <FlaskConical className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">Lab Test Categories</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Blood Tests", "Heart Tests", "Diabetes Tests", "Hormone Tests", "Organ Tests"].map((cat) => (
                <Link
                  key={cat}
                  href={`/lab-tests/categories/${encodeURIComponent(cat)}`}
                  className="rounded-full border px-3 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
