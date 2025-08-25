"use client"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

const mockEvents = [
	{
		id: "1",
		title: "Conferencia de Desarrollo Web 2025",
		description:
			"Acompáñanos en la conferencia de desarrollo web más completa del año. Aprende sobre las últimas tecnologías, frameworks y mejores prácticas de la mano de expertos de la industria.",
		date: "2025-03-15",
		time: "09:00",
		location: "Centro de Convenciones Ciudad de México",
		price: 599,
		image: "/placeholder.svg?height=200&width=400",
		category: "Tecnología",
		capacity: 200,
		registered: 200,
	},
	{
		id: "2",
		title: "Cumbre de Marketing Digital",
		description:
			"Descubre las últimas tendencias en marketing digital, estrategias de redes sociales y técnicas de engagement con clientes que transformarán tu negocio.",
		date: "2025-04-20",
		time: "10:00",
		location: "Business Center Guadalajara",
		price: 450,
		image: "/placeholder.svg?height=200&width=400",
		category: "Negocios",
		capacity: 150,
		registered: 89,
	},
	{
		id: "3",
		title: "Taller de IA y Aprendizaje Automático",
		description:
			"Taller práctico sobre fundamentos de inteligencia artificial y aprendizaje automático, con ejercicios prácticos y aplicaciones reales.",
		date: "2025-05-10",
		time: "14:00",
		location: "Tech Hub Monterrey",
		price: 750,
		image: "/placeholder.svg?height=200&width=400",
		category: "Tecnología",
		capacity: 100,
		registered: 67,
	},
	{
		id: "4",
		title: "Bootcamp de Emprendimiento",
		description:
			"Bootcamp intensivo para aspirantes a emprendedores. Aprende a validar tu idea de negocio, crear un plan de negocios y conseguir financiamiento.",
		date: "2025-06-05",
		time: "09:00",
		location: "Innovation Center Puebla",
		price: 399,
		image: "/placeholder.svg?height=200&width=400",
		category: "Negocios",
		capacity: 80,
		registered: 45,
	},
	{
		id: "5",
		title: "Simposio de Ciencia de Datos",
		description:
			"Explora el mundo de la ciencia de datos con expertos líderes. Temas incluyen visualización de datos, análisis estadístico y modelado predictivo.",
		date: "2025-07-12",
		time: "08:30",
		location: "Campus Universitario Tijuana",
		price: 525,
		image: "/placeholder.svg?height=200&width=400",
		category: "Ciencia",
		capacity: 120,
		registered: 78,
	},
	{
		id: "6",
		title: "Masterclass de UX/UI Design",
		description:
			"Domina el arte de la experiencia de usuario y el diseño de interfaces. Aprende design thinking, prototipado y metodologías de investigación de usuarios.",
		date: "2025-08-18",
		time: "10:30",
		location: "Design Studio Cancún",
		price: 675,
		image: "/placeholder.svg?height=200&width=400",
		category: "Diseño",
		capacity: 60,
		registered: 42,
	},
]

export default function EventsPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<NavBar />
			<main className="flex-1 py-8">
				<div className="container mx-auto px-4">
					<div className="mb-8">
						<h1 className="text-3xl font-bold mb-2">Próximos Eventos</h1>
						<p className="text-gray-600">Descubre y regístrate para eventos increíbles</p>
					</div>

					{/* Search and Filter */}
					<div className="flex flex-col md:flex-row gap-4 mb-8">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input placeholder="Buscar eventos..." className="pl-10" />
						</div>
						<Select>
							<SelectTrigger className="w-full md:w-48">
								<SelectValue placeholder="Categoría" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todas las Categorías</SelectItem>
								<SelectItem value="technology">Tecnología</SelectItem>
								<SelectItem value="business">Negocios</SelectItem>
								<SelectItem value="science">Ciencia</SelectItem>
								<SelectItem value="design">Diseño</SelectItem>
							</SelectContent>
						</Select>
						<Button variant="outline" className="w-full md:w-auto bg-transparent">
							<Filter className="h-4 w-4 mr-2" />
							Más Filtros
						</Button>
					</div>

					{/* Events Grid */}
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{mockEvents.map((event) => (
							<EventCard key={event.id} event={event} />
						))}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}
