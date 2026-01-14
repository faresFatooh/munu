"use client"

import Image from "next/image"
import { Sparkles, Phone, MapPin, Clock } from "lucide-react"
import type { SiteSettings } from "@/types/menu"

interface MenuHeaderProps {
  settings: SiteSettings | null
}

export function MenuHeader({ settings }: MenuHeaderProps) {
  const logoUrl = settings?.logo || "/images/305574365-476836291159139-6829281272340201855-n.png"

  return (
    <header className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/481213965-1036221831887246-1897632067416837034-n.jpg"
          alt="Mehran Restaurant"
          fill
          className="object-cover scale-105"
          priority
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-mehran-dark/80 via-mehran-dark/40 to-mehran-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-mehran-dark/50 via-transparent to-mehran-dark/50" />

        {/* Animated gold particles overlay */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute top-20 left-10 w-2 h-2 bg-mehran-gold rounded-full animate-float"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-40 right-20 w-1.5 h-1.5 bg-mehran-gold-light rounded-full animate-float"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-40 left-1/4 w-1 h-1 bg-mehran-gold rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-32 right-1/3 w-2 h-2 bg-mehran-gold-light rounded-full animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center py-16 md:py-24 px-4">
        <div className="relative mb-6 group">
          <div className="absolute -inset-4 bg-mehran-gold/20 rounded-full blur-xl group-hover:bg-mehran-gold/30 transition-all duration-500" />
          <div className="relative w-36 h-36 md:w-44 md:h-44">
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt={settings?.restaurantNameAr || "مطعم مهران"}
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-mehran-gold animate-pulse" />
            <span className="text-mehran-gold/80 text-sm tracking-[0.3em] uppercase">Kitchen & Restaurant</span>
            <Sparkles className="w-5 h-5 text-mehran-gold animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide">
            {settings?.restaurantNameAr || "مطعم ومطبخ مهران"}
          </h1>

          <p className="text-mehran-gold text-xl md:text-2xl font-light tracking-wider">
            {settings?.restaurantNameEn || "Mehran Kitchen & Restaurant"}
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-mehran-gold" />
            <div className="w-2 h-2 bg-mehran-gold rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-mehran-gold" />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {settings?.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-mehran-gold/20 transition-all duration-300 group"
            >
              <Phone className="w-4 h-4 text-mehran-gold group-hover:scale-110 transition-transform" />
              <span className="text-gray-200 text-sm">{settings.phone}</span>
            </a>
          )}
          {settings?.address && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
              <MapPin className="w-4 h-4 text-mehran-gold" />
              <span className="text-gray-200 text-sm">{settings.address}</span>
            </div>
          )}
          {settings?.workingHours && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Clock className="w-4 h-4 text-mehran-gold" />
              <span className="text-gray-200 text-sm">{settings.workingHours}</span>
            </div>
          )}
        </div>

        <div className="mt-6 px-6 py-2 rounded-full bg-mehran-gold/10 border border-mehran-gold/20">
          <p className="text-sm text-mehran-gold">
            ملاحظة: الأسعار لا تشمل قيمة الخدمة ({settings?.serviceCharge || 10}%)
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-mehran-dark to-transparent" />
    </header>
  )
}
