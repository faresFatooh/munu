import type React from "react"
import type { Metadata, Viewport } from "next"
import { Tajawal, Amiri, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
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
  description:
    "مطعم مهران - أشهى المأكولات العربية والفلسطينية التراثية. تجربة طعام فاخرة مع منيو رقمي احترافي. Mehran Restaurant - The finest Arabic and Palestinian cuisine.",
  keywords: ["مطعم", "مهران", "فلسطيني", "عربي", "منيو", "طعام", "مأكولات تراثية", "مطبخ عربي", "restaurant", "menu"],
  authors: [{ name: "Mehran Kitchen & Restaurant" }],
  creator: "Mehran Kitchen & Restaurant",
  icons: {
    icon: "/images/305574365-476836291159139-6829281272340201855-n.png",
    apple: "/images/305574365-476836291159139-6829281272340201855-n.png",
  },
  openGraph: {
    title: "مطعم ومطبخ مهران | Mehran Kitchen & Restaurant",
    description: "أشهى المأكولات العربية والفلسطينية التراثية",
    type: "website",
    locale: "ar_PS",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body
        className={`${tajawal.className} ${amiri.variable} ${geistMono.variable} font-sans antialiased bg-mehran-dark text-foreground`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
