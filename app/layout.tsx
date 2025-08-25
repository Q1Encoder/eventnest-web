import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Q1Eventos - Platform for Professional Events",
  description:
    "Discover, register and manage professional events with Q1Eventos. The leading platform for conferences, workshops and networking events.",
  keywords: "events, conferences, workshops, networking, professional development, Q1Eventos",
  authors: [{ name: "Q1Eventos Team" }],
  openGraph: {
    title: "Q1Eventos - Platform for Professional Events",
    description: "Discover, register and manage professional events with Q1Eventos",
    url: "https://q1eventos.com",
    siteName: "Q1Eventos",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Q1Eventos Platform",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Q1Eventos - Platform for Professional Events",
    description: "Discover, register and manage professional events with Q1Eventos",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
