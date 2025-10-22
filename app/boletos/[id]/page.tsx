"use client"

import { useEffect, useState, useRef } from "react"
import { use } from "react"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, User, Download } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { QRCodeCanvas } from "qrcode.react"
import jsPDF from "jspdf"

interface TicketData {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  eventAddress: string
  eventImage: string
  purchaseDate: string
  status: string
  quantity: number
  unitPrice: number
  total: number
  attendee: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company?: string
  }
  qrCode: string
  seatNumber: string
  checkInCode: string
}

export default function DigitalTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [ticket, setTicket] = useState<TicketData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const qrRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const fetchTicketData = async () => {
      setIsLoading(true)
      try {
        // Fetch reservation data
        const reservationDoc = await getDoc(doc(db, "registrations", id))
        if (!reservationDoc.exists()) {
          throw new Error("Reservation not found")
        }
        const reservationData = reservationDoc.data()

        // Fetch event data
        const eventDoc = await getDoc(doc(db, "events", reservationData.eventId))
        const eventData = eventDoc.exists()
          ? eventDoc.data()
          : { title: "Evento desconocido", image: "/placeholder.svg" }

        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", reservationData.userId))
        const userData = userDoc.exists()
          ? userDoc.data()
          : { firstName: "Usuario", lastName: "", email: "", phone: "" }

        // Construct ticket data
        setTicket({
          id,
          eventId: reservationData.eventId,
          eventTitle: eventData.title || "Evento sin título",
          eventDate: eventData.date || "2025-01-01",
          eventTime: eventData.time || "00:00",
          eventLocation: eventData.location || "Ubicación desconocida",
          eventAddress: eventData.address || "Sin dirección",
          eventImage: eventData.image || "/placeholder.svg",
          purchaseDate: reservationData.createdAt
            ? new Date(reservationData.createdAt).toISOString().split("T")[0]
            : "2025-01-01",
          status: reservationData.confirmed ? "Confirmado" : "Pendiente",
          quantity: reservationData.quantity || 1,
          unitPrice: reservationData.unitPrice || 599,
          total: reservationData.total || reservationData.quantity * reservationData.unitPrice || 599,
          attendee: {
            firstName: userData.firstName || "Usuario",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            company: userData.company,
          },
          qrCode: reservationData.qrCode || "/placeholder.svg?height=200&width=200",
          seatNumber: reservationData.seatNumber || "Sin asignar",
          checkInCode: reservationData.checkInCode || `CHK${id}`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar el boleto. Intenta de nuevo.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTicketData()
  }, [id, toast])

  const handleAddToCalendar = () => {
    console.log("Adding to calendar...")
  }

  const handleGetDirections = () => {
    console.log("Getting directions...")
  }

  const handleContactOrganizer = () => {
    console.log("Contacting organizer...")
  }

  const handleDownloadPDF = () => {
    if (!ticket || !qrRef.current) {
      toast({
        title: "Error",
        description: "No se pudo generar el PDF. Intenta de nuevo.",
        variant: "destructive",
      })
      return
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Setting fonts and colors
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(16)
    pdf.setTextColor(255, 255, 255)
    pdf.setFillColor(59, 130, 246) // Blue from gradient
    pdf.rect(0, 0, 210, 30, "F")
    pdf.text("Boleto Digital", 10, 20)

    // Reset for content
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(12)
    pdf.setFillColor(255, 255, 255)

    // Add event details
    pdf.text(`ID del Boleto: ${ticket.id}`, 10, 40)
    pdf.text(`Evento: ${ticket.eventTitle}`, 10, 50)
    pdf.text(
      `Fecha: ${new Date(ticket.eventDate).toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      10,
      60
    )
    pdf.text(`Hora: ${ticket.eventTime}`, 10, 70)
    pdf.text(`Lugar: ${ticket.eventLocation}`, 10, 80)
    pdf.text(`Dirección: ${ticket.eventAddress}`, 10, 90)

    // Add QR code
    const qrCanvas = qrRef.current
    const qrDataUrl = qrCanvas.toDataURL("image/png")
    pdf.addImage(qrDataUrl, "PNG", 10, 100, 50, 50)

    // Add important information
    pdf.setFontSize(10)
    pdf.setTextColor(133, 77, 14) // Yellow-700 for important info
    pdf.text("Información Importante", 10, 160)
    pdf.text("• Llega 30 minutos antes de que comience el evento", 10, 170)
    pdf.text("• Trae una identificación válida para verificación", 10, 180)
    pdf.text("• Este boleto no es transferible ni reembolsable", 10, 190)
    pdf.text("• Presenta este código QR en la entrada para el check-in", 10, 200)

    // Save PDF
    pdf.save(`boleto-${ticket.id}.pdf`)
  }

  if (isLoading || !ticket) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <div className="bg-gray-200 p-6">
                    <Skeleton className="h-10 w-32 mb-4" />
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <CardContent className="p-6">
                    <Skeleton className="h-48 w-full mb-6" />
                    <Skeleton className="h-6 w-40 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-6" />
                    <Separator className="my-6" />
                    <Skeleton className="h-6 w-40 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-6" />
                    <Separator className="my-6" />
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mx-auto" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-48 w-48 mx-auto mb-4" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mx-auto" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24 mx-auto mb-2" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full mb-3" />
                    <Skeleton className="h-10 w-full mb-3" />
                    <Skeleton className="h-10 w-full" />
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

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Boleto Digital</h1>
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
                      <Badge className="bg-white/20 text-white border-white/30">{ticket.status}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90">ID del Boleto</p>
                      <p className="font-mono font-bold">{ticket.id}</p>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{ticket.eventTitle}</h1>
                  <div className="grid gap-2 text-sm opacity-90">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(ticket.eventDate).toLocaleDateString("es-MX", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{ticket.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{ticket.eventLocation}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Event Image */}
                  <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                    <Image
                      src={ticket.eventImage}
                      alt={ticket.eventTitle}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>

                  <Separator className="my-6" />

                  {/* Ticket Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-2">Ubicación del Evento</h4>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{ticket.eventLocation}</p>
                        <p>{ticket.eventAddress}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Important Information */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Información Importante</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Llega 30 minutos antes de que comience el evento</li>
                      <li>• Trae una identificación válida para verificación</li>
                      <li>• Este boleto no es transferible ni reembolsable</li>
                      <li>• Presenta este código QR en la entrada para el check-in</li>
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
                  <CardTitle className="text-center">Código QR de Entrada</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mx-auto w-48 h-48 mb-4 bg-white p-4 rounded-xl border">
                    <QRCodeCanvas
                      value={ticket.id}
                      size={160}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin={false}
                      ref={qrRef}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Presenta este código QR en la entrada del evento</p>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    Listo para Check-in
                  </Badge>
                </CardContent>
              </Card>

              {/* Event Countdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Cuenta Regresiva del Evento</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {Math.ceil(
                      (new Date(ticket.eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    )}{" "}
                    días
                  </div>
                  <p className="text-sm text-gray-600">hasta el evento</p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleAddToCalendar}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Agregar al Calendario
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleGetDirections}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Obtener Indicaciones
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleContactOrganizer}>
                    <User className="h-4 w-4 mr-2" />
                    Contactar al Organizador
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Boleto como PDF
                  </Button>
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