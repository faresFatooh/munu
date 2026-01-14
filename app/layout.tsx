import type React from "react"
import type { Metadata, Viewport } from "next"
import { Tajawal, Amiri, Geist_Mono } from "next/font/google"
import "./globals.css"

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
})

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "مطعم ومطبخ مهران | Mehran Kitchen & Restaurant",
  description: "أشهى المأكولات العربية والفلسطينية التراثية.",
  icons: {
    icon: "/images/305574365-476836291159139-6829281272340201855-n.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className={`${tajawal.className} ${amiri.variable} ${geistMono.variable} font-sans antialiased bg-[#0c0a09] text-white`}>
        {children}
      </body>
    </html>
  )
}