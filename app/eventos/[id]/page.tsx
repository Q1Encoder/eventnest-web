"use client"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Users, DollarSign, Share2, Heart, Speaker } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useParams } from "next/navigation"

// Mock data - in a real app, this would come from a database
const mockEvent = {
  id: "1",
  title: "XX CONGRESO NACIONAL Y 6TO CONGRESO INTERNACIONAL DE DERECHO",
  description:
    "Horizontes Jurídicos Transformando el Derecho",
  longDescription: `
    Únete al congreso "Horizontes Jurídicos: Transformando el Derecho", un espacio dedicado a la reflexión y análisis de los temas más relevantes y actuales del ámbito jurídico. Este evento reúne a expertos, académicos y profesionales para discutir los retos y oportunidades que enfrenta el derecho en un mundo en constante cambio.
    A través de ponencias y paneles, se abordarán temas como la reforma electoral, los derechos humanos, los avances tecnológicos y su impacto en el derecho, así como innovaciones en el ámbito forense.
    ¡Sé parte de las conversaciones que están transformando el futuro del derecho!
  `,
  date: "2025-10-28",
  time: "08:00",
  endTime: "19:00",
  location: "Teatro de la Ciudad, La Paz B.C.S.",
  fullAddress: "Antonio Navarro e/ Altamirano y H, de Independencia Centro, Zona Central, 23000 La Paz, B.C.S.",
  price: 350,
  image: "/portadaDerecho.png?height=400&width=800",
  category: "Derecho",
  capacity: 1143,
  registered: 0,
  organizer: "Universidad Autónoma de Baja California Sur, Campus La Paz",
  speakers: [
    { name: "Dr. David Cienfuegos Salgado", role: "El Derecho Frente al Suicidio: Abordaje Frente a los Derechos Humanos", avatar: "/david-cienfuegos.png?height=60&width=60" },
    { name: "Dra. Lizbeth Xóchitl Padilla Sanabria", role: "La Inteligencia Artificial desde la Operatividad de los Derechos Humanos", avatar: "/lizbeth-xochitl.png?height=60&width=60" },
    {
      name: "Dr. Baldomero Mendoza López",
      role: "La Representación Proporcional en México ante la Nueva Reforma Electoral",
      avatar: "/baldomero-mendoza.png?height=60&width=60",
    },
    {
      name: "Dra. Carla Pratt Corzo",
      role: "Prisión Preventiva Oficiosa",
      avatar: "/carla-pratt.png?height=60&width=60",
    },
    {
      name: "Dr. Alejandro Hernández Cardenas Rodríguez",
      role: "Rehidratación de Tejidos Blandos Presentes en Cadáveres Momificados y Reversión de Procesos Avanzados de Putrefacción con Fines Forenses de Identificación y Determinación de Causas de Muerte",
      avatar: "/alejandro-hernandez.png?height=60&width=60",
    },
  ],
  agenda: [
    { time: "08:00", endTime: "09:00", title: "Registro" },
    { time: "09:00", endTime: "09:30", title: "Sesión Inaugural" },
    { time: "09:30", endTime: "09:40", title: "Receso" },
    { time: "09:40", endTime: "10:30", title: "La Representación Proporcional en México ante la Nueva Refroma Electoral", speaker: "Dr. Baldomero Mendoza López" },
    { time: "10:30", endTime: "10:50", title: "Ronda de Preguntas" },
    { time: "10:50", endTime: "11:40", title: "La Inteligencia Artificial desde la Operatividad de los Derechos Humanos", speaker: "Dra. Lizbeth Xóchitl Padilla Sanabria" },
    { time: "11:40", endTime: "12:00", title: "Ronda de Preguntas" },
    { time: "12:00", endTime: "12:50", title: "Prisión Preventiva Oficiosa", speaker: "Dra. Carla Pratt Corzo" },
    { time: "12:50", endTime: "13:10", title: "Ronda de Preguntas" },
    { time: "13:10", endTime: "16:10", title: "Receso" },
    { time: "16:10", endTime: "17:00", title: "El Derecho Frente al Suicidio: Abordaje Frente a los Derechos Humanos", speaker: "Dr. David Cienfuegos Salgado" },
    { time: "17:00", endTime: "17:20", title: "Ronda de Preguntas" },
    { time: "17:20", endTime: "18:10", title: "Rehidratación de Tejidos Blandos Presentes en Cadáveres Momificados y Reversión de Procesos Avanzados de Putrefacción con Fines Forenses de Identificación y Determinación de Causas de Muerte", speaker: "Dr. Alejandro Hernández Cardenas Rodríguez" },
    { time: "18:10", endTime: "18:30", title: "Ronda de Preguntas" },
    { time: "18:30", endTime: "18:50", title: "Clausura" },
  ],
}

