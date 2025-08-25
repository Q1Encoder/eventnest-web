"use client"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, MapPin, Plus, Search, Filter, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

const mockEvents = [
	{
		id: "1",
		title: "Web Development Conference 2025",
		description: "Join us for the most comprehensive web development conference of the year.",
		date: "2025-03-15",
		time: "09:00",
		location: "Convention Center Mexico City",
		status: "Published",
		category: "Technology",
		registered: 150,
		capacity: 200,
		revenue: 89400,
		createdAt: "2025-01-10",
	},
	{
		id: "2",
		title: "Digital Marketing Summit",
		description: "Discover the latest trends in digital marketing and social media strategies.",
		date: "2025-04-20",
		time: "10:00",
		location: "Business Center Guadalajara",
		status: "Draft",
		category: "Business",
		registered: 89,
		capacity: 150,
		revenue: 40050,
		createdAt: "2025-01-12",
	},
	{
		id: "3",
		title: "AI & Machine Learning Workshop",
		description: "Hands-on workshop covering artificial intelligence and machine learning fundamentals.",
		date: "2025-05-10",
		time: "14:00",
		location: "Tech Hub Monterrey",
		status: "Published",
		category: "Technology",
		registered: 67,
		capacity: 100,
		revenue: 50250,
		createdAt: "2025-01-08",
	},
	{
		id: "4",
		title: "Entrepreneurship Bootcamp",
		description: "Intensive bootcamp for aspiring entrepreneurs.",
		date: "2025-06-05",
		time: "09:00",
		location: "Innovation Center Puebla",
		status: "Published",
		category: "Business",
		registered: 45,
		capacity: 80,
		revenue: 17955,
		createdAt: "2025-01-15",
	},
	{
		id: "5",
		title: "Data Science Symposium",
		description: "Explore the world of data science with leading experts.",
		date: "2025-07-12",
		time: "08:30",
		location: "University Campus Tijuana",
		status: "Draft",
		category: "Science",
		registered: 78,
		capacity: 120,
		revenue: 40950,
		createdAt: "2025-01-18",
	},
]

export default function AdminEventsPage() {
	const [events, setEvents] = useState<any[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchEvents() {
			setLoading(true)
			const querySnapshot = await getDocs(collection(db, "events"))
			const eventsData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			setEvents(eventsData)
			setLoading(false)
		}
		fetchEvents()
	}, [])

	const totalEvents = events.length
	const publishedEvents = events.filter((event) => event.status === "Published").length
	const draftEvents = events.filter((event) => event.status === "Draft").length
	const totalRevenue = events.reduce((sum, event) => sum + event.revenue, 0)

	return (
		<div className="flex min-h-screen flex-col">
			<NavBar />
			<main className="flex-1 py-8">
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-center mb-8">
						<div>
							<h1 className="text-3xl font-bold mb-2">Event Management</h1>
							<p className="text-gray-600">Create, edit, and manage your events</p>
						</div>
						<Button asChild>
							<Link href="/admin/eventos/crear">
								<Plus className="h-4 w-4 mr-2" />
								Create New Event
							</Link>
						</Button>
					</div>

					{/* Statistics */}
					<div className="grid gap-6 md:grid-cols-4 mb-8">
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">Total Events</p>
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
										<p className="text-sm font-medium text-gray-600">Published</p>
										<p className="text-2xl font-bold">{publishedEvents}</p>
									</div>
									<Eye className="h-8 w-8 text-green-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">Drafts</p>
										<p className="text-2xl font-bold">{draftEvents}</p>
									</div>
									<Edit className="h-8 w-8 text-orange-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">Total Revenue</p>
										<p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
									</div>
									<Users className="h-8 w-8 text-purple-600" />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Filters */}
					<Card className="mb-6">
						<CardContent className="p-6">
							<div className="flex flex-col md:flex-row gap-4">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input placeholder="Search events..." className="pl-10" />
								</div>
								<Select>
									<SelectTrigger className="w-full md:w-48">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="published">Published</SelectItem>
										<SelectItem value="draft">Draft</SelectItem>
									</SelectContent>
								</Select>
								<Select>
									<SelectTrigger className="w-full md:w-48">
										<SelectValue placeholder="Category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Categories</SelectItem>
										<SelectItem value="technology">Technology</SelectItem>
										<SelectItem value="business">Business</SelectItem>
										<SelectItem value="science">Science</SelectItem>
									</SelectContent>
								</Select>
								<Button variant="outline" className="w-full md:w-auto bg-transparent">
									<Filter className="h-4 w-4 mr-2" />
									More Filters
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Events List */}
					<Card>
						<CardHeader>
							<CardTitle>All Events</CardTitle>
						</CardHeader>
						<CardContent>
							{loading ? (
								<div className="p-8 text-center text-gray-500">Cargando eventos...</div>
							) : (
								<div className="space-y-4">
									{events.map((event) => (
										<div
											key={event.id}
											className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
										>
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<h3 className="font-semibold text-lg">{event.title}</h3>
													<Badge
														variant={event.status === "Published" ? "secondary" : "outline"}
														className={
															event.status === "Published"
																? "text-green-600 bg-green-50"
																: "text-orange-600 bg-orange-50"
														}
													>
														{event.status}
													</Badge>
													<Badge variant="outline" className="text-blue-600 bg-blue-50">
														{event.category}
													</Badge>
												</div>

												<p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>

												<div className="flex items-center gap-6 text-sm text-gray-600">
													<div className="flex items-center gap-1">
														<Calendar className="h-4 w-4" />
														<span>
															{new Date(event.date).toLocaleDateString("es-MX", {
																year: "numeric",
																month: "short",
																day: "numeric",
															})}{" "}
															at {event.time}
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

												<div className="flex items-center gap-4 mt-2">
													<span className="text-sm font-medium text-green-600">
														{/* Revenue: ${event.revenue.toLocaleString()} MXN */}
                            Revenue: 0 MXN
													</span>
													<span className="text-sm text-gray-500">
														Created: {new Date(event.createdAt).toLocaleDateString()}
													</span>
												</div>
											</div>

											<div className="flex items-center gap-2">
												<Button variant="outline" size="sm" asChild>
													<Link href={`/eventos/${event.id}`}>
														<Eye className="h-4 w-4" />
													</Link>
												</Button>
												<Button variant="outline" size="sm" asChild>
													<Link href={`/admin/eventos/editar/${event.id}`}>
														<Edit className="h-4 w-4" />
													</Link>
												</Button>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="outline" size="sm">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem>Duplicate Event</DropdownMenuItem>
														<DropdownMenuItem>Export Data</DropdownMenuItem>
														<DropdownMenuItem>View Analytics</DropdownMenuItem>
														<DropdownMenuItem className="text-red-600">
															<Trash2 className="h-4 w-4 mr-2" />
															Delete Event
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									))}
									{events.length === 0 && (
										<div className="p-8 text-center text-gray-500">No hay eventos registrados.</div>
									)}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</main>
			<Footer />
		</div>
	)
}
