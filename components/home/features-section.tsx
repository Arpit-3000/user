import { Shield, Truck, Clock, HeadphonesIcon } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "100% Authentic",
      description: "All medicines from licensed pharmacies",
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description: "On orders above ₹500",
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Round the clock healthcare support",
    },
    {
      icon: HeadphonesIcon,
      title: "Expert Support",
      description: "Talk to healthcare professionals",
    },
  ]

  return (
    <section className="border-t bg-muted/30 py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground text-balance leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
