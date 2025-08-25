"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Filter, Mail, Phone, Building, Calendar, MoreHorizontal, UserPlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

const mockUsers = [
	{
		id: "1",
		firstName: "Juan",
		lastName: "Pérez",
		email: "juan.perez@email.com",
		phone: "+52 55 1234 5678",
		company: "Tech Solutions SA",
		position: "Senior Developer",
		registrationDate: "2024-11-15",
		status: "Active",
		eventsAttended: 5,
		totalSpent: 2995,
		avatar: "/placeholder.svg?height=40&width=40",
		pending: true,
		events: [
			{
				id: "e1",
				name: "Conferencia de Desarrollo Web",
				status: "pending",
			},
			{
				id: "e2",
				name: "Taller de IA",
				status: "approved",
			},
      {
				id: "e2",
				name: "Taller de IA",
				status: "approved",
			},
      {
				id: "e2",
				name: "Taller de IA",
				status: "approved",
			},
      {
				id: "e2",
				name: "Taller de IA",
				status: "approved",
			},
		],
	},
	{
		id: "2",
		firstName: "María",
		lastName: "González",
		email: "maria.gonzalez@email.com",
		phone: "+52 55 2345 6789",
		company: "Digital Marketing Pro",
		position: "Marketing Manager",
		registrationDate: "2024-10-20",
		status: "Active",
		eventsAttended: 3,
		totalSpent: 1797,
		avatar: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "3",
		firstName: "Carlos",
		lastName: "Mendoza",
		email: "carlos.mendoza@email.com",
		phone: "+52 55 3456 7890",
		company: "AI Innovations",
		position: "Data Scientist",
		registrationDate: "2024-09-10",
		status: "Active",
		eventsAttended: 7,
		totalSpent: 4193,
		avatar: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "4",
		firstName: "Ana",
		lastName: "Rodríguez",
		email: "ana.rodriguez@email.com",
		phone: "+52 55 4567 8901",
		company: "StartupXYZ",
		position: "CEO",
		registrationDate: "2024-08-05",
		status: "Inactive",
		eventsAttended: 2,
		totalSpent: 798,
		avatar: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "5",
		firstName: "Luis",
		lastName: "Martínez",
		email: "luis.martinez@email.com",
		phone: "+52 55 5678 9012",
		company: "Data Corp",
		position: "Business Analyst",
		registrationDate: "2024-12-01",
		status: "Active",
		eventsAttended: 1,
		totalSpent: 525,
		avatar: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "6",
		firstName: "Sofia",
		lastName: "López",
		email: "sofia.lopez@email.com",
		phone: "+52 55 6789 0123",
		company: "Design Studio",
		position: "UX Designer",
		registrationDate: "2024-07-12",
		status: "Active",
		eventsAttended: 4,
		totalSpent: 2700,
		avatar: "/placeholder.svg?height=40&width=40",
	},
]