interface Speaker {
  name: string
  role: string
  avatar?: string
}

interface Agenda {
  time: string
  endTime: string
  title: string
  speaker: string
}

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Cargar evento desde Firebase
    async function fetchEvent() {
      setLoading(true)
      const docRef = doc(db, "events", params.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setEvent({ id: docSnap.id, ...docSnap.data() })
      }
      setLoading(false)
    }
    fetchEvent()
  }, [params.id])

  useEffect(() => {
    // Detectar usuario autenticado
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])

  // const availableSpots = event.capacity - event.registered
    const availableSpots = event?.capacity

  const isAlmostFull = availableSpots <= 20

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span>Cargando evento...</span>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span>Evento no encontrado.</span>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image */}
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Event Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{event.category.charAt(0).toUpperCase() + event.category.slice(1)}</Badge>
                  {isAlmostFull && <Badge variant="destructive">Almost Full</Badge>}
                </div>
                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{event.description}</p>

                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {capitalizeFirstLetter(
                          new Date(event.date + "T00:00:00").toLocaleDateString("es-MX", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">
                        {event.time} - {event.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">{event.location}</p>
                      <p className="text-sm text-gray-500">{event.fullAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">{event.registered} registrados</p>
                      <p className="text-sm text-gray-500">{availableSpots} lugares disponibles</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Descripción del evento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{event.longDescription}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Speakers */}
              <Card>
                <CardHeader>
                  <CardTitle>Ponentes Destacados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {event.speakers?.map((speaker: Speaker, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <Image
                          src={speaker.avatar || "/placeholder.svg"}
                          alt={speaker.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold">{speaker.name}</h4>
                          <p className="text-sm text-gray-600">{speaker.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Agenda */}
              <Card>
                <CardHeader>
                  <CardTitle>Agenda del Evento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.agenda?.map((item: Agenda, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-28 text-sm font-medium text-gray-500 flex-shrink-0">
                          {item.time} {item.endTime && <>- {item.endTime}</>}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          {item.speaker && (
                            <p className="text-sm text-gray-500">Ponente: {item.speaker}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Registro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">${event.price}</p>
                    <p className="text-sm text-gray-500">MXN por persona</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lugares disponibles:</span>
                      <span className={isAlmostFull ? "text-red-600 font-medium" : "text-green-600"}>
                        {availableSpots}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  {(!currentUser || event.createdBy !== currentUser.uid) && (
                    <Button asChild className="w-full" size="lg">
                      <Link href={`/register/${event.id}`}>Regístrate Ahora</Link>
                    </Button>
                  )}

                  {/* <p className="text-xs text-gray-500 text-center">Pago seguro • Confirmación instantánea</p> */}
                </CardContent>
              </Card>

              {/* Organizer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Organizado por</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* <p className="font-medium">{event.organizer}</p> */}
                  <p className="text-sm text-gray-600 mt-2">{event.organizer}</p>
                </CardContent>
              </Card>

              {/* Location Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Localización</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Mapa Interactivo</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{event.fullAddress}</p>
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
