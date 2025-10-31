"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Award,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  CheckSquare,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams, useRouter } from "next/navigation"

// === INTERFACES ===
interface UserData {
  uid: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  avatar?: string
}

interface EventData {
  title: string
  date?: string
  time?: string
  location?: string
  address?: string
  image?: string
}

interface Reservation {
  id: string
  userId: string
  eventId: string
  confirmed: boolean
  eventTitle: string
  eventDate?: string
  eventTime?: string
  eventLocation?: string
  eventAddress?: string
  eventImage: string
}

interface AttendedEvent {
  id: string
  eventTitle: string
  eventDate?: string
  eventTime?: string
  eventLocation?: string
  eventAddress?: string
  eventImage: string
  checkInTime?: string
  ticketId: string
  status: "completed"
}

// === REUSABLE EVENT CARD ===
const EventCard = ({
  item,
  type,
  getStatusIcon,
  getStatusBadge,
  showViewButton = true,
  hasCheckIn,
}: {
  item: Reservation | AttendedEvent
  type: "reservation" | "attended"
  getStatusIcon: (status: string) => React.ReactNode
  getStatusBadge: (status: string) => React.ReactNode
  showViewButton?: boolean
  hasCheckIn: boolean
}) => {
  const status = hasCheckIn ? "completed" : "pending"

  return (
    <div className="flex items-center gap-4 p-4 bg-white border rounded-lg">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          status === "pending" ? "bg-yellow-100 border-yellow-200" : "bg-green-100 border-green-200"
        }`}
      >
        {getStatusIcon(status)}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold">{item.eventTitle}</h4>
        <p className="text-sm text-gray-600">
          Fecha: {item.eventDate ? new Date(item.eventDate).toLocaleDateString() : "Sin fecha"}
        </p>
        {type === "attended" && "checkInTime" in item && (
          <p className="text-sm text-gray-600">
            Check-in: {item.checkInTime ? new Date(item.checkInTime).toLocaleString() : "Sin datos"}
          </p>
        )}
        <div className="text-sm font-medium">{getStatusBadge(status)}</div>
      </div>
      {showViewButton && hasCheckIn && (
        <Button size="sm" asChild>
          <Link href={`/boletos/${item.id}`}>
            Ver Boleto
          </Link>
        </Button>
      )}
    </div>
  )
}

// === MAIN DASHBOARD PAGE ===
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("events")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  const eventCache = new Map<string, EventData>()

  // === ACTIVAR TAB DESDE URL (Soporta: events, history, certificates) ===
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "events") setActiveTab("events")
    else if (tab === "history") setActiveTab("history")
    else if (tab === "certificates") setActiveTab("certificates")
    else if (!tab) setActiveTab("events") // Default

    // Limpiar URL
    if (tab) router.replace("/dashboard", { scroll: false })
  }, [searchParams, router])

  // === AUTH & DATA LISTENERS ===
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true)
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserData({
              ...userDoc.data(),
              uid: user.uid,
              email: user.email,
            } as UserData)
          } else {
            setUserData({
              name: user.displayName || user.email || "User",
              email: user.email || "",
              uid: user.uid,
            })
          }

          // === RESERVATIONS (registrations) ===
          const reservationsQuery = query(
            collection(db, "registrations"),
            where("userId", "==", user.uid)
          )
          onSnapshot(reservationsQuery, async (snapshot) => {
            const reservationsData = await Promise.all(
              snapshot.docs.map(async (reservationDoc) => {
                const data = reservationDoc.data()
                let eventData: EventData | undefined
                if (eventCache.has(data.eventId)) {
                  eventData = eventCache.get(data.eventId)
                } else {
                  const eventDoc = await getDoc(doc(db, "events", data.eventId))
                  eventData = eventDoc.exists()
                    ? (eventDoc.data() as EventData)
                    : { title: "Evento Desconocido", image: "/placeholder.svg" }
                  eventCache.set(data.eventId, eventData)
                }
                return {
                  id: reservationDoc.id,
                  ...data,
                  eventTitle: eventData?.title ?? "Evento sin título",
                  eventDate: eventData?.date,
                  eventTime: eventData?.time,
                  eventLocation: eventData?.location,
                  eventAddress: eventData?.address,
                  eventImage: eventData?.image || "/placeholder.svg",
                } as Reservation
              })
            )
            setReservations(reservationsData)
          })

          // === ATTENDED EVENTS (assistance + check-in) ===
          const assistanceQuery = query(collection(db, "assistance"), where("checkIn", "==", true))
          onSnapshot(assistanceQuery, async (snapshot) => {
            const attendedEventsData = await Promise.all(
              snapshot.docs.map(async (assistanceDoc) => {
                const data = assistanceDoc.data()
                const registrationDoc = await getDoc(doc(db, "registrations", data.ticket))
                const registrationData = registrationDoc.data() as { userId: string; eventId: string }
                if (registrationDoc.exists() && registrationData.userId === user.uid) {
                  let eventData: EventData | undefined
                  if (eventCache.has(registrationData.eventId)) {
                    eventData = eventCache.get(registrationData.eventId)
                  } else {
                    const eventDoc = await getDoc(doc(db, "events", registrationData.eventId))
                    eventData = eventDoc.exists()
                      ? (eventDoc.data() as EventData)
                      : { title: "Evento Desconocido", image: "/placeholder.svg" }
                    eventCache.set(registrationData.eventId, eventData)
                  }
                  return {
                    id: data.ticket,
                    eventTitle: eventData?.title || "Evento sin título",
                    eventDate: eventData?.date,
                    eventTime: eventData?.time,
                    eventLocation: eventData?.location,
                    eventAddress: eventData?.address,
                    eventImage: eventData?.image || "/placeholder.svg",
                    checkInTime: data.checkInTime,
                    ticketId: data.ticket,
                    status: "completed" as const,
                  } as AttendedEvent
                }
                return null
              })
            )
            setAttendedEvents(attendedEventsData.filter((event): event is AttendedEvent => event !== null))
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudieron cargar los datos.",
            variant: "destructive",
          })
        }
      } else {
        setUserData(null)
        setReservations([])
        setAttendedEvents([])
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [toast])

  // === FILTER: Approved = has check-in, Pending = no check-in ===
  const approvedReservations = reservations.filter((reservation) =>
    attendedEvents.some((attended) => attended.ticketId === reservation.id)
  )

  const pendingReservations = reservations.filter((reservation) =>
    !attendedEvents.some((attended) => attended.ticketId === reservation.id)
  )

  // === STATUS HELPERS ===
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completado</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // === LOADING SKELETON ===
  if (isLoading || !userData) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Tabs defaultValue="events">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="events">Eventos</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
                <TabsTrigger value="certificates">Certificados</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // === MAIN RENDER ===
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                <AvatarFallback>
                  {(userData?.name || userData?.email || "U").split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  ¡Hola, {(userData?.firstName || userData?.email || "Usuario").split(" ")[0]}!
                </h1>
              </div>
            </div>
          </div>

          {/* TABS PRINCIPALES */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Eventos
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Historial
              </TabsTrigger>
              <TabsTrigger value="certificates" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certificados
              </TabsTrigger>
            </TabsList>

            {/* === EVENTOS (Pendientes + Aprobados) === */}
            <TabsContent value="events">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Pendientes */}
                {pendingReservations.length > 0 && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-800">
                        <Clock className="h-5 w-5" />
                        Pendientes de Check-in ({pendingReservations.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pendingReservations.map((reservation) => (
                          <EventCard
                            key={reservation.id}
                            item={reservation}
                            type="reservation"
                            getStatusIcon={getStatusIcon}
                            getStatusBadge={getStatusBadge}
                            showViewButton={false}
                            hasCheckIn={false}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Aprobados */}
                {approvedReservations.length > 0 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-5 w-5" />
                        Aprobados ({approvedReservations.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {approvedReservations.map((reservation) => (
                          <EventCard
                            key={reservation.id}
                            item={reservation}
                            type="reservation"
                            getStatusIcon={getStatusIcon}
                            getStatusBadge={getStatusBadge}
                            showViewButton={true}
                            hasCheckIn={true}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Sin eventos */}
                {reservations.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No tienes eventos registrados</p>
                      <Button asChild className="mt-4">
                        <Link href="/eventos">Explorar Eventos</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* === HISTORIAL (Eventos asistidos) === */}
            <TabsContent value="history">
              <div className="space-y-6">
                {attendedEvents.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Eventos Asistidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        {attendedEvents.map((event) => (
                          <div key={event.id} className="border rounded-lg p-4">
                            <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                              <Image
                                src={event.eventImage}
                                alt={event.eventTitle}
                                width={400}
                                height={225}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <EventCard
                              item={event}
                              type="attended"
                              getStatusIcon={getStatusIcon}
                              getStatusBadge={getStatusBadge}
                              hasCheckIn={true}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Aún no has asistido a ningún evento</p>
                      <Button asChild className="mt-4">
                        <Link href="/eventos">Explorar Eventos</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* === CERTIFICADOS === */}
            <TabsContent value="certificates">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Mis Certificados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const { CERTIFICATE_TEMPLATES } = require("@/lib/certificateConfig")
                    const certifiableEvents = attendedEvents.filter((event) =>
                      CERTIFICATE_TEMPLATES[event.eventTitle]
                    )

                    if (certifiableEvents.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No hay certificados disponibles</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Completa eventos con check-in para obtener tu certificado
                          </p>
                        </div>
                      )
                    }

                    return (
                      <div className="grid gap-4 md:grid-cols-2">
                        {certifiableEvents.map((event) => {
                          const basePdfPath = CERTIFICATE_TEMPLATES[event.eventTitle]
                          const fullName =
                            `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||
                            userData?.email ||
                            "Participante"
                          const fileName = `Certificado - ${fullName}.pdf`

                          return (
                            <div key={event.id} className="border rounded-lg p-6">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                  <Award className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold">{event.eventTitle}</h3>
                                </div>
                              </div>

                              <Button
                                className="w-full"
                                onClick={async () => {
                                  try {
                                    const { generateCertificatePDF } = await import("@/lib/generateCertificatePDF")
                                    const pdfBlob = await generateCertificatePDF(fullName, basePdfPath)
                                    const url = URL.createObjectURL(pdfBlob)
                                    const link = document.createElement("a")
                                    link.href = url
                                    link.download = fileName
                                    link.click()
                                    URL.revokeObjectURL(url)
                                    toast({
                                      title: "¡Certificado descargado!",
                                      description: `Generado: ${fileName}`,
                                    })
                                  } catch (error) {
                                    toast({
                                      title: "No disponible",
                                      description: "El certificado aún no está listo.",
                                      variant: "destructive",
                                    })
                                  }
                                }}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Descargar Certificado
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}