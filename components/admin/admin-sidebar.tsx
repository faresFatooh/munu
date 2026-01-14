"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { LayoutDashboard, UtensilsCrossed, Tags, Settings, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface AdminSidebarProps {
  onLogout: () => void
}

const navItems = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/categories", label: "الأقسام", icon: Tags },
  { href: "/admin/menu-items", label: "الأصناف", icon: UtensilsCrossed },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
]

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-mehran-dark-light rounded-lg border border-mehran-gold/20"
      >
        {isMobileOpen ? <X className="text-white" /> : <Menu className="text-white" />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 right-0 z-40 w-64 bg-mehran-dark-light border-l border-mehran-gold/20 transform transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-mehran-gold/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative">
                <Image
                  src="/images/305574365-476836291159139-6829281272340201855-n.png"
                  alt="Mehran"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="font-bold text-white">مطعم مهران</h2>
                <p className="text-xs text-gray-400">لوحة التحكم</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-mehran-gold text-mehran-dark"
                      : "text-gray-300 hover:bg-mehran-gold/10 hover:text-mehran-gold",
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-mehran-gold/20">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
