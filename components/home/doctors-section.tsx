import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Video, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DoctorsSection() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialization: "General Physician",
      experience: 12,
      rating: 4.8,
      reviews: 340,
      fee: 500,
      image: "/female-doctor.png",
      available: "online",
    },
    {
      id: 2,
      name: "Dr. Rajesh Kumar",
      specialization: "Cardiologist",
      experience: 18,
      rating: 4.9,
      reviews: 520,
      fee: 800,
      image: "/male-doctor.png",
      available: "online",
    },
    {
      id: 3,
      name: "Dr. Anita Desai",
      specialization: "Dermatologist",
      experience: 10,
      rating: 4.7,
      reviews: 280,
      fee: 600,
      image: "/dermatologist.png",
      available: "offline",
    },
  ]

  return (
    <section className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Consult Top Doctors</h2>
          <p className="mt-2 text-muted-foreground">Book online or offline consultations with verified doctors</p>
        </div>
        <Button variant="outline" asChild className="hidden md:inline-flex bg-transparent">
          <Link href="/doctors">View All</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="transition-shadow hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                  <AvatarFallback>
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-balance leading-tight">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{doctor.experience} years exp.</p>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{doctor.rating}</span>
                  <span className="text-sm text-muted-foreground">({doctor.reviews})</span>
                </div>
                {doctor.available === "online" ? (
                  <Badge variant="secondary" className="gap-1">
                    <Video className="h-3 w-3" />
                    Online
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    In-Clinic
                  </Badge>
                )}
              </div>

              <div className="mb-4 text-lg font-bold">₹{doctor.fee} consultation fee</div>

              <Button className="w-full" asChild>
                <Link href={`/doctors/${doctor.id}`}>Book Appointment</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
