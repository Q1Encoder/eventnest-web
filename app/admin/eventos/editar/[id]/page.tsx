"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  AlertTriangle,
  Eye,
  Edit3,
} from "lucide-react"
import Link from "next/link"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"


// Mock event data - in a real app, this would come from a database
const mockEventData = {
  id: "1",
  title: "Web Development Conference 2025",
  description:
    "Join us for the most comprehensive web development conference of the year. Learn from industry experts, network with peers, and discover the latest trends in web development.",
  date: "2025-03-15",
  startTime: "09:00",
  endTime: "17:00",
  location: "Convention Center Mexico City",
  address: "Av. Conscripto 311, Lomas de Sotelo, Miguel Hidalgo, 11200 Ciudad de México, CDMX",
  capacity: 200,
  price: 599,
  status: "published", // draft, published, cancelled
  category: "technology",
  image: "/placeholder.svg?height=300&width=600",
  agenda: [
    {
      id: "1",
      time: "09:00",
      title: "Registration & Welcome Coffee",
      description: "Check-in and networking with fellow attendees",
      duration: 60,
      speaker: "",
      location: "Main Lobby",
    },
    {
      id: "2",
      time: "10:00",
      title: "Keynote: The Future of Web Development",
      description: "Exploring emerging trends and technologies shaping the future of web development",
      duration: 90,
      speaker: "Dr. Sarah Johnson",
      location: "Main Auditorium",
    },
    {
      id: "3",
      time: "11:30",
      title: "React 19: What's New",
      description: "Deep dive into the latest features and improvements in React 19",
      duration: 90,
      speaker: "Mike Chen",
      location: "Room A",
    },
    {
      id: "4",
      time: "13:00",
      title: "Lunch Break",
      description: "Networking lunch with catered meals",
      duration: 60,
      speaker: "",
      location: "Dining Hall",
    },
    {
      id: "5",
      time: "14:00",
      title: "Next.js Performance Optimization",
      description: "Best practices for optimizing Next.js applications for production",
      duration: 90,
      speaker: "Alex Rodriguez",
      location: "Room B",
    },
  ],
}

