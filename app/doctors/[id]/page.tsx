"use client"

import * as React from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Video, CalendarIcon, Award, GraduationCap, MapPin, ChevronLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [date, setDate] = React.useState<Date>()
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState("")
  const [consultationType, setConsultationType] = React.useState<"online" | "offline">("online")

  const doctor = {
    id: resolvedParams.id,
    name: "Dr. Priya Sharma",
    specialization: "General Physician",
    experience: 12,
    rating: 4.8,
    reviews: 340,
    fee: 500,
    image: "/female-doctor.png",
    qualification: "MBBS, MD (Medicine)",
    languages: ["English", "Hindi", "Marathi"],
    clinicName: "HealthCare Clinic",
    clinicAddress: "123 Main Street, Mumbai, Maharashtra 400001",
    about:
      "Dr. Priya Sharma is a highly experienced General Physician with over 12 years of practice. She specializes in treating common ailments, preventive care, and chronic disease management. Known for her patient-centric approach and thorough consultations.",
    expertise: ["Diabetes Management", "Hypertension", "Respiratory Issues", "Digestive Problems", "Preventive Care"],
  }

  const timeSlots = {
    morning: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
    afternoon: ["02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"],
    evening: ["05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => router.back()}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                      <AvatarFallback>
                        {doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h1 className="text-2xl font-bold">{doctor.name}</h1>
                      <p className="mt-1 text-lg text-muted-foreground">{doctor.specialization}</p>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span>{doctor.qualification}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span>{doctor.experience} years experience</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <span className="font-medium">{doctor.rating}</span>
                          <span className="text-sm text-muted-foreground">({doctor.reviews} reviews)</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge>Video Consultation</Badge>
                          <Badge variant="outline">In-Clinic</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-semibold">Languages</h3>
                      <div className="flex gap-2">
                        {doctor.languages.map((lang) => (
                          <Badge key={lang} variant="secondary">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold">Clinic Details</h3>
                      <p className="font-medium">{doctor.clinicName}</p>
                      <div className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{doctor.clinicAddress}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="expertise">Expertise</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-lg font-semibold">About Doctor</h3>
                      <p className="leading-relaxed text-muted-foreground">{doctor.about}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="expertise" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-lg font-semibold">Areas of Expertise</h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {doctor.expertise.map((area) => (
                          <div key={area} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span>{area}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-bold">Book Appointment</h2>

                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label>Consultation Type</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={consultationType === "online" ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => setConsultationType("online")}
                          >
                            <Video className="mr-2 h-4 w-4" />
                            Online
                          </Button>
                          <Button
                            type="button"
                            variant={consultationType === "offline" ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => setConsultationType("offline")}
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            In-Clinic
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Select Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Select Time Slot</Label>
                        <div className="space-y-3">
                          {Object.entries(timeSlots).map(([period, slots]) => (
                            <div key={period}>
                              <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">{period}</div>
                              <div className="grid grid-cols-3 gap-2">
                                {slots.map((slot) => (
                                  <Button
                                    key={slot}
                                    type="button"
                                    size="sm"
                                    variant={selectedTimeSlot === slot ? "default" : "outline"}
                                    onClick={() => setSelectedTimeSlot(slot)}
                                  >
                                    {slot}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patient-name">Patient Name</Label>
                        <Input id="patient-name" placeholder="Enter patient name" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="symptoms">Symptoms (Optional)</Label>
                        <Textarea id="symptoms" placeholder="Describe your symptoms..." rows={3} />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Consultation Fee</span>
                        <span>₹{doctor.fee}</span>
                      </div>

                      <Button className="w-full" size="lg" type="submit">
                        Book Appointment - ₹{doctor.fee}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
