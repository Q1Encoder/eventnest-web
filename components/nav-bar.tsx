"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Calendar,
  LogOut,
  Menu,
  Home,
  Award,
  Users,
  Bell,
  LayoutDashboard,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"

const navigationItems = [
  { title: "Eventos", href: "/eventos", description: "Descubre y regístrate en eventos próximos" },
  /* { title: "Certificados", href: "/certificados", description: "Descarga tus certificados de eventos" }, */
]

export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUser({
              firstName: userData.firstName || firebaseUser.displayName || firebaseUser.email,
              lastName: userData.lastName || "",
              email: userData.email || firebaseUser.email,
              avatar: userData.avatar || firebaseUser.photoURL || "/placeholder.svg",
              role: userData.role || "user",
            })
            setIsAdmin(userData.role === "admin")
          } else {
            setUser({
              firstName: firebaseUser.displayName || firebaseUser.email,
              lastName: "",
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL || "/placeholder.svg",
              role: "user",
            })
            setIsAdmin(false)
          }
        } catch (error) {
          console.error("Error al verificar el estado de administrador:", error)
          toast({ title: "Error", description: "No se pudo verificar el estado de administrador.", variant: "destructive" })
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setIsOpen(false)
    })
    return () => unsubscribe()
  }, [toast])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setIsAdmin(false)
      toast({ title: "Cierre de Sesión", description: "Has cerrado sesión exitosamente." })
      router.push("/login")
    } catch (error) {
      toast({ title: "Error", description: "No se pudo cerrar sesión. Intenta de nuevo.", variant: "destructive" })
    }
  }

  const isAdminRoute = pathname.startsWith("/admin")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span className="font-bold text-xl">EventNest</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {!isAdminRoute && (
              <>
                {navigationItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    asChild
                    className={cn("text-muted-foreground hover:text-foreground", pathname === item.href && "text-foreground")}
                  >
                    <Link href={item.href}>{item.title}</Link>
                  </Button>
                ))}
                {user && (
                  <Button
                    variant="ghost"
                    asChild
                    className={cn("text-muted-foreground hover:text-foreground", pathname === "/dashboard" && "text-foreground")}
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Mis Inscripciones
                    </Link>
                  </Button>
                )}
                {isAdmin && (
                  <>
                    <Button
                      variant="ghost"
                      asChild
                      className={cn("text-muted-foreground hover:text-foreground", pathname === "/admin/usuarios" && "text-foreground")}
                    >
                      <Link href="/admin/usuarios">
                        <Users className="h-4 w-4 mr-2" />
                        Aprobar
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      asChild
                      className={cn("text-muted-foreground hover:text-foreground", pathname === "/admin/asistencia" && "text-foreground")}
                    >
                      <Link href="/admin/asistencia">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Check-in
                      </Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
              </Button>
            )}
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.firstName} />
                      <AvatarFallback>
                        {(user.firstName || user.email || "U").split(" ").map((n: string) => n[0]).join("")}
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
                    <Link href="/certificados">
                      <Award className="mr-2 h-4 w-4" />
                      <span>Certificados</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </>
            )}
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
                    className={cn("flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-accent", pathname === "/" && "bg-accent")}
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>Inicio</span>
                  </Link>
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn("flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-accent", pathname === item.href && "bg-accent")}
                      onClick={() => setIsOpen(false)}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                  {user && (
                    <Link
                      href="/dashboard"
                      className={cn("flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-accent", pathname === "/dashboard" && "bg-accent")}
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Mis Inscripciones</span>
                    </Link>
                  )}
                  {isAdmin && (
                    <>
                      <Link
                        href="/admin/usuarios"
                        className={cn("flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-accent", pathname === "/admin/usuarios" && "bg-accent")}
                        onClick={() => setIsOpen(false)}
                      >
                        <Users className="h-4 w-4" />
                        <span>Aprobar</span>
                      </Link>
                      <Link
                        href="/admin/asistencia"
                        className={cn("flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-accent", pathname === "/admin/asistencia" && "bg-accent")}
                        onClick={() => setIsOpen(false)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Check-in</span>
                      </Link>
                    </>
                )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}