"use client"
import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Download, Share2, Award, User, Building, CheckCircle } from "lucide-react"
import Image from "next/image"

// Mock data - in a real app, this would come from a database
const mockCertificate = {
  id: "CERT-2024-001",
  eventId: "1",
  eventTitle: "Web Development Conference 2024",
  eventDate: "2024-11-15",
  eventLocation: "Convention Center Mexico City",
  eventDuration: "8 hours",
  eventOrganizer: "Q1Eventos",
  completionDate: "2024-11-15",
  attendanceRate: 95,
  attendee: {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    company: "Tech Solutions SA",
  },
  certificateNumber: "Q1E-WDC-2024-001",
  issueDate: "2024-11-16",
  verificationUrl: "https://q1eventos.com/verify/CERT-2024-001",
}

export default function GenerateCertificatePage({ params }: { params: { id: string } }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleGenerateCertificate = async () => {
    setIsGenerating(true)
    // Simulate certificate generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    setIsGenerated(true)
  }

  const handleDownload = () => {
    // In a real app, this would download the actual PDF certificate
    console.log("Downloading certificate...")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate - ${mockCertificate.eventTitle}`,
        text: `I've completed ${mockCertificate.eventTitle} and earned a certificate!`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Certificate Generator</h1>
            <p className="text-gray-600">Generate your completion certificate</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Certificate Preview */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <div className="text-center">
                    <Award className="h-12 w-12 mx-auto mb-4" />
                    <CardTitle className="text-2xl">Certificate of Completion</CardTitle>
                    <p className="opacity-90">Q1Eventos Professional Development</p>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  {/* Certificate Content */}
                  <div className="text-center mb-8">
                    <div className="mb-6">
                      <Image
                        src="/placeholder.svg?height=80&width=200"
                        alt="Q1Eventos"
                        width={200}
                        height={80}
                        className="mx-auto"
                      />
                    </div>

                    <h2 className="text-3xl font-bold mb-4">Certificate of Completion</h2>
                    <p className="text-lg text-gray-600 mb-6">This is to certify that</p>

                    <div className="border-b-2 border-gray-300 pb-2 mb-6">
                      <h3 className="text-2xl font-bold text-blue-600">
                        {mockCertificate.attendee.firstName} {mockCertificate.attendee.lastName}
                      </h3>
                    </div>

                    <p className="text-lg text-gray-600 mb-2">has successfully completed</p>
                    <h4 className="text-xl font-semibold mb-6">{mockCertificate.eventTitle}</h4>

                    <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-600 mb-8">
                      <div>
                        <p>
                          <strong>Event Date:</strong>{" "}
                          {new Date(mockCertificate.eventDate).toLocaleDateString("es-MX", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p>
                          <strong>Duration:</strong> {mockCertificate.eventDuration}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Location:</strong> {mockCertificate.eventLocation}
                        </p>
                        <p>
                          <strong>Attendance:</strong> {mockCertificate.attendanceRate}%
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="text-left">
                        <div className="border-t border-gray-300 pt-2">
                          <p className="text-sm font-semibold">Q1Eventos</p>
                          <p className="text-xs text-gray-500">Event Organizer</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <Image
                          src="/placeholder.svg?height=60&width=60"
                          alt="Official Seal"
                          width={60}
                          height={60}
                          className="mx-auto mb-2"
                        />
                        <p className="text-xs text-gray-500">Official Seal</p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500">Issue Date</p>
                        <p className="text-sm font-semibold">
                          {new Date(mockCertificate.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-2">
                        Certificate Number: {mockCertificate.certificateNumber}
                      </p>
                      <p className="text-xs text-gray-500">Verify at: {mockCertificate.verificationUrl}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Generation Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certificate Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!isGenerated ? (
                    <div className="text-center">
                      <Badge variant="outline" className="mb-4">
                        Ready to Generate
                      </Badge>
                      <p className="text-sm text-gray-600 mb-4">
                        Your certificate is ready to be generated. Click the button below to create your official
                        certificate.
                      </p>
                      <Button onClick={handleGenerateCertificate} disabled={isGenerating} className="w-full">
                        {isGenerating ? "Generating..." : "Generate Certificate"}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Badge className="bg-green-100 text-green-800 mb-4">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Generated
                      </Badge>
                      <p className="text-sm text-gray-600 mb-4">
                        Your certificate has been successfully generated and is ready for download.
                      </p>
                      <div className="space-y-2">
                        <Button onClick={handleDownload} className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" onClick={handleShare} className="w-full bg-transparent">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Certificate
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {new Date(mockCertificate.eventDate).toLocaleDateString("es-MX", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>{mockCertificate.eventLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Organized by {mockCertificate.eventOrganizer}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Attendee Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendee Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>
                    <p>
                      {mockCertificate.attendee.firstName} {mockCertificate.attendee.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p>{mockCertificate.attendee.email}</p>
                  </div>
                  {mockCertificate.attendee.company && (
                    <div>
                      <span className="font-medium">Company:</span>
                      <p>{mockCertificate.attendee.company}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Attendance Rate:</span>
                    <p className="text-green-600 font-semibold">{mockCertificate.attendanceRate}%</p>
                  </div>
                </CardContent>
              </Card>

              {/* Certificate Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Official Q1Eventos certification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Unique certificate number
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Online verification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      High-quality PDF format
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Professional design
                    </li>
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
