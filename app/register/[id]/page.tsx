"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type React from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, MapPin, Users, Shield, AlertCircle } from "lucide-react"
import Image from "next/image"

// Mock event data
const mockEvent = {
  //   id: "1",
  //   title: "Web Development Conference 2025",
  //   date: "2025-03-15",
  //   time: "09:00",
  //   location: "Convention Center Mexico City",
  //   price: 599,
  //   image: "/placeholder.svg?height=200&width=400",
  //   capacity: 200,
  //   registered: 150,
  // },

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

}

export default function PurchasePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    specialRequests: "",
    agreeToTerms: false,
  })

  const subtotal = mockEvent.price * quantity
  const serviceFee = subtotal * 0.05 // 5% service fee
  // const total = subtotal + serviceFee
  const total = subtotal // No service fee for now

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const auth = getAuth()
      const currentUser = auth.currentUser

      if (!currentUser) {
        alert("Debes iniciar sesión para completar el registro.")
        setProcessing(false)
        return
      }

      // Obtener los datos del evento desde Firebase
      const eventDocRef = doc(db, "events", params.id)
      const eventDoc = await getDoc(eventDocRef)

      if (!eventDoc.exists()) {
        alert("El evento no existe.")
        setProcessing(false)
        return
      }

      const eventData = eventDoc.data()

      // Crear el registro en Firebase
      const registrationData = {
        userId: currentUser.uid,
        eventId: params.id,
        eventOwnerId: eventData.createdBy || "unknown", // Asignar el ownerId del evento
        confirmed: true,
      }

      await addDoc(collection(db, "registrations"), registrationData)

      // Redirigir al dashboard del usuario
      router.push("/dashboard")
    } catch (error) {
      console.error("Error al completar el registro:", error)
      alert("Hubo un error al completar el registro. Por favor, inténtalo de nuevo.")
    } finally {
      setProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const availableSpots = mockEvent.capacity - mockEvent.registered

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const userData = userDoc.data()
            setFormData((prev) => ({
              ...prev,
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              email: userData.email || user.email || "",
              phone: userData.phone || "",
              company: userData.company || "",
            }))
          }
        } catch (error) {
          console.error("Error al cargar los datos del usuario:", error)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Registro de Evento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Ticket Quantity */}
                    {/* <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Seleccionar Boletos</h3>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Admisión General</p>
                          <p className="text-sm text-gray-600">${mockEvent.price} MXN</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setQuantity(Math.min(availableSpots, quantity + 1))}
                            disabled={quantity >= availableSpots}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Maximo {Math.min(5, availableSpots)} boletos por registro
                      </p>
                    </div> */}

                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Información Personal</h3>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nombre *</Label>
                          <Input
                            id="firstName"
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            placeholder="Enter your first name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Apellido *</Label>
                          <Input
                            id="lastName"
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter your email address"
                        />
                        {/* <p className="text-xs text-gray-500">Your tickets will be sent to this email address</p> */}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa/Organización</Label>
                        <Input
                          id="company"
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          placeholder="Ingresa tu empresa (opcional)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialRequests">Solicitudes Especiales</Label>
                        <Input
                          id="specialRequests"
                          type="text"
                          value={formData.specialRequests}
                          onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                          placeholder="Necesidades de accesibilidad, etc. (opcional)"
                        />
                      </div>
                    </div>

                    {/* Payment Method Info */}
                    {/* <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Método de Pago</h3>

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          El pago se procesa mediante transferencia bancaria. Recibirá un comprobante de pago con sus datos bancarios tras completar el registro.
                        </AlertDescription>
                      </Alert>

                      <div className="p-4 border rounded-lg bg-blue-50">
                        <h4 className="font-medium mb-2">Pago por Transferencia Bancaria</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Completa el registro para recibir los detalles de pago</li>
                          <li>• Transfiere la cantidad exacta a la cuenta proporcionada</li>
                          <li>• Incluye la referencia de pago en tu transferencia</li>
                          <li>• Tus boletos serán confirmados en un plazo de 1-2 días hábiles</li>
                        </ul>
                      </div>
                    </div> */}

                    {/* Terms and Conditions */}
                    {/* <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                          }
                        />
                        <Label htmlFor="agreeToTerms" className="text-sm">
                          Acepto los términos y condiciones y la política de cancelación
                        </Label>
                      </div>
                    </div> */}
                    {/* 
                    <Button type="submit" className="w-full" size="lg" disabled={!formData.agreeToTerms || processing}>
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Procesando Registro...
                        </>
                      ) : (
                        `Completar Registro - $${total.toFixed(2)} MXN`
                      )}
                    </Button> */}
                    <Button type="submit" className="w-full" size="lg" disabled={processing}>
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Procesando Registro...
                        </>
                      ) : (
                        `Completar Registro`
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Event Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Evento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={mockEvent.image || "/placeholder.svg"}
                      alt={mockEvent.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">{mockEvent.title}</h4>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(mockEvent.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{mockEvent.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{mockEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{availableSpots} lugares disponibles</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Breakdown */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Resumen de Precios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Boletos ({quantity}x)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {/* <div className="flex justify-between text-sm text-gray-600">
                      <span>Tarifa de servicio</span>
                      <span>${serviceFee.toFixed(2)}</span>
                    </div> 
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)} MXN</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Pago seguro protegido por SSL</span>
                  </div>
                </CardContent>
              </Card> */}

              {/* Availability Alert */}
              {availableSpots <= 20 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        Disponibilidad Limitada
                      </Badge>
                    </div>
                    <p className="text-sm text-orange-700 mt-2">
                      Solo quedan {availableSpots} boletos. ¡Regístrate ahora para asegurar tu lugar!
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Payment Process Info */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Próximos Pasos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <p>Completa este formulario de registro</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <p>Recibe el comprobante de pago con los datos bancarios</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <p>Realiza la transferencia bancaria con la referencia de pago</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <p>Recibe tus boletos digitales por correo electrónico</p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

                <Card>
                <CardHeader>
                  <CardTitle>Próximos Pasos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <p>Completa este formulario de registro</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <p>Espera la confirmacion de tu registro</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <p>Recibe tu boleto digital en la seccion de boletos</p>
                    </div>
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
