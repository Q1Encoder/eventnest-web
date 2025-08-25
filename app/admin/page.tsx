import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Users,
  BarChart3,
  Settings,
  FileText,
  UserCheck,
  Plus,
  TrendingUp,
  DollarSign,
  Eye,
} from "lucide-react"
import Link from "next/link"

const quickStats = [
  {
    title: "Total Events",
    value: "12",
    description: "Active events",
    icon: Calendar,
    color: "text-blue-600",
    href: "/admin/eventos",
  },
  {
    title: "Total Users",
    value: "1,247",
    description: "Registered users",
    icon: Users,
    color: "text-green-600",
    href: "/admin/usuarios",
  },
  {
    title: "Monthly Revenue",
    value: "$125,000",
    description: "MXN this month",
    icon: DollarSign,
    color: "text-purple-600",
    href: "/admin/reportes",
  },
  {
    title: "Attendance Rate",
    value: "85.2%",
    description: "Average attendance",
    icon: TrendingUp,
    color: "text-orange-600",
    href: "/admin/asistencia",
  },
]

const recentEvents = [
  {
    id: "1",
    title: "Web Development Conference 2025",
    date: "2025-03-15",
    status: "Published",
    registered: 150,
    capacity: 200,
  },
  {
    id: "2",
    title: "Digital Marketing Summit",
    date: "2025-04-20",
    status: "Draft",
    registered: 89,
    capacity: 150,
  },
  {
    id: "3",
    title: "AI & Machine Learning Workshop",
    date: "2025-05-10",
    status: "Published",
    registered: 67,
    capacity: 100,
  },
]

const adminActions = [
  {
    title: "Create New Event",
    description: "Set up a new event with all details",
    icon: Plus,
    href: "/admin/eventos/crear",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "View Dashboard",
    description: "Access detailed analytics and reports",
    icon: BarChart3,
    href: "/admin/dashboard",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "Manage Users",
    description: "View and manage user accounts",
    icon: UserCheck,
    href: "/admin/usuarios",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "Generate Reports",
    description: "Create detailed event and financial reports",
    icon: FileText,
    href: "/admin/reportes",
    color: "bg-orange-500 hover:bg-orange-600",
  },
]

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage your events and monitor platform performance</p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {quickStats.map((stat, index) => (
              <Link key={index} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.description}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {adminActions.map((action, index) => (
                      <Link key={index} href={action.href}>
                        <div className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                          <div className={`p-3 rounded-lg text-white ${action.color}`}>
                            <action.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{action.title}</h4>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Events */}
              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Events</CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/eventos">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{event.title}</h4>
                            <Badge
                              variant={event.status === "Published" ? "secondary" : "outline"}
                              className={event.status === "Published" ? "text-green-600 bg-green-50" : ""}
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <span>
                              {event.registered}/{event.capacity} registered
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/eventos/${event.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Platform Status</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Gateway</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Service</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>New user registered</span>
                      <span className="text-gray-500 ml-auto">2m ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Event ticket purchased</span>
                      <span className="text-gray-500 ml-auto">5m ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>New event created</span>
                      <span className="text-gray-500 ml-auto">1h ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Payment processed</span>
                      <span className="text-gray-500 ml-auto">2h ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href="/admin/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Platform Settings
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href="/admin/backup">
                        <FileText className="h-4 w-4 mr-2" />
                        Backup Data
                      </Link>
                    </Button>
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
