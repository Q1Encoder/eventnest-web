"use client"
import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "recharts"
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  PieChartIcon,
  Filter,
} from "lucide-react"

const mockReportData = {
  eventPerformance: [
    { name: "Web Dev Conf", attendees: 185, revenue: 89400, satisfaction: 4.8 },
    { name: "Marketing Summit", attendees: 142, revenue: 67800, satisfaction: 4.6 },
    { name: "AI Workshop", attendees: 98, revenue: 52500, satisfaction: 4.9 },
    { name: "Data Science", attendees: 156, revenue: 78000, satisfaction: 4.7 },
    { name: "Blockchain", attendees: 89, revenue: 44500, satisfaction: 4.5 },
  ],
  monthlyTrends: [
    { month: "Jan", events: 8, attendees: 650, revenue: 325000 },
    { month: "Feb", events: 10, attendees: 820, revenue: 410000 },
    { month: "Mar", events: 12, attendees: 980, revenue: 490000 },
    { month: "Apr", events: 9, attendees: 720, revenue: 360000 },
    { month: "May", events: 11, attendees: 890, revenue: 445000 },
    { month: "Jun", events: 14, attendees: 1120, revenue: 560000 },
  ],
  categoryDistribution: [
    { name: "Technology", value: 45, color: "#10B981" },
    { name: "Business", value: 30, color: "#3B82F6" },
    { name: "Education", value: 15, color: "#F59E0B" },
    { name: "Science", value: 10, color: "#EF4444" },
  ],
  userDemographics: [
    { age: "18-25", count: 120, percentage: 15 },
    { age: "26-35", count: 280, percentage: 35 },
    { age: "36-45", count: 240, percentage: 30 },
    { age: "46-55", count: 120, percentage: 15 },
    { age: "56+", count: 40, percentage: 5 },
  ],
}

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState<any>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days")

  const handleExportReport = (type: string) => {
    // In a real app, this would generate and download the report
    alert(`Exporting ${type} report...`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
              <p className="text-gray-600">Generate comprehensive reports and analyze event performance</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportReport("PDF")}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExportReport("Excel")}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Report Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 days</SelectItem>
                    <SelectItem value="last-3-months">Last 3 months</SelectItem>
                    <SelectItem value="last-6-months">Last 6 months</SelectItem>
                    <SelectItem value="last-year">Last year</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Event category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Event status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All events</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold">64</p>
                    <p className="text-xs text-green-600">+12% vs last period</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                    <p className="text-2xl font-bold">5,280</p>
                    <p className="text-xs text-green-600">+18% vs last period</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">$2,640,000</p>
                    <p className="text-xs text-green-600">+25% vs last period</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Satisfaction</p>
                    <p className="text-2xl font-bold">4.7</p>
                    <p className="text-xs text-green-600">+0.2 vs last period</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Tabs */}
          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Event Performance</TabsTrigger>
              <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
            </TabsList>

            <TabsContent value="performance">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Event Attendance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mockReportData.eventPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="attendees" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Revenue by Event
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mockReportData.eventPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                        <Bar dataKey="revenue" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Event Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockReportData.eventPerformance.map((event, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span>{event.attendees} attendees</span>
                              <span>${event.revenue.toLocaleString()} revenue</span>
                              <Badge variant="outline" className="text-yellow-600 bg-yellow-50">
                                {event.satisfaction}★ satisfaction
                              </Badge>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Monthly Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={mockReportData.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="events" stroke="#10B981" strokeWidth={3} />
                        <Line yAxisId="left" type="monotone" dataKey="attendees" stroke="#3B82F6" strokeWidth={3} />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">64</div>
                        <div className="text-sm text-gray-600">Total Events</div>
                        <div className="text-xs text-green-600 mt-1">+12% growth</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">5,280</div>
                        <div className="text-sm text-gray-600">Total Attendees</div>
                        <div className="text-xs text-green-600 mt-1">+18% growth</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">$2.64M</div>
                        <div className="text-sm text-gray-600">Total Revenue</div>
                        <div className="text-xs text-green-600 mt-1">+25% growth</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5" />
                      Event Distribution by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={mockReportData.categoryDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {mockReportData.categoryDistribution.map((entry, index) => (
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
                    <CardTitle>Category Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockReportData.categoryDistribution.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                            <div>
                              <h4 className="font-semibold">{category.name}</h4>
                              <p className="text-sm text-gray-600">{category.value}% of total events</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{Math.round((64 * category.value) / 100)}</div>
                            <div className="text-sm text-gray-500">events</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="demographics">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Demographics by Age
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mockReportData.userDemographics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Demographic Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockReportData.userDemographics.map((demo, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {demo.age}
                            </div>
                            <div>
                              <h4 className="font-semibold">Age {demo.age}</h4>
                              <p className="text-sm text-gray-600">{demo.percentage}% of total users</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{demo.count}</div>
                            <div className="text-sm text-gray-500">users</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
