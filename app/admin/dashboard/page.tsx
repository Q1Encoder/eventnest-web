"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  UserCheck,
  CreditCard,
  Award,
  BarChart3,
  PieChartIcon,
  Play,
  Pause,
  RotateCcw,
  Clock,
  MapPin,
  Wifi,
  WifiOff,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"

// Mock real-time event data
const mockLiveEvent = {
  id: "live-event-1",
  title: "Web Development Conference 2025",
  date: "2025-03-15",
  startTime: "09:00",
  endTime: "18:00",
  location: "Convention Center Mexico City",
  status: "Live",
  totalRegistered: 200,
  currentAttendees: 185,
  agenda: [
    { id: 1, time: "09:00", title: "Registration & Welcome Coffee", duration: 30, status: "completed" },
    {
      id: 2,
      time: "09:30",
      title: "Opening Keynote: The Future of Web Development",
      duration: 60,
      status: "completed",
    },
    { id: 3, time: "10:30", title: "Modern React Patterns and Best Practices", duration: 60, status: "active" },
    { id: 4, time: "11:30", title: "Coffee Break", duration: 30, status: "upcoming" },
    { id: 5, time: "12:00", title: "Building Scalable APIs with Node.js", duration: 60, status: "upcoming" },
    { id: 6, time: "13:00", title: "Lunch Break", duration: 60, status: "upcoming" },
    { id: 7, time: "14:00", title: "Database Design for Modern Applications", duration: 60, status: "upcoming" },
    { id: 8, time: "15:00", title: "DevOps and Continuous Deployment", duration: 60, status: "upcoming" },
    { id: 9, time: "16:00", title: "Coffee Break", duration: 30, status: "upcoming" },
    { id: 10, time: "16:30", title: "Web Security: Protecting Your Applications", duration: 60, status: "upcoming" },
    { id: 11, time: "17:30", title: "Closing Remarks & Networking", duration: 30, status: "upcoming" },
  ],
}

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isConnected, setIsConnected] = useState(true)
  const [testTime, setTestTime] = useState<Date | null>(null)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(testTime || new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [testTime])

  // Example data for statistics
  const stats = {
    totalEvents: 12,
    totalUsers: 1247,
    monthlyRevenue: 125000,
    averageAttendance: 85.2,
    pendingEvents: 3,
    activeUsers: 892,
    pendingPayments: 23,
    certificatesIssued: 456,
  }

  // Mock events data
  const mockEvents = [
    {
      id: "1",
      title: "Web Development Conference 2025",
      date: "2025-03-15",
      time: "09:00",
      location: "Convention Center Mexico City",
      status: "Published",
      registered: 150,
      capacity: 200,
      revenue: 89400,
    },
    {
      id: "2",
      title: "Digital Marketing Summit",
      date: "2025-04-20",
      time: "10:00",
      location: "Business Center Guadalajara",
      status: "Draft",
      registered: 89,
      capacity: 150,
      revenue: 40050,
    },
    {
      id: "3",
      title: "AI & Machine Learning Workshop",
      date: "2025-05-10",
      time: "14:00",
      location: "Tech Hub Monterrey",
      status: "Published",
      registered: 67,
      capacity: 100,
      revenue: 50250,
    },
  ]

  // Data for charts
  const salesByMonth = [
    { month: "Jan", sales: 45000, events: 8 },
    { month: "Feb", sales: 52000, events: 10 },
    { month: "Mar", sales: 48000, events: 9 },
    { month: "Apr", sales: 61000, events: 12 },
    { month: "May", sales: 55000, events: 11 },
    { month: "Jun", sales: 67000, events: 14 },
  ]

  const attendanceByEvent = [
    { event: "Web Conf.", attendees: 120, capacity: 150 },
    { event: "AI Workshop", attendees: 85, capacity: 100 },
    { event: "Data Symp.", attendees: 200, capacity: 250 },
    { event: "Digital Mkt.", attendees: 95, capacity: 120 },
    { event: "Blockchain", attendees: 75, capacity: 80 },
  ]

  const categoryDistribution = [
    { name: "Technology", value: 45, color: "#10B981" },
    { name: "Business", value: 25, color: "#3B82F6" },
    { name: "Education", value: 20, color: "#F59E0B" },
    { name: "Science", value: 10, color: "#EF4444" },
  ]

  const dailyRevenue = [
    { day: "1", revenue: 2500 },
    { day: "2", revenue: 3200 },
    { day: "3", revenue: 2800 },
    { day: "4", revenue: 4100 },
    { day: "5", revenue: 3600 },
    { day: "6", revenue: 2900 },
    { day: "7", revenue: 5200 },
  ]

  // Calculate event progress
  const calculateEventProgress = () => {
    const eventStart = new Date(`${mockLiveEvent.date} ${mockLiveEvent.startTime}`)
    const eventEnd = new Date(`${mockLiveEvent.date} ${mockLiveEvent.endTime}`)
    const now = testTime || currentTime

    if (now < eventStart) return 0
    if (now > eventEnd) return 100

    const totalDuration = eventEnd.getTime() - eventStart.getTime()
    const elapsed = now.getTime() - eventStart.getTime()
    return Math.round((elapsed / totalDuration) * 100)
  }

  const getCurrentAgendaItem = () => {
    const now = testTime || currentTime
    const currentTimeStr = now.toTimeString().slice(0, 5)

    for (let i = 0; i < mockLiveEvent.agenda.length; i++) {
      const item = mockLiveEvent.agenda[i]
      const nextItem = mockLiveEvent.agenda[i + 1]

      if (currentTimeStr >= item.time && (!nextItem || currentTimeStr < nextItem.time)) {
        return item
      }
    }
    return null
  }

  const eventProgress = calculateEventProgress()
  const currentAgendaItem = getCurrentAgendaItem()

  // Test control functions
  const setTestTimeToEvent = (timeStr: string) => {
    const testDate = new Date(`${mockLiveEvent.date} ${timeStr}`)
    setTestTime(testDate)
  }

  const resetToRealTime = () => {
    setTestTime(null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Q1Eventos Management Center</p>
            </div>
            <Button asChild>
              <Link href="/admin/eventos/crear">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>

          {/* Live Event Monitoring */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  Live Event Monitoring
                </CardTitle>
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Wifi className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <WifiOff className="h-3 w-3 mr-1" />
                      Disconnected
                    </Badge>
                  )}
                  <Badge variant="outline">{(testTime || currentTime).toLocaleTimeString()}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Event Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{mockLiveEvent.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(mockLiveEvent.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {mockLiveEvent.startTime} - {mockLiveEvent.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{mockLiveEvent.location}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800">{mockLiveEvent.status}</Badge>
                  </div>

                  {/* Event Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Event Progress</span>
                      <span className="text-sm text-gray-600">{eventProgress}%</span>
                    </div>
                    <Progress value={eventProgress} className="h-2" />
                  </div>

                  {/* Current Activity */}
                  {currentAgendaItem && (
                    <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">Currently Active</span>
                      </div>
                      <h4 className="font-semibold">{currentAgendaItem.title}</h4>
                      <p className="text-sm text-gray-600">Started at {currentAgendaItem.time}</p>
                    </div>
                  )}

                  {/* Live Agenda */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {mockLiveEvent.agenda.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          item.status === "active"
                            ? "bg-green-50 border-green-200"
                            : item.status === "completed"
                              ? "bg-gray-50 border-gray-200"
                              : "bg-white border-gray-100"
                        }`}
                      >
                        <div className="w-16 text-sm font-medium text-gray-500 flex-shrink-0">{item.time}</div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${item.status === "completed" ? "text-gray-500 line-through" : ""}`}
                          >
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500">{item.duration} minutes</p>
                        </div>
                        <Badge
                          variant={
                            item.status === "active" ? "default" : item.status === "completed" ? "secondary" : "outline"
                          }
                          className={
                            item.status === "active"
                              ? "bg-green-100 text-green-800"
                              : item.status === "completed"
                                ? "bg-gray-100 text-gray-600"
                                : ""
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Stats */}
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{mockLiveEvent.currentAttendees}</div>
                        <div className="text-sm text-gray-600">Current Attendees</div>
                        <div className="text-xs text-gray-500 mt-1">of {mockLiveEvent.totalRegistered} registered</div>
                        <Progress
                          value={(mockLiveEvent.currentAttendees / mockLiveEvent.totalRegistered) * 100}
                          className="mt-2 h-1"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Test Controls */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Test Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => setTestTimeToEvent("09:00")}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Event Start
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => setTestTimeToEvent("10:45")}
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          Mid Event
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => setTestTimeToEvent("18:00")}
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          Event End
                        </Button>
                        <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={resetToRealTime}>
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Real Time
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Metrics */}
          <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-green-600">+2 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-green-600">+127 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-green-600">+15.2% vs last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageAttendance}%</div>
                <p className="text-xs text-green-600">+3.1% vs last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Metrics */}
          <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Events</CardTitle>
                <Eye className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingEvents}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingPayments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
                <Award className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.certificatesIssued}</div>
              </CardContent>
            </Card>
          </div>

          {/* My Events */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>My Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge
                          variant={event.status === "Published" ? "secondary" : "outline"}
                          className={event.status === "Published" ? "text-green-600 bg-green-50" : ""}
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {event.registered}/{event.capacity} registered
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium text-green-600">
                          Revenue: ${event.revenue.toLocaleString()} MXN
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/eventos/${event.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <Tabs defaultValue="sales" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>

            <TabsContent value="sales">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Sales by Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]} />
                        <Bar dataKey="sales" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Events by Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="events" stroke="#3B82F6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Attendance by Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={attendanceByEvent} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="event" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="attendees" fill="#10B981" name="Attendees" />
                      <Bar dataKey="capacity" fill="#E5E7EB" name="Capacity" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5" />
                      Distribution by Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Summary by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryDistribution.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{category.value}%</div>
                            <div className="text-sm text-gray-500">
                              {Math.round((stats.totalEvents * category.value) / 100)} events
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Daily Revenue (Last Week)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={dailyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
