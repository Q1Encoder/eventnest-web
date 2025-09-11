"use client"

import { useEffect, useState } from "react"
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
import { collection, query, where, getDocs, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function AdminUsersPage() {
	const [attendees, setAttendees] = useState<any[]>([])
	const [search, setSearch] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [sortBy, setSortBy] = useState("name")
	const [selectedUser, setSelectedUser] = useState<any>(null)
	const [modalOpen, setModalOpen] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [rowsPerPage, setRowsPerPage] = useState(5)

	// Cargar asistentes
	useEffect(() => {
		async function fetchAttendees() {
			const q = query(collection(db, "registrations"))
			const snapshot = await getDocs(q)
			const registrations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

			// Traer datos de usuario
			const userPromises = registrations.map(async (reg) => {
				const userRef = doc(db, "users", reg.userId)
				const userSnap = await getDoc(userRef)
				return {
					...reg,
					user: userSnap.exists() ? userSnap.data() : {},
				}
			})

			const registrationsWithUser = await Promise.all(userPromises)
			setAttendees(registrationsWithUser)
		}
		fetchAttendees()
	}, [])

	// Aprobar o rechazar usuario
	const handleApprove = async (registrationId: string) => {
		await updateDoc(doc(db, "registrations", registrationId), { confirmed: true })
		setAttendees((prev) =>
			prev.map((a) => (a.id === registrationId ? { ...a, confirmed: true } : a))
		)
	}
	const handleReject = async (registrationId: string) => {
		await updateDoc(doc(db, "registrations", registrationId), { confirmed: false })
		setAttendees((prev) =>
			prev.map((a) => (a.id === registrationId ? { ...a, confirmed: false } : a))
		)
	}
	const handleDelete = async (registrationId: string) => {
		await deleteDoc(doc(db, "registrations", registrationId))
		setAttendees((prev) => prev.filter((a) => a.id !== registrationId))
	}

	const totalUsers = attendees.length
	const activeUsers = attendees.filter((user) => user.status === "Active").length
	const inactiveUsers = attendees.filter((user) => user.status === "Inactive").length
	const totalRevenue = attendees.reduce((sum, user) => sum + user.totalSpent, 0)
	const averageSpent = Math.round(totalRevenue / totalUsers)

	// Filtros y búsqueda
	const filteredAttendees = attendees
		.filter(
			(att) =>
				// Excluye a los administradores
				att.user.role !== "admin" &&
				(statusFilter === "all" ||
					(statusFilter === "active" && att.confirmed) ||
					(statusFilter === "inactive" && !att.confirmed)) &&
				`${att.user.firstName ?? ""} ${att.user.lastName ?? ""} ${att.user.email ?? ""}`
					.toLowerCase()
					.includes(search.toLowerCase())
		)
		.sort((a, b) => {
			if (sortBy === "name") return (a.user.firstName ?? "").localeCompare(b.user.firstName ?? "")
			if (sortBy === "date") return (a.registrationDate ?? "").localeCompare(b.registrationDate ?? "")
			return 0
		})

	const totalPages = Math.ceil(filteredAttendees.length / rowsPerPage)
	const paginatedAttendees = filteredAttendees.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	)

	// Funciones para aprobar/rechazar evento (mock)
	const handleEventApprove = (eventId: string) => {
		setSelectedUser((prev: any) => ({
			...prev,
			events: prev.events.map((ev: any) => (ev.id === eventId ? { ...ev, status: "approved" } : ev)),
		}))
	}
	const handleEventReject = (eventId: string) => {
		setSelectedUser((prev: any) => ({
			...prev,
			events: prev.events.map((ev: any) => (ev.id === eventId ? { ...ev, status: "rejected" } : ev)),
		}))
	}

	useEffect(() => {
		setCurrentPage(1)
	}, [search, statusFilter, sortBy, rowsPerPage])

	return (
		<div className="flex min-h-screen flex-col">
			<NavBar />
			<main className="flex-1 py-8">
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-center mb-8">
						<div>
							<h1 className="text-3xl font-bold mb-2">Administracion de Usuarios</h1>
							<p className="text-gray-600">Gestionar usuarios registrados y su actividad</p>
						</div>
						{/* <Button>
							<UserPlus className="h-4 w-4 mr-2" />
							Agregar Usuario
						</Button> */}
					</div>

					{/* Statistics */}
					<div className="grid gap-6 md:grid-cols-4 mb-8">
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">Total de Usuarios</p>
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
										<p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
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
										<p className="text-sm font-medium text-gray-600">Total de Ingresos</p>
										{/* <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p> */}
									</div>
									<Calendar className="h-8 w-8 text-purple-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">Promedio Gastado</p>
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
									<Input
										placeholder="Search users..."
										className="pl-10"
										value={search}
										onChange={e => setSearch(e.target.value)}
									/>
								</div>

								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-full md:w-48">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todos</SelectItem>
										<SelectItem value="active">Aprobados</SelectItem>
										<SelectItem value="inactive">Pendientes</SelectItem>
									</SelectContent>
								</Select>

								<Select value={sortBy} onValueChange={setSortBy}>
									<SelectTrigger className="w-full md:w-48">
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="name">Nombre</SelectItem>
										<SelectItem value="date">Fecha de Registro</SelectItem>
									</SelectContent>
								</Select>

								<Button variant="outline" className="w-full md:w-auto bg-transparent">
									<Filter className="h-4 w-4 mr-2" />
									Mas Filtros
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Users List */}
					<Card>
						<CardHeader>
							<CardTitle>Todos los Usuarios</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<table className="min-w-full border border-gray-200 rounded-lg">
									<thead className="bg-gray-100">
										<tr>
											<th className="p-2 border-b text-left">Nombre</th>
											<th className="p-2 border-b text-left">Email</th>
											<th className="p-2 border-b text-left">Estado</th>
											<th className="p-2 border-b text-left">Acciones</th>
										</tr>
									</thead>
									<tbody>
										{paginatedAttendees.map((att) => (
											<tr
												key={att.id}
												className={
													att.confirmed === true
														? "bg-green-50"
														: att.confirmed === false
														? "bg-yellow-50"
														: "bg-red-50"
												}
											>
												<td className="p-2 border-b flex items-center gap-2">
													<Avatar className="h-8 w-8">
														<AvatarImage
															src={att.user.avatar || "/placeholder.svg"}
															alt={`${att.user.firstName} ${att.user.lastName}`}
														/>
														<AvatarFallback>
															{att.user.firstName?.charAt(0)}
															{att.user.lastName?.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<span>
														{att.user.firstName} {att.user.lastName}
													</span>
												</td>
												<td className="p-2 border-b">{att.user.email}</td>
												<td className="p-2 border-b">
													{att.confirmed === true ? (
														<Badge variant="secondary" className="bg-green-200 text-green-800">
															Aprobado
														</Badge>
													) : att.confirmed === false ? (
														<Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
															Pendiente
														</Badge>
													) : (
														<Badge variant="destructive" className="bg-red-200 text-red-800">
															Rechazado
														</Badge>
													)}
												</td>
												<td className="p-2 border-b">
													{att.confirmed === false ? (
														<>
															<Button
																size="sm"
																variant="secondary"
																className="mr-2"
																onClick={() => handleApprove(att.id)}
															>
																Aprobar
															</Button>
															<Button
																size="sm"
																variant="destructive"
																className="mr-2"
																onClick={() => handleReject(att.id)}
															>
																Rechazar
															</Button>
														</>
													) : att.confirmed === true ? (
														<span className="text-green-600 font-semibold mr-2">✔</span>
													) : (
														<span className="text-red-600 font-semibold mr-2">✖</span>
													)}
													{/* <Button
														size="sm"
														variant="outline"
														onClick={() => handleDelete(att.id)}
													>
														Eliminar
													</Button> */}
												</td>
											</tr>
										))}
									</tbody>
								</table>
								{filteredAttendees.length === 0 && (
									<div className="text-center text-gray-500 py-8">No se encontraron usuarios.</div>
								)}
							</div>

							<div className="flex items-center justify-between mb-2">
								<div>
									<label className="mr-2 text-sm">Usuarios por página:</label>
									<select
										className="border rounded px-2 py-1 text-sm"
										value={rowsPerPage}
										onChange={e => {
											setRowsPerPage(Number(e.target.value))
											setCurrentPage(1)
										}}
									>
										<option value={5}>5</option>
										<option value={10}>10</option>
										<option value={15}>15</option>
									</select>
								</div>
								<div className="text-sm text-gray-500">
									Página {currentPage} de {totalPages}
								</div>
							</div>

							<div className="flex justify-center items-center gap-2 mt-4">
								<Button
									size="sm"
									variant="outline"
									disabled={currentPage === 1}
									onClick={() => setCurrentPage(currentPage - 1)}
								>
									Anterior
								</Button>
								<span className="text-sm">
									{currentPage} / {totalPages}
								</span>
								<Button
									size="sm"
									variant="outline"
									disabled={currentPage === totalPages || totalPages === 0}
									onClick={() => setCurrentPage(currentPage + 1)}
								>
									Siguiente
								</Button>
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
										{/* {selectedUser.firstName.charAt(0)}
										{selectedUser.lastName.charAt(0)} */}
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
														onClick={() => handleEventApprove(event.id)}
													>
														Aprobar
													</Button>
													<Button
														size="sm"
														className="ml-2"
														variant="destructive"
														onClick={() => handleEventReject(event.id)}
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