export default function AdminUsersPage() {
	const [selectedUser, setSelectedUser] = useState<any>(null)
	const [modalOpen, setModalOpen] = useState(false)

	const totalUsers = mockUsers.length
	const activeUsers = mockUsers.filter((user) => user.status === "Active").length
	const inactiveUsers = mockUsers.filter((user) => user.status === "Inactive").length
	const totalRevenue = mockUsers.reduce((sum, user) => sum + user.totalSpent, 0)
	const averageSpent = Math.round(totalRevenue / totalUsers)

	// Funciones para aprobar/rechazar evento (mock)
	const handleApprove = (eventId: string) => {
		setSelectedUser((prev: any) => ({
			...prev,
			events: prev.events.map((ev: any) =>
				ev.id === eventId ? { ...ev, status: "approved" } : ev
			),
		}))
	}
	const handleReject = (eventId: string) => {
		setSelectedUser((prev: any) => ({
			...prev,
			events: prev.events.map((ev: any) =>
				ev.id === eventId ? { ...ev, status: "rejected" } : ev
			),
		}))
	}

	return (
		<div className="flex min-h-screen flex-col">
			<NavBar />
			<main className="flex-1 py-8">
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-center mb-8">
						<div>
							<h1 className="text-3xl font-bold mb-2">User Management</h1>
							<p className="text-gray-600">Manage registered users and their activity</p>
						</div>
						<Button>
							<UserPlus className="h-4 w-4 mr-2" />
							Add User
						</Button>
					</div>

					{/* Statistics */}
					<div className="grid gap-6 md:grid-cols-4 mb-8">
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">Total Users</p>
										<p className="text-2xl font-bold">{totalUsers}</p>
									</div>
									<Users className="h-8 w-8 text-blue-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">Active Users</p>
										<p className="text-2xl font-bold">{activeUsers}</p>
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
										<p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
									</div>
									<Calendar className="h-8 w-8 text-purple-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">Avg. Spent</p>
										<p className="text-2xl font-bold">${averageSpent}</p>
									</div>
									<Building className="h-8 w-8 text-orange-600" />
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
									<Input placeholder="Search users..." className="pl-10" />
								</div>
								<Select>
									<SelectTrigger className="w-full md:w-48">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="inactive">Inactive</SelectItem>
									</SelectContent>
								</Select>
								<Select>
									<SelectTrigger className="w-full md:w-48">
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="name">Name</SelectItem>
										<SelectItem value="date">Registration Date</SelectItem>
										<SelectItem value="events">Events Attended</SelectItem>
										<SelectItem value="spent">Total Spent</SelectItem>
									</SelectContent>
								</Select>
								<Button variant="outline" className="w-full md:w-auto bg-transparent">
									<Filter className="h-4 w-4 mr-2" />
									More Filters
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Users List */}
					<Card>
						<CardHeader>
							<CardTitle>All Users</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{mockUsers.map((user) => (
									<div
										key={user.id}
										className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
									>
										<div className="flex items-center gap-4 flex-1">
											<Avatar className="h-12 w-12">
												<AvatarImage
													src={user.avatar || "/placeholder.svg"}
													alt={`${user.firstName} ${user.lastName}`}
												/>
												<AvatarFallback>
													{user.firstName.charAt(0)}
													{user.lastName.charAt(0)}
												</AvatarFallback>
											</Avatar>

											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<h3 className="font-semibold text-lg">
														{user.firstName} {user.lastName}
													</h3>
													<Badge
														variant={user.status === "Active" ? "secondary" : "outline"}
														className={
															user.status === "Active"
																? "text-green-600 bg-green-50"
																: "text-gray-600 bg-gray-50"
														}
													>
														{user.status}
													</Badge>
													{user.pending && (
														<Badge variant="alert" className="ml-2">
															Pendiente
														</Badge>
													)}
												</div>

												<div className="grid gap-2 md:grid-cols-2 text-sm text-gray-600">
													<div className="flex items-center gap-2">
														<Mail className="h-4 w-4" />
														<span>{user.email}</span>
													</div>
													<div className="flex items-center gap-2">
														<Phone className="h-4 w-4" />
														<span>{user.phone}</span>
													</div>
													<div className="flex items-center gap-2">
														<Building className="h-4 w-4" />
														<span>{user.company}</span>
													</div>
													<div className="flex items-center gap-2">
														<Calendar className="h-4 w-4" />
														<span>
															Joined{" "}
															{new Date(user.registrationDate).toLocaleDateString()}
														</span>
													</div>
												</div>

												<div className="flex items-center gap-6 mt-2 text-sm">
													<span className="font-medium">
														Position:{" "}
														<span className="text-gray-600">{user.position}</span>
													</span>
													<span className="font-medium">
														Events:{" "}
														<span className="text-blue-600">{user.eventsAttended}</span>
													</span>
													<span className="font-medium">
														Total Spent:{" "}
														<span className="text-green-600">
															${user.totalSpent.toLocaleString()}
														</span>
													</span>
												</div>
											</div>
										</div>

										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setSelectedUser(user)
													setModalOpen(true)
												}}
											>
												View Profile
											</Button>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="outline" size="sm">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem>Send Email</DropdownMenuItem>
													<DropdownMenuItem>View Events</DropdownMenuItem>
													<DropdownMenuItem>Edit User</DropdownMenuItem>
													<DropdownMenuItem>Export Data</DropdownMenuItem>
													<DropdownMenuItem className="text-red-600">
														Deactivate User
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
			<Footer />

			{/* Modal para perfil de usuario */}
			<Dialog open={modalOpen} onOpenChange={setModalOpen}>
				<DialogContent className="max-w-lg">
					{selectedUser && (
						<>
							<DialogHeader>
								<DialogTitle>
									Perfil de {selectedUser.firstName} {selectedUser.lastName}
								</DialogTitle>
								<DialogDescription>
									Email: {selectedUser.email}
								</DialogDescription>
							</DialogHeader>
							<div className="flex items-center gap-4 mt-4 mb-2">
								<Avatar className="h-16 w-16">
									<AvatarImage
										src={selectedUser.avatar || "/placeholder.svg"}
										alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
									/>
									<AvatarFallback>
										{selectedUser.firstName.charAt(0)}
										{selectedUser.lastName.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="font-medium">{selectedUser.position}</div>
									<div className="text-sm text-gray-500">{selectedUser.company}</div>
									<div className="text-sm text-gray-500">
										Registrado el{" "}
										{new Date(selectedUser.registrationDate).toLocaleDateString()}
									</div>
								</div>
							</div>
							<div className="mb-2">
								<span className="font-semibold">Eventos reservados:</span>
								<div className="space-y-2 mt-2">
									{(selectedUser.events || []).map((event: any) => (
										<div
											key={event.id}
											className="flex items-center gap-3 border p-2 rounded"
										>
											<span className="font-medium">{event.name}</span>
											<Badge
												variant={
													event.status === "pending"
														? "alert"
														: event.status === "approved"
														? "secondary"
														: "outline"
												}
											>
												{event.status === "pending"
													? "Pendiente"
													: event.status === "approved"
													? "Aprobado"
													: "Rechazado"}
											</Badge>
											{event.status === "pending" && (
												<>
													<Button
														size="sm"
														className="ml-2"
														variant="secondary"
														onClick={() => handleApprove(event.id)}
													>
														Aprobar
													</Button>
													<Button
														size="sm"
														className="ml-2"
														variant="destructive"
														onClick={() => handleReject(event.id)}
													>
														Rechazar
													</Button>
												</>
											)}
										</div>
									))}
									{(selectedUser.events || []).length === 0 && (
										<div className="text-sm text-gray-500">
											No tiene eventos reservados.
										</div>
									)}
								</div>
							</div>
							<DialogFooter>
								<Button variant="outline" onClick={() => setModalOpen(false)}>
									Cerrar
								</Button>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
