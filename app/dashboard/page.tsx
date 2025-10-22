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
import { Calendar, MapPin, Clock, Award, Download, Eye, Ticket, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

// Interfaces para tipado
interface UserData {
  uid: string
  email: string
  firstName?: string
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

// Mock certificates (intacto como pediste)
const userCertificates = [
  {
    id: "1",
    eventTitle: "AI & Machine Learning Workshop",
    issueDate: "2024-12-11",
    certificateId: "CERT-2024-003",
    eventId: "3",
  },
  {
    id: "2",
    eventTitle: "UX Design Bootcamp",
    issueDate: "2024-11-26",
    certificateId: "CERT-2024-004",
    eventId: "4",
  },
]

// Componente reutilizable para tarjetas de eventos/reservas
const EventCard = ({
  item,
  type,
  getStatusIcon,
  getStatusBadge,
}: {
  item: Reservation | AttendedEvent
  type: "reservation" | "attended"
  getStatusIcon: (status: string) => React.ReactNode
  getStatusBadge: (status: string) => React.ReactNode
}) => {
  const status = "status" in item ? item.status : item.confirmed ? "confirmed" : "pending"

  return (
    <div className="flex items-center gap-4 p-4 bg-white border rounded-lg">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          type === "reservation" && "confirmed" in item && !item.confirmed
            ? "bg-yellow-100 border-yellow-200"
            : "bg-green-100 border-green-200"
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
        <div className="text-sm font-medium">
          {getStatusBadge(status)}
        </div>
      </div>
      {(type === "reservation" && "confirmed" in item && item.confirmed) || type === "attended" ? (
        <Button size="sm" asChild>
          <Link href={type === "reservation" ? `/boletos/${item.id}` : `/eventos/${item.id}`}>
            {type === "reservation" ? "Ver Boleto" : "Ver Evento"}
          </Link>
        </Button>
      ) : null}
    </div>
  )
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Cache para evitar múltiples consultas a /events
  const eventCache = new Map<string, EventData>()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true)
      if (user) {
        try {
          // Obtener datos del usuario desde /users
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserData({
              ...userDoc.data(),
              uid: user.uid,
              email: user.email,
            } as UserData)
          } else {
            setUserData({
              name: user.displayName || user.email || "Usuario",
              email: user.email || "",
              uid: user.uid,
            })
          }

          // Escuchar reservas en tiempo real desde /registrations
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
                    : { title: "Evento desconocido", image: "/placeholder.svg" }
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
          }, (error) => {
            toast({
              title: "Error",
              description: "No se pudieron cargar las reservas. Intenta de nuevo.",
              variant: "destructive",
            })
          })

          // Escuchar eventos con check-in desde /assistance
          const assistanceQuery = query(
            collection(db, "assistance"),
            where("checkIn", "==", true)
          )
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
                      : { title: "Evento desconocido", image: "/placeholder.svg" }
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
          }, (error) => {
            toast({
              title: "Error",
              description: "No se pudieron cargar los eventos asistidos. Intenta de nuevo.",
              variant: "destructive",
            })
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "Error al cargar datos del usuario. Intenta de nuevo.",
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

  // Filtrar reservas pendientes y aprobadas
  const pendingReservations = reservations.filter((reservation) => !reservation.confirmed)
  const approvedReservations = reservations.filter((reservation) => reservation.confirmed)

  // Funciones para íconos y badges de estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmado</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente de Aprobación</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelado</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Loader con skeleton
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
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full mb-4" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full mb-4" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
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
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                <AvatarFallback>
                  {(userData?.name || userData?.email || "Usuario")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  Bienvenido de nuevo, {(userData?.firstName || userData?.email || "Usuario").split(" ")[0]}!
                </h1>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="events">Mis Eventos</TabsTrigger>
              <TabsTrigger value="certificates">Certificados</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Pendientes de Aprobación */}
                {pendingReservations.length > 0 && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-800">
                        <AlertCircle className="h-5 w-5" />
                        Pendientes de Aprobación ({pendingReservations.length})
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
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Mensaje si no hay reservas */}
                {pendingReservations.length === 0 && approvedReservations.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No hay reservas registradas</p>
                      <Button asChild className="mt-4">
                        <Link href="/eventos">Explorar Eventos</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="space-y-6">
                {/* Eventos Asistidos (Check-in) */}
                {attendedEvents.length > 0 && (
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
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Mensaje si no hay eventos asistidos */}
                {attendedEvents.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No has asistido a eventos aún</p>
                      <Button asChild className="mt-4">
                        <Link href="/eventos">Explorar Eventos</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="certificates">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Mis Certificados ({userCertificates.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userCertificates.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {userCertificates.map((cert) => (
                        <div key={cert.id} className="border rounded-lg p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <Award className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{cert.eventTitle}</h3>
                              <p className="text-sm text-gray-600">
                                Emitido el {new Date(cert.issueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-4">ID Certificado: {cert.certificateId}</div>
                          <Button asChild className="w-full">
                            <Link href={`/certificados/generar/${cert.eventId}`}>
                              <Download className="h-4 w-4 mr-2" />
                              Descargar Certificado
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No hay certificados disponibles</p>
                      <p className="text-sm text-gray-500 mt-2">Completa eventos para obtener certificados</p>
                    </div>
                  )}
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