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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

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

// === REUSABLE EVENT CARD (CORREGIDO) ===
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
          Date: {item.eventDate ? new Date(item.eventDate).toLocaleDateString() : "No date"}
        </p>
        {type === "attended" && "checkInTime" in item && (
          <p className="text-sm text-gray-600">
            Check-in: {item.checkInTime ? new Date(item.checkInTime).toLocaleString() : "No data"}
          </p>
        )}
        <div className="text-sm font-medium">{getStatusBadge(status)}</div>
      </div>
      {showViewButton && hasCheckIn && (
        <Button size="sm" asChild>
          <Link href={`/boletos/${item.id}`}>
            View Ticket
          </Link>
        </Button>
      )}
    </div>
  )
}

// === MAIN DASHBOARD PAGE ===
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const eventCache = new Map<string, EventData>()

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
                    : { title: "Unknown Event", image: "/placeholder.svg" }
                  eventCache.set(data.eventId, eventData)
                }
                return {
                  id: reservationDoc.id,
                  ...data,
                  eventTitle: eventData?.title ?? "Untitled Event",
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
                      : { title: "Unknown Event", image: "/placeholder.svg" }
                    eventCache.set(registrationData.eventId, eventData)
                  }
                  return {
                    id: data.ticket,
                    eventTitle: eventData?.title || "Untitled Event",
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
            description: "Failed to load user data.",
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

  // === STATUS HELPERS (CORREGIDOS) ===
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Check-in</Badge>
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
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader><Skeleton className="h-6 w-64" /></CardHeader>
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
                  {(userData?.name || userData?.email || "User").split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {(userData?.firstName || userData?.email || "User").split(" ")[0]}!
                </h1>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">My Events</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>

            {/* === OVERVIEW TAB === */}
            <TabsContent value="overview">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Pending Check-in */}
                {pendingReservations.length > 0 && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-800">
                        <AlertCircle className="h-5 w-5" />
                        Pending Check-in ({pendingReservations.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pendingReservations.map((reservation) => {
                          const hasCheckIn = attendedEvents.some((attended) => attended.ticketId === reservation.id)
                          return (
                            <EventCard
                              key={reservation.id}
                              item={reservation}
                              type="reservation"
                              getStatusIcon={getStatusIcon}
                              getStatusBadge={getStatusBadge}
                              showViewButton={false}
                              hasCheckIn={hasCheckIn}
                            />
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Approved (with check-in) */}
                {approvedReservations.length > 0 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-5 w-5" />
                        Approved ({approvedReservations.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {approvedReservations.map((reservation) => {
                          const hasCheckIn = true
                          return (
                            <EventCard
                              key={reservation.id}
                              item={reservation}
                              type="reservation"
                              getStatusIcon={getStatusIcon}
                              getStatusBadge={getStatusBadge}
                              showViewButton={true}
                              hasCheckIn={hasCheckIn}
                            />
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* No reservations */}
                {pendingReservations.length === 0 && approvedReservations.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No reservations registered</p>
                      <Button asChild className="mt-4">
                        <Link href="/eventos">Explore Events</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* === EVENTS TAB === */}
            <TabsContent value="events">
              <div className="space-y-6">
                {attendedEvents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Attended Events</CardTitle>
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
                )}

                {attendedEvents.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">You haven't attended any events yet</p>
                      <Button asChild className="mt-4">
                        <Link href="/eventos">Explore Events</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* === CERTIFICATES TAB: Only with check-in === */}
            <TabsContent value="certificates">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    My Certificates
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
                          <p className="text-gray-600">No certificates available</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Complete events with check-in to earn your certificate
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
                            "Participant"
                          const fileName = `Certificate - ${fullName}.pdf`

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
                                      title: "Certificate downloaded!",
                                      description: `Generated: ${fileName}`,
                                    })
                                  } catch (error) {
                                    toast({
                                      title: "Not available",
                                      description: "The certificate is not ready yet.",
                                      variant: "destructive",
                                    })
                                  }
                                }}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Certificate
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