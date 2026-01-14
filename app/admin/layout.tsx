"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Loader2 } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push("/admin/login")
    }
  }, [user, loading, router, isLoginPage])

  const handleLogout = async () => {
    await logout()
    router.push("/admin/login")
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mehran-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-mehran-gold animate-spin mx-auto mb-4" />
          <p className="text-mehran-warm">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-mehran-dark flex" dir="rtl">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
