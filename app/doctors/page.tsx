"use client"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Video, Calendar, Search } from "lucide-react"

export default function DoctorsPage() {
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
      nextSlot: "Today, 3:00 PM",
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
      nextSlot: "Today, 4:30 PM",
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
      nextSlot: "Tomorrow, 10:00 AM",
    },
    {
      id: 4,
      name: "Dr. Amit Patel",
      specialization: "Pediatrician",
      experience: 15,
      rating: 4.8,
      reviews: 410,
      fee: 550,
      image: "/male-doctor.png",
      available: "online",
      nextSlot: "Today, 5:00 PM",
    },
    {
      id: 5,
      name: "Dr. Sneha Reddy",
      specialization: "Gynecologist",
      experience: 14,
      rating: 4.9,
      reviews: 380,
      fee: 700,
      image: "/female-doctor.png",
      available: "online",
      nextSlot: "Tomorrow, 11:00 AM",
    },
    {
      id: 6,
      name: "Dr. Vikram Singh",
      specialization: "Orthopedist",
      experience: 20,
      rating: 4.7,
      reviews: 450,
      fee: 850,
      image: "/male-doctor.png",
      available: "offline",
      nextSlot: "Tomorrow, 2:00 PM",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Consult Doctors</h1>
            <p className="mt-2 text-muted-foreground">Book online or offline consultations with verified doctors</p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or specialization..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="general">General Physician</SelectItem>
                <SelectItem value="cardiologist">Cardiologist</SelectItem>
                <SelectItem value="dermatologist">Dermatologist</SelectItem>
                <SelectItem value="pediatrician">Pediatrician</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Consultation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">In-Clinic</SelectItem>
              </SelectContent>
            </Select>
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
                      <p className="mt-1 text-xs text-muted-foreground">{doctor.experience} years experience</p>
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

                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground">Next available</div>
                    <div className="font-medium">{doctor.nextSlot}</div>
                  </div>

                  <div className="mb-4 text-lg font-bold">₹{doctor.fee} consultation fee</div>

                  <Button className="w-full" asChild>
                    <Link href={`/doctors/${doctor.id}`}>Book Appointment</Link>
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
