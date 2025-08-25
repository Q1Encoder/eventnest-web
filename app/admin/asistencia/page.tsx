"use client"
import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Search, Filter, CheckCircle, Clock, Download, Users } from "lucide-react"

const attendanceRecords = [
  {
    id: "1",
    eventTitle: "Web Development Conference 2025",
    eventDate: "2025-03-15",
    attendeeName: "John Doe",
    attendeeEmail: "john@example.com",
    ticketId: "TKT-2025-001",
    checkInTime: "2025-03-15T09:15:00",
    status: "Checked In",
  },
  {
    id: "2",
    eventTitle: "Web Development Conference 2025",
    eventDate: "2025-03-15",
    attendeeName: "Jane Smith",
    attendeeEmail: "jane@example.com",
    ticketId: "TKT-2025-002",
    checkInTime: "2025-03-15T09:22:00",
    status: "Checked In",
  },
  {
    id: "3",
    eventTitle: "Web Development Conference 2025",
    eventDate: "2025-03-15",
    attendeeName: "Mike Johnson",
    attendeeEmail: "mike@example.com",
    ticketId: "TKT-2025-003",
    checkInTime: null,
    status: "Registered",
  },
  {
    id: "4",
    eventTitle: "Digital Marketing Summit",
    eventDate: "2025-04-20",
    attendeeName: "Sarah Wilson",
    attendeeEmail: "sarah@example.com",
    ticketId: "TKT-2025-004",
    checkInTime: null,
    status: "Registered",
  },
]

export default function AdminAttendancePage() {
  const [scannerActive, setScannerActive] = useState(false)
  const [scannedCode, setScannedCode] = useState("")

  const handleQRScan = () => {
    setScannerActive(!scannerActive)
    // In a real app, this would activate the camera for QR scanning
    if (!scannerActive) {
      alert("QR Scanner activated! In a real app, this would open the camera.")
    }
  }

  const handleManualCheckIn = (ticketId: string) => {
    // In a real app, this would update the attendance record
    alert(`Manual check-in for ticket ${ticketId}`)
  }

  const handleExportAttendance = () => {
    // In a real app, this would generate and download attendance report
    alert("Exporting attendance report...")
  }

  const checkedInCount = attendanceRecords.filter((record) => record.status === "Checked In").length
  const totalRegistered = attendanceRecords.length

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Attendance Control</h1>
              <p className="text-gray-600">Manage event check-ins and attendance tracking</p>
            </div>
            <div className="flex gap-2">
              <Button variant={scannerActive ? "destructive" : "default"} onClick={handleQRScan}>
                <QrCode className="h-4 w-4 mr-2" />
                {scannerActive ? "Stop Scanner" : "QR Scanner"}
              </Button>
              <Button variant="outline" onClick={handleExportAttendance}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Registered</p>
                    <p className="text-2xl font-bold">{totalRegistered}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Checked In</p>
                    <p className="text-2xl font-bold">{checkedInCount}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold">{totalRegistered - checkedInCount}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                    <p className="text-2xl font-bold">{Math.round((checkedInCount / totalRegistered) * 100)}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {scannerActive && (
            <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">QR Code Scanner Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Scan QR code or enter ticket ID manually..."
                      value={scannedCode}
                      onChange={(e) => setScannedCode(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => handleManualCheckIn(scannedCode)}>Check In</Button>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                  Point the camera at a QR code or enter the ticket ID manually
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search by name, email, or ticket ID..." className="pl-10" />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="web-conf">Web Development Conference</SelectItem>
                    <SelectItem value="marketing-summit">Digital Marketing Summit</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="checked-in">Checked In</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Records ({attendanceRecords.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{record.attendeeName}</h3>
                        <Badge
                          variant={record.status === "Checked In" ? "secondary" : "outline"}
                          className={
                            record.status === "Checked In"
                              ? "text-green-600 bg-green-50"
                              : "text-orange-600 bg-orange-50"
                          }
                        >
                          {record.status === "Checked In" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {record.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span>{record.attendeeEmail}</span>
                        <span>Ticket: {record.ticketId}</span>
                        <span>{record.eventTitle}</span>
                        <span>{new Date(record.eventDate).toLocaleDateString()}</span>
                        {record.checkInTime && (
                          <span>Checked in: {new Date(record.checkInTime).toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {record.status === "Registered" ? (
                        <Button size="sm" onClick={() => handleManualCheckIn(record.ticketId)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Check In
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Checked In
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
