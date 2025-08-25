"use client"

import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Building,
  Download,
  Printer,
  Share2,
  Smartphone,
} from "lucide-react"
import Image from "next/image"

// Mock data - in a real app, this would come from a database
const mockTicket = {
  id: "TKT-2025-001",
  eventId: "1",
  eventTitle: "Web Development Conference 2025",
  eventDate: "2025-03-15",
  eventTime: "09:00",
  eventLocation: "Convention Center Mexico City",
  eventAddress: "Av. Conscripto 311, Lomas de Sotelo, Miguel Hidalgo, 11200 Ciudad de México, CDMX",
  eventImage: "/placeholder.svg?height=200&width=400",
  purchaseDate: "2025-01-15",
  status: "Confirmed",
  quantity: 2,
  unitPrice: 599,
  total: 1257.9,
  attendee: {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    phone: "+52 55 1234 5678",
    company: "Tech Solutions SA",
  },
  qrCode: "/placeholder.svg?height=200&width=200",
  seatNumber: "A-15, A-16",
  checkInCode: "CHK2025001",
}

export default function DigitalTicketPage({ params }: { params: { id: string } }) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading digital ticket...")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Digital Ticket - ${mockTicket.eventTitle}`,
        text: `My ticket for ${mockTicket.eventTitle}`,
        url: window.location.href,
      })
    }
  }

  const handleAddToWallet = () => {
    // In a real app, this would generate an Apple Wallet or Google Pay pass
    console.log("Adding to digital wallet...")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Digital Ticket</h1>
              <p className="text-gray-600">Ticket ID: {mockTicket.id}</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={handleAddToWallet}>
                <Smartphone className="h-4 w-4 mr-2" />
                Add to Wallet
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Ticket */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                {/* Ticket Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Image
                        src="/placeholder.svg?height=40&width=120"
                        alt="Q1Eventos"
                        width={120}
                        height={40}
                        className="mb-2"
                      />
                      <Badge className="bg-white/20 text-white border-white/30">{mockTicket.status}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90">Ticket ID</p>
                      <p className="font-mono font-bold">{mockTicket.id}</p>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{mockTicket.eventTitle}</h1>
                  <div className="grid gap-2 text-sm opacity-90">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(mockTicket.eventDate).toLocaleDateString("es-MX", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{mockTicket.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{mockTicket.eventLocation}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Event Image */}
                  <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                    <Image
                      src={mockTicket.eventImage || "/placeholder.svg"}
                      alt={mockTicket.eventTitle}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Attendee Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Attendee Information</h3>
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {mockTicket.attendee.firstName} {mockTicket.attendee.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{mockTicket.attendee.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{mockTicket.attendee.phone}</span>
                      </div>
                      {mockTicket.attendee.company && (
                        <div className="flex items-center gap-3">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span>{mockTicket.attendee.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Ticket Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-2">Ticket Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span>{mockTicket.quantity} tickets</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seat Numbers:</span>
                          <span>{mockTicket.seatNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-in Code:</span>
                          <span className="font-mono">{mockTicket.checkInCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Purchase Date:</span>
                          <span>{new Date(mockTicket.purchaseDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Event Location</h4>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{mockTicket.eventLocation}</p>
                        <p>{mockTicket.eventAddress}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Important Information */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Please arrive 30 minutes before the event starts</li>
                      <li>• Bring a valid ID for verification</li>
                      <li>• This ticket is non-transferable and non-refundable</li>
                      <li>• Present this QR code at the entrance for check-in</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* QR Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Entry QR Code</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mx-auto w-48 h-48 mb-4 bg-white p-4 rounded-lg border">
                    <Image
                      src={mockTicket.qrCode || "/placeholder.svg"}
                      alt="Entry QR Code"
                      width={192}
                      height={192}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Present this QR code at the event entrance</p>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    Ready for Check-in
                  </Badge>
                </CardContent>
              </Card>

              {/* Event Countdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Event Countdown</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {Math.ceil(
                      (new Date(mockTicket.eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </div>
                  <p className="text-sm text-gray-600">until the event</p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    Contact Organizer
                  </Button>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Having issues with your ticket or need assistance?</p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Email:</strong> support@q1eventos.com
                    </p>
                    <p>
                      <strong>Phone:</strong> +52 55 1234 5678
                    </p>
                    <p>
                      <strong>Hours:</strong> Mon-Fri 9AM-6PM
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
