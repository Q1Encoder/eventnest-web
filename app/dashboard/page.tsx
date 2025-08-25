"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  MapPin,
  Clock,
  Award,
  Download,
  Eye,
  Ticket,
  TrendingUp,
  Star,
  Edit,
  Settings,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock user data
const userMockData = {
  name: "Juan Pérez",
  email: "juan.perez@email.com",
  avatar: "/placeholder.svg?height=80&width=80",
  joinDate: "2024-01-15",
  totalEvents: 12,
  totalSpent: 6750,
  points: 1250,
  level: "Gold",
}

// Mock user events with different statuses
const userEvents = [
  {
    id: "1",
    title: "Web Development Conference 2025",
    date: "2025-03-15",
    time: "09:00",
    location: "Convention Center Mexico City",
    status: "confirmed", // confirmed, pending, cancelled
    ticketId: "TKT-2025-001",
    price: 599,
    image: "/placeholder.svg?height=200&width=300",
    paymentStatus: "paid",
    registrationDate: "2025-01-15",
  },
  {
    id: "2",
    title: "Digital Marketing Summit",
    date: "2025-04-20",
    time: "10:00",
    location: "Business Center Guadalajara",
    status: "pending",
    ticketId: "TKT-2025-002",
    price: 450,
    image: "/placeholder.svg?height=200&width=300",
    paymentStatus: "pending",
    registrationDate: "2025-01-18",
  },
  {
    id: "3",
    title: "AI & Machine Learning Workshop",
    date: "2024-12-10",
    time: "14:00",
    location: "Tech Hub Monterrey",
    status: "completed",
    ticketId: "TKT-2024-003",
    price: 750,
    image: "/placeholder.svg?height=200&width=300",
    rating: 4,
    certificateAvailable: true,
    paymentStatus: "paid",
    registrationDate: "2024-11-15",
  },
  {
    id: "4",
    title: "UX Design Bootcamp",
    date: "2024-11-25",
    time: "09:00",
    location: "Design Studio CDMX",
    status: "completed",
    ticketId: "TKT-2024-004",
    price: 899,
    image: "/placeholder.svg?height=200&width=300",
    rating: 5,
    certificateAvailable: true,
    paymentStatus: "paid",
    registrationDate: "2024-10-20",
  },
]

