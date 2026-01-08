"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Video, MapPin, Clock, ChevronLeft, Download, Star, FileText, Phone, Mail } from "lucide-react"
import { format } from "date-fns"

export default function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()

  const appointment = {
    id: resolvedParams.id,
    doctorName: "Dr. Priya Sharma",
    specialization: "General Physician",
    qualification: "MBBS, MD (General Medicine)",
    experience: 12,
    date: new Date("2025-01-28"),
    time: "3:00 PM",
    type: "online",
    status: "upcoming",
    fee: 500,
    image: "/female-doctor.png",
    phone: "+91 98765 43210",
    email: "dr.priya@arogyarx.com",
    rating: 4.8,
    reviews: 340,
    meetingLink: "https://meet.example.com/abc123",
    bookingDate: new Date("2025-01-25"),
    patientName: "John Doe",
    patientPhone: "+91 98765 43210",
    symptoms: "Fever, headache, body ache",
    notes: "Patient experiencing symptoms for 2 days. Requests prescription.",
  }

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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => router.back()}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Appointments
          </Button>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Appointment Details</h1>
              <p className="mt-1 text-muted-foreground">ID: {appointment.id}</p>
            </div>
            <Badge className={getStatusColor(appointment.status)} className="w-fit">
              {appointment.status.toUpperCase()}
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Doctor Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Doctor Information</h2>
                  <div className="flex gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={appointment.image || "/placeholder.svg"} alt={appointment.doctorName} />
                      <AvatarFallback>
                        {appointment.doctorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{appointment.doctorName}</h3>
                      <p className="text-muted-foreground">{appointment.specialization}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{appointment.qualification}</p>

                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-medium">{appointment.rating}</span>
                          <span className="text-muted-foreground">({appointment.reviews} reviews)</span>
                        </div>
                        <span className="text-muted-foreground">{appointment.experience} years exp.</span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <a href={`tel:${appointment.phone}`}>
                          <Button variant="outline" size="sm">
                            <Phone className="mr-2 h-4 w-4" />
                            Call Doctor
                          </Button>
                        </a>
                        <a href={`mailto:${appointment.email}`}>
                          <Button variant="outline" size="sm">
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Appointment Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Date</div>
                        <div className="text-sm text-muted-foreground">{format(appointment.date, "PPP")}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Time</div>
                        <div className="text-sm text-muted-foreground">{appointment.time}</div>
                      </div>
                    </div>

                    {appointment.type === "online" ? (
                      <div className="flex items-start gap-3">
                        <Video className="mt-0.5 h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium text-primary">Online Consultation</div>
                          <div className="mt-1 text-sm text-muted-foreground">Video call via secure link</div>
                          {appointment.status === "upcoming" && (
                            <Button size="sm" className="mt-2">
                              Join Video Call
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Clinic Visit</div>
                          <div className="text-sm text-muted-foreground">City Hospital, Bandra West, Mumbai</div>
                          <Button variant="link" size="sm" className="mt-1 h-auto p-0">
                            Get Directions
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Patient Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Patient Information</h2>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Patient Name</div>
                      <div className="font-medium">{appointment.patientName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Phone Number</div>
                      <div className="font-medium">{appointment.patientPhone}</div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-sm text-muted-foreground">Symptoms/Concerns</div>
                      <div className="font-medium">{appointment.symptoms}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Additional Notes</div>
                      <div className="font-medium">{appointment.notes}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prescription & Reports */}
              {appointment.status === "completed" && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">Prescription & Reports</h2>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <FileText className="mr-2 h-4 w-4" />
                        Prescription.pdf
                        <Download className="ml-auto h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <FileText className="mr-2 h-4 w-4" />
                        Medical Report.pdf
                        <Download className="ml-auto h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Payment Summary */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Payment Summary</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Consultation Fee</span>
                      <span>₹{appointment.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee</span>
                      <span className="text-primary">FREE</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{appointment.fee}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Booked on {format(appointment.bookingDate, "PPP")}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              {appointment.status === "upcoming" && (
                <div className="space-y-2">
                  <Button className="w-full">Reschedule Appointment</Button>
                  <Button variant="outline" className="w-full bg-transparent text-destructive">
                    Cancel Appointment
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Need Help?
                  </Button>
                </div>
              )}

              {appointment.status === "completed" && (
                <div className="space-y-2">
                  <Button className="w-full">Book Follow-up</Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Rate Doctor
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
