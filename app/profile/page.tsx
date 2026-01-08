"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, Package, ChevronRight, Stethoscope, MapPin, TruckIcon } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function ProfilePage() {
  const recentOrders = [
    {
      id: "ORD123456",
      date: new Date("2025-01-20"),
      status: "delivered",
      items: 3,
      total: 609,
    },
    {
      id: "ORD123455",
      date: new Date("2025-01-15"),
      status: "processing",
      items: 2,
      total: 950,
    },
  ]

  const upcomingAppointments = [
    {
      id: "APT001",
      doctorName: "Dr. Priya Sharma",
      specialization: "General Physician",
      date: new Date("2025-01-28"),
      time: "3:00 PM",
      type: "online",
    },
    {
      id: "APT002",
      doctorName: "Dr. Rajesh Kumar",
      specialization: "Cardiologist",
      date: new Date("2025-01-30"),
      time: "10:00 AM",
      type: "offline",
    },
  ]

  const trackingOrders = [
    {
      id: "ORD123455",
      status: "Out for Delivery",
      trackingId: "TRK9876543211",
      estimatedDelivery: new Date("2025-01-26"),
      currentLocation: "Mumbai Hub",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="mt-2 text-muted-foreground">Manage your account and preferences</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Profile Sidebar */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-xl font-bold">John Doe</h2>
                  <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                  <Badge className="mt-3">Verified Account</Badge>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Member since Jan 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="tracking">Tracking</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-6 text-lg font-semibold">Personal Information</h3>
                      <form className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue="John" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue="Doe" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" className="pl-9" defaultValue="john.doe@example.com" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="phone" type="tel" className="pl-9" defaultValue="+91 98765 43210" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input id="dob" type="date" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <select id="gender" className="w-full rounded-md border px-3 py-2">
                            <option>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button>Save Changes</Button>
                          <Button variant="outline">Cancel</Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="addresses" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Saved Addresses</h3>
                      <Button>Add New Address</Button>
                    </div>

                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="mb-2 flex items-center gap-2">
                                <Badge>Home</Badge>
                                <Badge variant="secondary">Default</Badge>
                              </div>
                              <p className="font-medium">John Doe</p>
                              <p className="text-sm text-muted-foreground">
                                123 Main Street, Andheri West
                                <br />
                                Mumbai, Maharashtra 400058
                              </p>
                              <p className="mt-2 text-sm text-muted-foreground">+91 98765 43210</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge className="mb-2">Work</Badge>
                              <p className="font-medium">John Doe</p>
                              <p className="text-sm text-muted-foreground">
                                456 Business Park, BKC
                                <br />
                                Mumbai, Maharashtra 400051
                              </p>
                              <p className="mt-2 text-sm text-muted-foreground">+91 98765 43210</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Recent Orders</h3>
                      <Button variant="outline" asChild>
                        <Link href="/orders">View All Orders</Link>
                      </Button>
                    </div>

                    {recentOrders.map((order) => (
                      <Card key={order.id} className="transition-shadow hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Package className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <div className="mb-1 flex items-center gap-2">
                                  <h4 className="font-semibold">Order #{order.id}</h4>
                                  <Badge
                                    className={
                                      order.status === "delivered"
                                        ? "bg-primary"
                                        : order.status === "processing"
                                          ? "bg-chart-3"
                                          : ""
                                    }
                                  >
                                    {order.status.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {format(order.date, "PPP")} • {order.items} items
                                </p>
                                <p className="mt-2 font-bold">₹{order.total}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/orders/${order.id}`}>
                                View Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="appointments" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
                      <Button variant="outline" asChild>
                        <Link href="/appointments">View All Appointments</Link>
                      </Button>
                    </div>

                    {upcomingAppointments.map((appointment) => (
                      <Card key={appointment.id} className="transition-shadow hover:shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                                <Stethoscope className="h-6 w-6 text-accent" />
                              </div>
                              <div>
                                <h4 className="mb-1 font-semibold">{appointment.doctorName}</h4>
                                <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
                                <div className="mt-2 flex items-center gap-3 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>{format(appointment.date, "PPP")}</span>
                                  </div>
                                  <span>•</span>
                                  <span>{appointment.time}</span>
                                </div>
                                <Badge variant="secondary" className="mt-2">
                                  {appointment.type === "online" ? "Online" : "In-Clinic"}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/appointments/${appointment.id}`}>
                                View Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tracking" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Track Your Orders</h3>

                    {trackingOrders.length > 0 ? (
                      trackingOrders.map((order) => (
                        <Card key={order.id} className="transition-shadow hover:shadow-lg">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="mb-1 flex items-center gap-2">
                                    <h4 className="font-semibold">Order #{order.id}</h4>
                                    <Badge className="bg-accent">{order.status}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">Tracking ID: {order.trackingId}</p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/orders/${order.id}`}>View Order</Link>
                                </Button>
                              </div>

                              <Separator />

                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    <TruckIcon className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{order.status}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Current location: {order.currentLocation}
                                    </p>
                                  </div>
                                </div>

                                <div className="rounded-lg bg-muted p-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Estimated Delivery</span>
                                    <span className="font-medium">{format(order.estimatedDelivery, "PPP")}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                          <h3 className="mb-2 text-lg font-semibold">No Active Shipments</h3>
                          <p className="text-sm text-muted-foreground">
                            You don't have any orders in transit at the moment
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-6 text-lg font-semibold">Security Settings</h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="mb-3 font-medium">Change Password</h4>
                          <form className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input id="currentPassword" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input id="newPassword" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input id="confirmPassword" type="password" />
                            </div>
                            <Button>Update Password</Button>
                          </form>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="mb-3 font-medium">Two-Factor Authentication</h4>
                          <p className="mb-4 text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                          <Button variant="outline">Enable 2FA</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-6 text-lg font-semibold">Preferences</h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="mb-3 font-medium">Notifications</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Order Updates</p>
                                <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                              </div>
                              <input type="checkbox" defaultChecked className="h-4 w-4" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Promotional Emails</p>
                                <p className="text-sm text-muted-foreground">Receive offers and discounts</p>
                              </div>
                              <input type="checkbox" defaultChecked className="h-4 w-4" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">SMS Notifications</p>
                                <p className="text-sm text-muted-foreground">Get SMS updates for orders</p>
                              </div>
                              <input type="checkbox" className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="mb-3 font-medium">Language & Region</h4>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="language">Language</Label>
                              <select id="language" className="w-full rounded-md border px-3 py-2">
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Marathi</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
