"use client"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Users, Award, TrendingUp, Search, ArrowRight, Star, MapPin, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, getDocs, query, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Mock statistics
const stats = [
	{
		icon: Calendar,
		label: "Events Hosted",
		value: "500+",
		color: "text-blue-600",
	},
	{
		icon: Users,
		label: "Happy Attendees",
		value: "25,000+",
		color: "text-green-600",
	},
	{
		icon: Award,
		label: "Certificates Issued",
		value: "15,000+",
		color: "text-purple-600",
	},
	{
		icon: TrendingUp,
		label: "Success Rate",
		value: "98%",
		color: "text-orange-600",
	},
]

// Mock testimonials
const testimonials = [
	{
		name: "María González",
		role: "Software Engineer",
		company: "TechCorp",
		content:
			"Q1Eventos has transformed my professional development. The quality of events and networking opportunities are exceptional.",
		rating: 5,
		avatar: "/placeholder.svg?height=60&width=60",
	},
	{
		name: "Carlos Mendoza",
		role: "Marketing Director",
		company: "Digital Solutions",
		content: "The platform is incredibly user-friendly and the events are always well-organized. Highly recommended!",
		rating: 5,
		avatar: "/placeholder.svg?height=60&width=60",
	},
	{
		name: "Ana Rodríguez",
		role: "Data Scientist",
		company: "AI Innovations",
		content: "I've attended multiple events through Q1Eventos and each one has been a valuable learning experience.",
		rating: 5,
		avatar: "/placeholder.svg?height=60&width=60",
	},
]

export default function HomePage() {
	const [featuredEvents, setFeaturedEvents] = useState<any[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchFeaturedEvents() {
			setLoading(true)
			try {
				const eventsQuery = query(collection(db, "events"), limit(6)) // Limita a 6 eventos destacados
				const querySnapshot = await getDocs(eventsQuery)
				const events = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))
				setFeaturedEvents(events)
			} catch (error) {
				console.error("Error al cargar los eventos destacados:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchFeaturedEvents()
	}, [])

	return (
		<div className="flex min-h-screen flex-col">
			<NavBar />
			<main className="flex-1">
				{/* Hero Section */}
				{/* <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit">
                    🚀 New Platform Features Available
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Discover Amazing{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Professional Events
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Connect with industry experts, expand your network, and advance your career through our curated
                    selection of conferences, workshops, and seminars.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="text-lg px-8">
                    <Link href="/eventos">
                      Browse Events
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="text-lg px-8 bg-transparent">
                    <Link href="/registro">Create Account</Link>
                  </Button>
                </div>

                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input placeholder="Search events..." className="pl-10 h-12 text-lg" />
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-q1-gradient rounded-full flex items-center justify-center mx-auto">
                      <Calendar className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">500+ Events</h3>
                    <p className="text-gray-600 dark:text-gray-300">Professional conferences and workshops</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section> */}

				{/* Featured Events */}
				<section className="py-16 bg-gray-50 dark:bg-gray-800">
					<div className="container mx-auto px-4">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-bold mb-4">Eventos Destacados</h2>
							<p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
								No te pierdas estos próximos eventos que te ayudarán a crecer profesionalmente y ampliar tu red.
							</p>
						</div>

						{loading ? (
							<div className="text-center text-gray-500">Cargando eventos destacados...</div>
						) : featuredEvents.length > 0 ? (
							<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
								{featuredEvents.map((event) => (
									<EventCard key={event.id} event={event} />
								))}
							</div>
						) : (
							<div className="text-center text-gray-500">No hay eventos destacados disponibles.</div>
						)}

						{/* <div className="text-center">
							<Button size="lg" asChild>
								<Link href="/eventos">
									Ver todos los eventos
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
						</div> */}
					</div>
				</section>

				{/* Features Section */}
				{/* <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Q1Eventos?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                We provide everything you need for a seamless event experience.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Easy Registration</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Simple and secure event registration process with instant confirmation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Networking Opportunities</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Connect with like-minded professionals and industry experts.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Certificates</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Earn professional certificates to showcase your learning achievements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All events are carefully curated and quality-checked for the best experience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Multiple Locations</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Events across Mexico and virtual options for remote participation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Round-the-clock customer support to help you with any questions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section> */}

				{/* Testimonials */}
				{/* <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join thousands of professionals who have advanced their careers through our platform.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section> */}

				{/* CTA Section */}
				<section className="py-16 bg-q1-gradient text-white">
					<div className="container mx-auto px-4 text-center">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para comenzar tu viaje?</h2>
						<p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
							Únete a EventNest hoy y descubre eventos profesionales increíbles que te ayudarán a hacer crecer tu
							carrera y ampliar tu red.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg" variant="secondary" asChild className="text-lg px-8">
								<Link href="/registro">Comenzar Gratis</Link>
							</Button>
							{/* <Button
								size="lg"
								variant="outline"
								asChild
								className="text-lg px-8 bg-transparent text-white border-white hover:bg-white hover:text-gray-900"
							>
								<Link href="/eventos">Ver Eventos</Link>
							</Button> */}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}