interface AgendaItem {
  id: string
  time: string
  title: string
  description: string
  duration: number
  speaker: string
  location: string
}

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false)
  const [currentAgendaItem, setCurrentAgendaItem] = useState<AgendaItem | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    address: "",
    capacity: 0,
    price: 0,
    status: "draft",
    category: "",
    image: "",
  })

  const [agenda, setAgenda] = useState<AgendaItem[]>([])

  // Load event data
  useEffect(() => {
    const loadEventData = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, "events", params.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const eventData = docSnap.data()
          setFormData({
            title: eventData.title || "",
            description: eventData.description || "",
            date: eventData.date || "",
            startTime: eventData.time || "",
            endTime: eventData.endTime || "",
            location: eventData.location || "",
            address: eventData.fullAddress || "",
            capacity: eventData.capacity || 0,
            price: eventData.price || 0,
            status: eventData.status || "draft",
            category: eventData.category || "",
            image: eventData.image || "",
          })
          setAgenda(eventData.agenda || [])
        } else {
          console.error("Evento no encontrado")
        }
      } catch (error) {
        console.error("Error al cargar el evento:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEventData()
  }, [params.id])

  // Handle form changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  // Handle agenda changes
  const handleAgendaChange = (index: number, field: string, value: string | number) => {
    const updatedAgenda = [...agenda]
    updatedAgenda[index] = { ...updatedAgenda[index], [field]: value }
    setAgenda(updatedAgenda)
    setHasChanges(true)
  }

  // Add agenda item
  const addAgendaItem = () => {
    const newItem: AgendaItem = {
      id: Date.now().toString(),
      time: "",
      endTime: "",
      title: "",
      description: "",
      duration: 60,
      speaker: "",
      location: "",
    }
    setAgenda([...agenda, newItem])
    setHasChanges(true)
  }

  // Remove agenda item
  const removeAgendaItem = (index: number) => {
    const updatedAgenda = agenda.filter((_, i) => i !== index)
    setAgenda(updatedAgenda)
    setHasChanges(true)
  }

  // Open agenda modal
  const openAgendaModal = (index: number | null) => {
    if (index === null) {
      setCurrentAgendaItem({
        id: Date.now().toString(),
        time: "",
        endTime: "",
        title: "",
        description: "",
        duration: 60,
        speaker: "",
        location: "",
      })
    } else {
      setCurrentAgendaItem(agenda[index])
    }
    setIsAgendaModalOpen(true)
  }

  // Close agenda modal
  const closeAgendaModal = () => {
    setIsAgendaModalOpen(false)
    setCurrentAgendaItem(null)
  }

  // Save agenda item
  const saveAgendaItem = () => {
    if (currentAgendaItem) {
      const updatedAgenda = [...agenda]
      const index = updatedAgenda.findIndex((item) => item.id === currentAgendaItem.id)
      if (index >= 0) {
        updatedAgenda[index] = currentAgendaItem
      } else {
        updatedAgenda.push(currentAgendaItem)
      }
      setAgenda(updatedAgenda)
      setHasChanges(true)
      closeAgendaModal()
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const docRef = doc(db, "events", params.id)
      await updateDoc(docRef, {
        ...formData,
        agenda,
      })

      console.log("Evento actualizado:", { ...formData, agenda })
      setHasChanges(false)
      router.push("/admin/eventos")
    } catch (error) {
      console.error("Error al actualizar el evento:", error)
    } finally {
      setSaving(false)
    }
  }

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasChanges])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="h-64 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/admin/eventos">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Events
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Edit Event</h1>
                <p className="text-gray-600">Update event details and agenda</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={formData.status === "published" ? "default" : "secondary"}>
                {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
              </Badge>
              <Button variant="outline" asChild>
                <Link href={`/eventos/${params.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
            </div>
          </div>

          {/* Unsaved Changes Alert */}
          {hasChanges && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have unsaved changes. Don't forget to save your work before leaving this page.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left Column - Event Details */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="h-5 w-5" />
                      Event Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Enter event title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        required
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Describe your event"
                        rows={4}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Date & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Event Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time *</Label>
                        <Input
                          id="startTime"
                          type="time"
                          required
                          value={formData.startTime}
                          onChange={(e) => handleInputChange("startTime", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time *</Label>
                        <Input
                          id="endTime"
                          type="time"
                          required
                          value={formData.endTime}
                          onChange={(e) => handleInputChange("endTime", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Venue Name *</Label>
                      <Input
                        id="location"
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Enter venue name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address *</Label>
                      <Textarea
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Enter complete address"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Capacity & Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Maximum Capacity *</Label>
                        <Input
                          id="capacity"
                          type="number"
                          required
                          min="1"
                          value={formData.capacity}
                          onChange={(e) => handleInputChange("capacity", Number.parseInt(e.target.value))}
                          placeholder="Enter max capacity"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Ticket Price (MXN) *</Label>
                        <Input
                          id="price"
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
                          placeholder="Enter ticket price"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Agenda */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Event Agenda
                      </CardTitle>
                      <Button type="button" onClick={() => openAgendaModal(null)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {agenda.length > 0 ? (
                      <table className="w-full border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-200 p-2 text-left">Start Time</th>
                            <th className="border border-gray-200 p-2 text-left">End Time</th>
                            <th className="border border-gray-200 p-2 text-left">Title</th>
                            <th className="border border-gray-200 p-2 text-left">Speaker</th>
                            <th className="border border-gray-200 p-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agenda.map((item, index) => (
                            <tr key={item.id}>
                              <td className="border border-gray-200 p-2">{item.time}</td>
                              <td className="border border-gray-200 p-2">{item.endTime || "N/A"}</td>
                              <td className="border border-gray-200 p-2">{item.title}</td>
                              <td className="border border-gray-200 p-2">{item.speaker || "N/A"}</td>
                              <td className="border border-gray-200 p-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openAgendaModal(index)}
                                >
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No agenda items yet</p>
                        <p className="text-sm">Click "Add Item" to create your first agenda item</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Preview Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{formData.title || "Event Title"}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formData.description || "Event description will appear here"}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formData.date ? new Date(formData.date).toLocaleDateString() : "Date not set"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>
                            {formData.startTime && formData.endTime
                              ? `${formData.startTime} - ${formData.endTime}`
                              : "Time not set"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{formData.location || "Location not set"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{formData.capacity || 0} attendees max</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span>${formData.price || 0} MXN</span>
                        </div>
                      </div>

                      {agenda.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Agenda Preview</h4>
                          <div className="space-y-2">
                            {agenda.slice(0, 3).map((item, index) => (
                              <div key={item.id} className="text-sm p-2 bg-gray-50 rounded">
                                <div className="font-medium">
                                  {item.time || "00:00"} - {item.endTime || "00:00"}: {item.title || `Session ${index + 1}`}
                                </div>
                                {item.speaker && <div className="text-gray-600">by {item.speaker}</div>}
                              </div>
                            ))}
                            {agenda.length > 3 && (
                              <div className="text-sm text-gray-500 text-center">+{agenda.length - 3} more items</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/eventos">Cancel</Link>
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Agenda Item Modal - Edit / Add */}
          {isAgendaModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">
                  {currentAgendaItem?.id ? "Edit Agenda Item" : "Add Agenda Item"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={currentAgendaItem?.time || ""}
                      onChange={(e) =>
                        setCurrentAgendaItem((prev) => ({ ...prev!, time: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={currentAgendaItem?.endTime || ""}
                      onChange={(e) =>
                        setCurrentAgendaItem((prev) => ({ ...prev!, endTime: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      type="text"
                      value={currentAgendaItem?.title || ""}
                      onChange={(e) =>
                        setCurrentAgendaItem((prev) => ({ ...prev!, title: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Speaker</Label>
                    <Input
                      type="text"
                      value={currentAgendaItem?.speaker || ""}
                      onChange={(e) =>
                        setCurrentAgendaItem((prev) => ({ ...prev!, speaker: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <Button variant="outline" onClick={closeAgendaModal}>
                    Cancel
                  </Button>
                  <Button onClick={saveAgendaItem}>Save</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
