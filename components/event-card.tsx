"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  price: number
  image: string
  category: string
  capacity: number
  registered: number
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const occupancyPercentage = (event.registered / event.capacity) * 100
  const isAlmostFull = occupancyPercentage >= 80 && occupancyPercentage < 100
  const isFull = occupancyPercentage >= 100
  const router = useRouter()

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleRegisterClick = () => {
    if (user) {
      router.push(`/register/${event.id}`)
    } else {
      router.push("/login")
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative aspect-video">
        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary">{event.category}</Badge>
        </div>
        {isAlmostFull && (
          <div className="absolute top-4 right-4">
            <Badge variant="alert">Casi Lleno</Badge>
          </div>
        )}
        {isFull && (
          <div className="absolute top-4 right-4">
            <Badge variant="destructive">Lleno</Badge>
          </div>
        )}
      </div>

      <CardHeader className="flex-1">
        <h3 className="text-xl font-semibold line-clamp-2 min-h-[3.5rem]">{event.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(event.date).toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })} a {event.time}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {event.registered}/{event.capacity} registrados
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <DollarSign className="h-4 w-4" />
          <span>${event.price} MXN</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
            <Link href={`/eventos/${event.id}`}>Ver Detalles</Link>
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-gradient-primary-secondary hover:bg-gradient-primary-secondary-dark"
            disabled={isFull}
            onClick={handleRegisterClick}
          >
            Registrar
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
