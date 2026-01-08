"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Video, MapPin, Clock, ChevronRight, Stethoscope } from "lucide-react"
import { format } from "date-fns"

export default function AppointmentsPage() {
  const appointments = [
    {
      id: "APT001",
      doctorName: "Dr. Priya Sharma",
      specialization: "General Physician",
      date: new Date("2025-01-28"),
      time: "3:00 PM",
      type: "online",
      status: "upcoming",
      fee: 500,
      image: "/female-doctor.png",
      meetingLink: "https://meet.example.com/abc123",
    },
    {
      id: "APT002",
      doctorName: "Dr. Rajesh Kumar",
      specialization: "Cardiologist",
      date: new Date("2025-01-30"),
      time: "10:00 AM",
      type: "offline",
      status: "upcoming",
      fee: 800,
      image: "/male-doctor.png",
      location: "City Hospital, Bandra West, Mumbai",
    },
    {
      id: "APT003",
      doctorName: "Dr. Anita Desai",
      specialization: "Dermatologist",
      date: new Date("2025-01-15"),
      time: "4:00 PM",
      type: "online",
      status: "completed",
      fee: 600,
      image: "/dermatologist.png",
    },
    {
      id: "APT004",
      doctorName: "Dr. Amit Patel",
      specialization: "Pediatrician",
      date: new Date("2025-01-10"),
      time: "11:00 AM",
      type: "offline",
      status: "completed",
      fee: 550,
      image: "/male-doctor.png",
      location: "Wellness Clinic, Andheri East, Mumbai",
    },
    {
      id: "APT005",
      doctorName: "Dr. Sneha Reddy",
      specialization: "Gynecologist",
      date: new Date("2025-01-20"),
      time: "2:00 PM",
      type: "online",
      status: "cancelled",
      fee: 700,
      image: "/female-doctor.png",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-accent text-accent-foreground"
      case "completed":
        return "bg-primary text-primary-foreground"
      case "cancelled":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const filterAppointments = (status?: string) => {
    if (!status || status === "all") return appointments
    return appointments.filter((apt) => apt.status === status)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <h1 className="mb-8 text-3xl font-bold">My Appointments</h1>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            {["all", "upcoming", "completed", "cancelled"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                <div className="space-y-4">
                  {filterAppointments(tab === "all" ? undefined : tab).length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <Stethoscope className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h2 className="mb-2 text-xl font-semibold">No appointments found</h2>
                        <p className="mb-6 text-muted-foreground">You haven't booked any appointments yet</p>
                        <Button asChild>
                          <Link href="/doctors">Find Doctors</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    filterAppointments(tab === "all" ? undefined : tab).map((appointment) => (
                      <Card key={appointment.id} className="transition-shadow hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex gap-4">
                              <Avatar className="h-16 w-16 shrink-0">
                                <AvatarImage
                                  src={appointment.image || "/placeholder.svg"}
                                  alt={appointment.doctorName}
                                />
                                <AvatarFallback>
                                  {appointment.doctorName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <h3 className="text-lg font-semibold">{appointment.doctorName}</h3>
                                  <Badge className={getStatusColor(appointment.status)}>
                                    {appointment.status.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{appointment.specialization}</p>

                                <div className="mt-3 space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{format(appointment.date, "PPP")}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{appointment.time}</span>
                                  </div>
                                  {appointment.type === "online" ? (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Video className="h-4 w-4 text-primary" />
                                      <span className="text-primary">Online Consultation</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-start gap-2 text-sm">
                                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                                      <span className="text-muted-foreground">{appointment.location}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-3 text-lg font-bold">₹{appointment.fee}</div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              {appointment.status === "upcoming" && appointment.type === "online" && (
                                <Button size="sm">
                                  <Video className="mr-2 h-4 w-4" />
                                  Join Call
                                </Button>
                              )}
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/appointments/${appointment.id}`}>
                                  View Details
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                              </Button>
                              {appointment.status === "upcoming" && (
                                <>
                                  <Button variant="outline" size="sm">
                                    Reschedule
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
