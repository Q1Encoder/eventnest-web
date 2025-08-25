"use client"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Simulación de datos del usuario y eventos
const mockUser = {
  id: "1",
  firstName: "Juan",
  lastName: "Pérez",
  email: "juan.perez@email.com",
  events: [
    {
      id: "e1",
      name: "Conferencia de Desarrollo Web",
      status: "pending", // pending, approved, rejected
    },
    {
      id: "e2",
      name: "Taller de IA",
      status: "approved",
    },
  ],
}

export default function UserProfilePage() {
  const params = useParams()
  // Aquí deberías buscar el usuario real usando params.id

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">
        Perfil de {mockUser.firstName} {mockUser.lastName}
      </h1>
      <p className="mb-2">Email: {mockUser.email}</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Eventos reservados</h2>
      <div className="space-y-4">
        {mockUser.events.map((event) => (
          <div key={event.id} className="flex items-center gap-4 border p-4 rounded">
            <span className="font-medium">{event.name}</span>
            <Badge variant={
              event.status === "pending" ? "alert" :
              event.status === "approved" ? "secondary" : "outline"
            }>
              {event.status === "pending" ? "Pendiente" : event.status === "approved" ? "Aprobado" : "Rechazado"}
            </Badge>
            {event.status === "pending" && (
              <>
                <Button size="sm" className="ml-2" variant="secondary">
                  Aprobar
                </Button>
                <Button size="sm" className="ml-2" variant="destructive">
                  Rechazar
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}