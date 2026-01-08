"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Clock, Home } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface LabTestDetailClientProps {
  test: {
    id: string
    name: string
    description: string
    price: number
    mrp: number
    homeCollection: boolean
    reportTime: string
    parameters: number
    fasting: boolean
    preparations: string[]
    includes: string[]
  }
}

export function LabTestDetailClient({ test }: LabTestDetailClientProps) {
  const [date, setDate] = React.useState<Date>()
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState("")

  const timeSlots = ["07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM", "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
    console.log("[v0] Booking test:", { test: test.id, date, timeSlot: selectedTimeSlot })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <h1 className="text-2xl font-bold text-balance">{test.name}</h1>
              {test.homeCollection && (
                <Badge variant="secondary" className="gap-1">
                  <Home className="h-3 w-3" />
                  Home Collection
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed">{test.description}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <div className="text-sm text-muted-foreground">Parameters</div>
                <div className="mt-1 font-semibold">{test.parameters} tests</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Report Time</div>
                <div className="mt-1 flex items-center gap-1 font-semibold">
                  <Clock className="h-4 w-4" />
                  {test.reportTime}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Fasting</div>
                <div className="mt-1 font-semibold">{test.fasting ? "Required" : "Not Required"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Test Includes</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {test.includes.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Preparation Instructions</h2>
            <ul className="space-y-2">
              {test.preparations.map((prep, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  {prep}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-20 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">₹{test.price}</span>
                  <span className="text-lg text-muted-foreground line-through">₹{test.mrp}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Inclusive of all taxes</p>
              </div>

              <Separator className="my-6" />

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
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
                  <div className="grid grid-cols-1 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        type="button"
                        variant={selectedTimeSlot === slot ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-name">Patient Name</Label>
                  <Input id="patient-name" placeholder="Enter patient name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address for Sample Collection</Label>
                  <Input id="address" placeholder="Enter your address" required />
                </div>

                <Button className="w-full" size="lg" type="submit">
                  Book Test - ₹{test.price}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
