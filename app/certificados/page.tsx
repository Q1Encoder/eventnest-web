import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Eye, Award, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for attended events
const attendedEvents = [
  {
    id: "1",
    title: "Web Development Conference 2024",
    date: "2024-11-15",
    location: "Convention Center Mexico City",
    image: "/placeholder.svg?height=150&width=300",
    status: "Completed",
    attendanceRate: 95,
    certificateAvailable: true,
    completionDate: "2024-11-15",
  },
  {
    id: "2",
    title: "Digital Marketing Summit 2024",
    date: "2024-10-20",
    location: "Business Center Guadalajara",
    image: "/placeholder.svg?height=150&width=300",
    status: "Completed",
    attendanceRate: 88,
    certificateAvailable: true,
    completionDate: "2024-10-20",
  },
  {
    id: "3",
    title: "AI & Machine Learning Workshop",
    date: "2024-09-10",
    location: "Tech Hub Monterrey",
    image: "/placeholder.svg?height=150&width=300",
    status: "Completed",
    attendanceRate: 92,
    certificateAvailable: true,
    completionDate: "2024-09-10",
  },
  {
    id: "4",
    title: "Data Science Bootcamp",
    date: "2024-08-05",
    location: "University Campus Tijuana",
    image: "/placeholder.svg?height=150&width=300",
    status: "Completed",
    attendanceRate: 78,
    certificateAvailable: false, // Below 80% attendance threshold
    completionDate: "2024-08-05",
  },
]

export default function CertificatesPage() {
  const availableCertificates = attendedEvents.filter((event) => event.certificateAvailable)
  const totalEvents = attendedEvents.length
  const averageAttendance = Math.round(
    attendedEvents.reduce((sum, event) => sum + event.attendanceRate, 0) / totalEvents,
  )

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
            <p className="text-gray-600">Download and manage your event completion certificates</p>
          </div>

          {/* Statistics */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Events Attended</p>
                    <p className="text-2xl font-bold">{totalEvents}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Certificates Available</p>
                    <p className="text-2xl font-bold">{availableCertificates.length}</p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                    <p className="text-2xl font-bold">{averageAttendance}%</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certificates Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {attendedEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-40">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={event.certificateAvailable ? "secondary" : "outline"}
                      className={
                        event.certificateAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                      }
                    >
                      {event.certificateAvailable ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{event.title}</h3>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Attendance: {event.attendanceRate}%</span>
                    </div>
                  </div>

                  {event.certificateAvailable ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/certificados/generar/${event.id}`}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/certificados/preview/${event.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <p className="text-xs text-green-600 text-center">
                        Certificate earned on {new Date(event.completionDate).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Button disabled size="sm" className="w-full">
                        <Award className="h-4 w-4 mr-2" />
                        Not Available
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Minimum 80% attendance required</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {attendedEvents.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
                <p className="text-gray-600 mb-6">Attend events and maintain good attendance to earn certificates</p>
                <Button asChild>
                  <Link href="/eventos">Browse Events</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Certificate Requirements */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificate Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Minimum 80% attendance rate</li>
                    <li>• Complete event registration</li>
                    <li>• Participate in required activities</li>
                    <li>• Submit feedback form (if applicable)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Certificate Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Official Q1Eventos certification</li>
                    <li>• Digital signature and verification</li>
                    <li>• PDF format for easy sharing</li>
                    <li>• Unique certificate ID</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
