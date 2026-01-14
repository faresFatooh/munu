"use client"

import type { User } from "firebase/auth"
import { Bell, UserIcon } from "lucide-react"

interface AdminHeaderProps {
  user: User | null
  title: string
}

export function AdminHeader({ user, title }: AdminHeaderProps) {
  return (
    <header className="bg-mehran-dark-light border-b border-mehran-gold/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">{title}</h1>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-mehran-gold/10 text-gray-400 hover:text-mehran-gold transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 left-1 w-2 h-2 bg-mehran-green rounded-full" />
          </button>

          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-mehran-dark border border-mehran-gold/20">
            <div className="w-8 h-8 rounded-full bg-mehran-gold/20 flex items-center justify-center">
              <UserIcon className="text-mehran-gold" size={18} />
            </div>
            <span className="text-sm text-gray-300">{user?.email || "مسؤول"}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