// Mock certificates
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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState<any>(userMockData)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Obtén datos adicionales desde Firestore si los tienes guardados ahí
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          // Si tienes más datos del usuario en Firestore, úsalos
          console.log("Datos del usuario desde Firestore:", userDoc.data())
          setUserData(userDoc.data())
        } else {
          // Si no tienes más datos, usa los del auth

          console.log("El susuario",user)
          setUserData({
            name: user.displayName || user.email,
            email: user.email,
          })
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const upcomingEvents = userEvents.filter((event) => new Date(event.date) > new Date() && event.status !== "cancelled")
  const completedEvents = userEvents.filter((event) => event.status === "completed")
  const pendingEvents = userEvents.filter((event) => event.status === "pending")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Payment</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Loader mientras se obtienen los datos del usuario
  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span>Cargando datos del usuario...</span>
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
                </h1>                {/* <p className="text-gray-600">Miembro desde {new Date(userData.joinDate).toLocaleDateString()}</p> */}
              </div>
            </div>
            {/* <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
            </div> */}
          </div>

          {/* Stats Cards */}
          {/* <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Eventos Asistidos</p>
                    <p className="text-2xl font-bold">{(userData.totalEvents ?? 0).toLocaleString()}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Gastado</p>
                    <p className="text-2xl font-bold">${(userData.totalSpent ?? 0).toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Puntos de Recompensa</p>
                    <p className="text-2xl font-bold">{(userData.points ?? 0).toLocaleString()}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nivel de Membresía</p>
                    <p className="text-2xl font-bold">{userData.level}</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div> */}

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              {/* <TabsTrigger value="events">Mis Eventos</TabsTrigger>
              <TabsTrigger value="certificates">Certificados</TabsTrigger>
              <TabsTrigger value="profile">Perfil</TabsTrigger> */}
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Upcoming Events */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Eventos Próximos ({upcomingEvents.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingEvents.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                          <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                              <Image
                                src={event.image || "/placeholder.svg"}
                                alt={event.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{event.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{event.time}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                {getStatusIcon(event.status)}
                                {getStatusBadge(event.status)}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/boletos/${event.ticketId}`}>
                                  <Ticket className="h-4 w-4 mr-2" />
                                  Ver Boleto
                                </Link>
                              </Button>
                              {event.status === "pending" && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/ficha-pago/${event.ticketId}`}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Comprobante de Pago
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No hay eventos próximos</p>
                        <Button asChild className="mt-4">
                          <Link href="/eventos">Explorar Eventos</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card> */}

                {/* Pending Payments */}
                {pendingEvents.length > 0 && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-800">
                        <AlertCircle className="h-5 w-5" />
                        {/* Pagos Pendientes ({pendingEvents.length}) */}
                        Pendientes de Aprovación ({pendingEvents.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pendingEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center gap-4 p-4 bg-white border border-yellow-200 rounded-lg"
                          >
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <AlertCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{event.title}</h4>
                              <p className="text-sm text-gray-600">
                                {/* Registrado el {new Date(event.registrationDate).toLocaleDateString()} */}
                              </p>
                              <p className="text-sm text-yellow-700 font-medium">
                                Pago requerido para confirmar la inscripción
                              </p>
                            </div>
                            <Button size="sm" asChild>
                              <Link href={`/ficha-pago/${event.ticketId}`}>
                                <Download className="h-4 w-4 mr-2" />
                                Pagar Ahora
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Activity */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Actividad Reciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {completedEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Award className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-gray-600">
                              Finalizado el {new Date(event.date).toLocaleDateString()} 
                            </p>
                            {event.rating && (
                              <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < event.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                      }`}
                                  />
                                ))}
                                <span className="text-sm text-gray-600 ml-1">({event.rating}/5)</span>
                              </div>
                            )}
                          </div>
                          {event.certificateAvailable && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/certificados/generar/${event.id}`}>
                                <Download className="h-4 w-4 mr-2" />
                                Certificado
                              </Link>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="space-y-6">
                {/* Upcoming Events */}
                {upcomingEvents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Eventos Próximos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        {upcomingEvents.map((event) => (
                          <div key={event.id} className="border rounded-lg p-4">
                            <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                              <Image
                                src={event.image || "/placeholder.svg"}
                                alt={event.title}
                                width={400}
                                height={225}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className="font-semibold mb-2">{event.title}</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(event.date).toLocaleDateString()} at {event.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Ticket className="h-4 w-4" />
                                <span>Ticket ID: {event.ticketId}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3 mb-4">
                              {getStatusIcon(event.status)}
                              {getStatusBadge(event.status)}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                                <Link href={`/eventos/${event.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalles
                                </Link>
                              </Button>
                              <Button size="sm" asChild className="flex-1">
                                <Link href={`/boletos/${event.ticketId}`}>
                                  <Ticket className="h-4 w-4 mr-2" />
                                  Ver Boleto
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Pending Events */}
                {pendingEvents.length > 0 && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="text-yellow-800">Pending Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        {pendingEvents.map((event) => (
                          <div key={event.id} className="bg-white border border-yellow-200 rounded-lg p-4">
                            <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                              <Image
                                src={event.image || "/placeholder.svg"}
                                alt={event.title}
                                width={400}
                                height={225}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className="font-semibold mb-2">{event.title}</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(event.date).toLocaleDateString()} at {event.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Ticket className="h-4 w-4" />
                                <span>Ticket ID: {event.ticketId}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3 mb-4">
                              {getStatusIcon(event.status)}
                              {getStatusBadge(event.status)}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                                <Link href={`/ficha-pago/${event.ticketId}`}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Payment Slip
                                </Link>
                              </Button>
                              <Button size="sm" asChild className="flex-1">
                                <Link href={`/eventos/${event.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Event
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Completed Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {completedEvents.map((event) => (
                        <div key={event.id} className="border rounded-lg p-4">
                          <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                            <Image
                              src={event.image || "/placeholder.svg"}
                              alt={event.title}
                              width={400}
                              height={225}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="font-semibold mb-2">{event.title}</h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(event.date).toLocaleDateString()} at {event.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            {event.rating && (
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4" />
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${i < event.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                        }`}
                                    />
                                  ))}
                                  <span className="ml-1">({event.rating}/5)</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-3 mb-4">
                            {getStatusIcon(event.status)}
                            {getStatusBadge(event.status)}
                          </div>
                          <div className="flex gap-2">
                            {event.certificateAvailable && (
                              <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                                <Link href={`/certificados/generar/${event.id}`}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Certificate
                                </Link>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                              <Link href={`/boletos/${event.ticketId}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Ticket
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="certificates">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    My Certificates ({userCertificates.length})
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
                                Issued on {new Date(cert.issueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-4">Certificate ID: {cert.certificateId}</div>
                          <Button asChild className="w-full">
                            <Link href={`/certificados/generar/${cert.eventId}`}>
                              <Download className="h-4 w-4 mr-2" />
                              Download Certificate
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No certificates available</p>
                      <p className="text-sm text-gray-500 mt-2">Complete events to earn certificates</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                        <AvatarFallback>
                          {(userData?.name || userData?.email || "Usuario")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{userData.name}</h3>
                        <p className="text-gray-600">{userData.email}</p>
                        <Badge variant="secondary" className="mt-2">
                          {userData.level} Member
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Member since</span>
                        <span className="text-sm text-gray-600">
                          {new Date(userData.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Events attended</span>
                        <span className="text-sm text-gray-600">{(userData.totalEvents ?? 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Total spent</span>
                        <span className="text-sm text-gray-600">${(userData.totalSpent ?? 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Reward points</span>
                        <span className="text-sm text-gray-600">{(userData.points ?? 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Membership Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Current Level: {userData.level}</span>
                        <span className="text-sm text-gray-600">Next: Platinum</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-gray-500 mt-2">Attend 3 more events to reach Platinum level</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Membership Benefits</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Early access to event registration
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          10% discount on all events
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Priority customer support
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span className="text-gray-400">VIP networking sessions (Platinum)</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
