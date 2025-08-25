"use client"

import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, User, Mail, Phone, Building, Download, Printer, Share2 } from "lucide-react"
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
  serviceFee: 59.9,
  total: 1257.9,
  paymentMethod: "Bank Transfer",
  attendee: {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    phone: "+52 55 1234 5678",
    company: "Tech Solutions SA",
  },
  bankDetails: {
    bank: "BBVA México",
    account: "0123456789",
    clabe: "012345678901234567",
    reference: "Q1EVT2025001",
  },
  qrCode: "/placeholder.svg?height=150&width=150",
}

export default function PaymentSlipPage({ params }: { params: { ticketId: string } }) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading payment slip...")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Payment Slip - ${mockTicket.eventTitle}`,
        text: `Payment slip for ${mockTicket.eventTitle}`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Payment Slip</h1>
              <p className="text-gray-600">Ticket ID: {mockTicket.id}</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
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
            {/* Main Payment Slip */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="text-center border-b">
                  <div className="mx-auto mb-4">
                    <Image
                      src="/placeholder.svg?height=60&width=200"
                      alt="Q1Eventos"
                      width={200}
                      height={60}
                      className="mx-auto"
                    />
                  </div>
                  <CardTitle className="text-xl">Payment Slip</CardTitle>
                  <p className="text-sm text-gray-600">Please use this information to complete your bank transfer</p>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Event Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                    <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={mockTicket.eventImage || "/placeholder.svg"}
                        alt={mockTicket.eventTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{mockTicket.eventTitle}</h4>
                    <div className="grid gap-2 text-sm text-gray-600">
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

                  <Separator className="my-6" />

                  {/* Bank Transfer Details */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Bank Transfer Information</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="grid gap-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Bank:</span>
                          <span>{mockTicket.bankDetails.bank}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Account Number:</span>
                          <span className="font-mono">{mockTicket.bankDetails.account}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">CLABE:</span>
                          <span className="font-mono">{mockTicket.bankDetails.clabe}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-red-600">Payment Reference:</span>
                          <span className="font-mono font-bold text-red-600">{mockTicket.bankDetails.reference}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-red-600 mt-2 font-medium">
                      ⚠️ Important: Include the payment reference in your transfer to ensure proper processing
                    </p>
                  </div>

                  <Separator className="my-6" />

                  {/* Price Breakdown */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>
                          Tickets ({mockTicket.quantity}x ${mockTicket.unitPrice})
                        </span>
                        <span>${(mockTicket.quantity * mockTicket.unitPrice).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Service fee</span>
                        <span>${mockTicket.serviceFee.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span>${mockTicket.total.toFixed(2)} MXN</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Attendee Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Attendee Information</h3>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>
                          {mockTicket.attendee.firstName} {mockTicket.attendee.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{mockTicket.attendee.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{mockTicket.attendee.phone}</span>
                      </div>
                      {mockTicket.attendee.company && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span>{mockTicket.attendee.company}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Payment Status</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="outline" className="mb-4 text-orange-600 border-orange-200 bg-orange-50">
                    Pending Payment
                  </Badge>
                  <p className="text-sm text-gray-600 mb-4">Complete your bank transfer to confirm your registration</p>
                  <div className="text-xs text-gray-500">
                    <p>Purchase Date: {new Date(mockTicket.purchaseDate).toLocaleDateString()}</p>
                    <p>Ticket ID: {mockTicket.id}</p>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Quick Access</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mx-auto w-32 h-32 mb-4">
                    <Image
                      src={mockTicket.qrCode || "/placeholder.svg"}
                      alt="QR Code"
                      width={128}
                      height={128}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Scan this QR code for quick access to your ticket information</p>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <p>Make a bank transfer using the details provided</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <p>Include the payment reference in your transfer</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <p>Your tickets will be sent via email once payment is confirmed</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <p>Processing time: 1-2 business days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    If you have questions about your payment or need assistance:
                  </p>
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
