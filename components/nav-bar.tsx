"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Calendar,
  User,
  Settings,
  LogOut,
  Menu,
  Home,
  Ticket,
  Award,
  BarChart3,
  Users,
  FileText,
  UserCheck,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"


const navigationItems = [
  {
    title: "Events",
    href: "/eventos",
    description: "Discover and register for upcoming events",
  },
  {
    title: "My Tickets",
    href: "/boletos",
    description: "View and manage your event tickets",
  },
  {
    title: "Certificates",
    href: "/certificados",
    description: "Download your event certificates",
  },
]

const adminItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
    description: "Overview and analytics",
  },
  {
    title: "Events",
    href: "/admin/eventos",
    icon: Calendar,
    description: "Manage events",
  },
  {
    title: "Users",
    href: "/admin/usuarios",
    icon: Users,
    description: "User management",
  },
  {
    title: "Reports",
    href: "/admin/reportes",
    icon: FileText,
    description: "Generate reports",
  },
  {
    title: "Attendance",
    href: "/admin/asistencia",
    icon: UserCheck,
    description: "Check-in control",
  },
]

export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Obtén datos adicionales desde Firestore si los tienes guardados ahí
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        if (userDoc.exists()) {
          // Si tienes más datos del usuario en Firestore, úsalos
          console.log("Datos del usuario desde Firestore:", userDoc.data())
          setUser(userDoc.data())
        } else {
          // Si no tienes más datos, usa los del auth

          console.log("El susuario", user)
          setUser({
            name: user.displayName || user.email,
            email: user.email,
          })
        }
      }
      // if (firebaseUser) {

      //   const userDoc = doc(db, "users", firebaseUser.uid)
      //   getDoc(userDoc).then((doc) => {
      //     if (doc.exists()) {
      //       console.log("User document data:", doc.data())
      //       setUser((prev) => ({
      //         ...prev,
      //         ...doc.data(),
      //       }))
      //     } else {
      //       console.log("No user document found")
      //     }
      //   })

      //   console.log("User logged in:", firebaseUser)
      //   setUser({
      //     name: firebaseUser.displayName || firebaseUser.email,
      //     email: firebaseUser.email,
      //     avatar: firebaseUser.photoURL || "/placeholder.svg?height=32&width=32",
      //     role: "user", // Puedes obtener el rol desde Firestore si lo necesitas
      //   })
      // } else {
      //   setUser(null)
      // }
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    setUser(null)
    router.push("/login")
  }

  const isAdmin = user?.role === "admin"
  const isAdminRoute = pathname.startsWith("/admin")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">EventNest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAdminRoute && (
              <NavigationMenu>
                {/* <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Events</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/eventos"
                            >
                              <Calendar className="h-6 w-6" />
                              <div className="mb-2 mt-4 text-lg font-medium">All Events</div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Browse all available events and find the perfect one for you.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        {navigationItems.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  pathname === item.href && "bg-accent text-accent-foreground",
                                )}
                              >
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList> */}
              </NavigationMenu>
            )}

            {/* {isAdmin && (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      Admin Panel
                      <Badge variant="secondary" className="ml-2">
                        Admin
                      </Badge>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                        {adminItems.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  pathname === item.href && "bg-accent text-accent-foreground",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <item.icon className="h-4 w-4" />
                                  <div className="text-sm font-medium leading-none">{item.title}</div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )} */}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {user && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {(user.name || user.email || "U")
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/boletos">
                      <Ticket className="mr-2 h-4 w-4" />
                      <span>Mis boletos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/certificados">
                      <Award className="mr-2 h-4 w-4" />
                      <span>Certificados</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuraciones</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>

                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-accent",
                        pathname === item.href && "bg-accent",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  ))}

                  {/* Puedes agregar aquí el menú admin si el usuario es admin */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
