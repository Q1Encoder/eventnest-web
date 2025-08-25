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
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useParams } from "next/navigation"


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
  const [isRegistered, setIsRegistered] = useState(false)
  const [registeredCount, setRegisteredCount] = useState(0)

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
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        try {
          // Consulta en la colección "registrations" si el usuario ya está registrado en este evento
          const registrationsQuery = query(
            collection(db, "registrations"),
            where("userId", "==", user.uid),
            where("eventId", "==", params.id)
          )
          const querySnapshot = await getDocs(registrationsQuery)

          // Si hay al menos un documento, significa que el usuario ya está registrado
          if (!querySnapshot.empty) {
            setIsRegistered(true)
          }
        } catch (error) {
          console.error("Error al verificar el registro:", error)
        }
      }
    })

    return () => unsubscribe()
  }, [params.id])

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

                  {!isRegistered && (!currentUser || event.createdBy !== currentUser.uid) && (
                    <Button asChild className="w-full" size="lg">
                      <Link href={`/register/${event.id}`}>Regístrate Ahora</Link>
                    </Button>
                  )}

                  {isRegistered && (
                    <p className="text-center text-sm text-gray-500">
                      Ya estás registrado en este evento.
                    </p>
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
