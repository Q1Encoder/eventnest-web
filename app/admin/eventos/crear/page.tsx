"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { ArrowLeft, Save, Calendar, MapPin, Users, DollarSign, Plus, Trash2, Clock } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  longDescription: z.string().min(20, "Long description must be at least 20 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  fullAddress: z.string().min(10, "Full address must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(1, "Price is required"),
  image: z.string().optional(),
  capacity: z.number().min(1, "Capacity is required"),
  organizer: z.string().min(3, "Organizer is required"),
  agenda: z.array(z.any()).optional(),
  speakers: z.array(z.any()).optional(),
})

const defaultValues = {
  title: "",
  description: "",
  longDescription: "",
  date: "",
  time: "",
  endTime: "",
  location: "",
  fullAddress: "",
  category: "",
  price: 0,
  image: "",
  capacity: 0,
  organizer: "",
}

const mockEvent = {
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
export default function CreateEvent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agenda, setAgenda] = useState([{ time: "", endTime: "", title: "", speaker: "", description: "" }])
  const [speakers, setSpeakers] = useState([{ name: "", role: "", avatar: "" }])
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      date: "",
      time: "",
      endTime: "",
      location: "",
      fullAddress: "",
      category: "",
      price: 0,
      image: "",
      capacity: 0,
      organizer: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("SI ENTRO AQUI")
    if (
      agenda.length === 0 ||
      agenda.some(item => !item.time || !item.endTime || !item.title) ||
      speakers.length === 0 ||
      speakers.some(item => !item.name || !item.role)
    ) {
      alert("Por favor, completa todos los campos obligatorios de agenda y ponentes.")
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(true)
    try {
      const auth = getAuth()
      const currentUser = auth.currentUser

      const eventData = {
        ...values,
        agenda,
        speakers,
        registered: 0,
        createdAt: new Date().toISOString(),
        createdBy: currentUser ? currentUser.uid : null,
      }

      await addDoc(collection(db, "events"), eventData)
      setIsSubmitting(false)
      router.push("/admin/eventos")
    } catch (error) {
      setIsSubmitting(false)
      alert("Error al crear el evento: " + (error as Error).message)
    }
  }

  const addAgendaItem = () => {
    setAgenda([...agenda, { time: "", endTime: "", title: "", speaker: "", description: "" }])
  }

  const removeAgendaItem = (index: number) => {
    if (agenda.length > 1) {
      setAgenda(agenda.filter((_, i) => i !== index))
    }
  }

  const updateAgendaItem = (index: number, field: string, value: string) => {
    const updatedAgenda = agenda.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setAgenda(updatedAgenda)
  }

  const addSpeaker = () => {
    setSpeakers([...speakers, { name: "", role: "", avatar: "" }])
  }

  const removeSpeaker = (index: number) => {
    if (speakers.length > 1) {
      setSpeakers(speakers.filter((_, i) => i !== index))
    }
  }

  const updateSpeaker = (index: number, field: string, value: string) => {
    const updated = speakers.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setSpeakers(updated)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button variant="outline" asChild className="mb-4 bg-transparent">
              <Link href="/admin/eventos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
            <p className="text-gray-600">Fill in the information to create a new event</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Web Development Conference 2025" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the event, what it includes, objectives, etc."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="longDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Long Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide a detailed description of the event"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Convention Center, Mexico City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fullAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Av. Paseo de la Reforma 999, CDMX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="science">Science</SelectItem>
                                <SelectItem value="art">Art & Culture</SelectItem>
                                <SelectItem value="health">Health</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (MXN)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="500"
                                  {...field}
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="capacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Capacity</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="150"
                                  {...field}
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}/>
                        </div>

                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="organizer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Organizer</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Event Agenda</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addAgendaItem}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Activity
                            </Button>
                          </div>

                          <div className="space-y-4">
                            {agenda.map((item, index) => (
                              <Card key={index} className="p-4">
                                <div className="flex items-start justify-between mb-4">
                                  <h4 className="font-medium">Activity {index + 1}</h4>
                                  {agenda.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeAgendaItem(index)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Start Time</label>
                                    <Input
                                      type="time"
                                      value={item.time}
                                      onChange={(e) => updateAgendaItem(index, "time", e.target.value)}
                                      placeholder="10:00"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">End Time</label>
                                    <Input
                                      type="time"
                                      value={item.endTime}
                                      onChange={(e) => updateAgendaItem(index, "endTime", e.target.value)}
                                      placeholder="11:00"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Activity Title</label>
                                    <Input
                                      value={item.title}
                                      onChange={(e) => updateAgendaItem(index, "title", e.target.value)}
                                      placeholder="Ex: Keynote speech"
                                    />
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <label className="text-sm font-medium mb-2 block">Speaker/Responsible</label>
                                  <Input
                                    value={item.speaker}
                                    onChange={(e) => updateAgendaItem(index, "speaker", e.target.value)}
                                    placeholder="Ex: Dr. John Doe"
                                  />
                                </div>

                                <div className="mt-4">
                                  <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                                  <Textarea
                                    value={item.description}
                                    onChange={(e) => updateAgendaItem(index, "description", e.target.value)}
                                    placeholder="Brief description of the activity..."
                                    className="min-h-[80px]"
                                  />
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4 mt-8">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Speakers</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addSpeaker}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Speaker
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {speakers.map((item, index) => (
                              <Card key={index} className="p-4">
                                <div className="flex items-start justify-between mb-4">
                                  <h4 className="font-medium">Speaker {index + 1}</h4>
                                  {speakers.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeSpeaker(index)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Name</label>
                                    <Input
                                      value={item.name}
                                      onChange={(e) => updateSpeaker(index, "name", e.target.value)}
                                      placeholder="Ex: Dr. John Doe"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Role/Topic</label>
                                    <Input
                                      value={item.role}
                                      onChange={(e) => updateSpeaker(index, "role", e.target.value)}
                                      placeholder="Ex: Keynote Speaker"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Avatar URL (optional)</label>
                                    <Input
                                      value={item.avatar}
                                      onChange={(e) => updateSpeaker(index, "avatar", e.target.value)}
                                      placeholder="https://example.com/avatar.jpg"
                                    />
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                          <Button type="submit" disabled={isSubmitting} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Creating..." : "Create Event"}
                          </Button>
                          <Button type="button" variant="outline" asChild>
                            <Link href="/admin/eventos">Cancel</Link>
                          </Button>
                        </div>
                      </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Event Image</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Event date and time</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>Event location</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Max capacity</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>Ticket price</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Agenda Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agenda.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-500 min-w-0">
                          <Clock className="h-3 w-3" />
                          <span>
                            {item.time || "00:00"} - {item.endTime || "00:00"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.title || "Untitled activity"}</p>
                          {item.speaker && <p className="text-gray-500 truncate">{item.speaker}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Speakers Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {speakers.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <span className="font-medium">{item.name || "Unnamed"}</span>
                        <span className="text-gray-500">{item.role}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li>• Use a descriptive and attractive title</li>
                    <li>• Include all important details in the description</li>
                    <li>• Verify that the date and time are correct</li>
                    <li>• Make sure the capacity is realistic</li>
                    <li>• Consider costs when setting the price</li>
                    <li>• Add detailed agenda with time slots</li>
                  </ul>
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
