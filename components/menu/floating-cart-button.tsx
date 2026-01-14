"use client"

import { ShoppingBag, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingCartButtonProps {
  itemCount: number
  onClick: () => void
}

export function FloatingCartButton({ itemCount, onClick }: FloatingCartButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 left-6 z-30 group",
        "flex items-center gap-3 px-5 py-3.5 rounded-2xl",
        "bg-gradient-to-r from-mehran-gold to-mehran-gold-light text-mehran-dark font-bold",
        "shadow-xl shadow-mehran-gold/30",
        "hover:shadow-2xl hover:shadow-mehran-gold/40 hover:scale-105",
        "transition-all duration-500 ease-out",
        "animate-in slide-in-from-bottom-4",
      )}
    >
      {/* Glow effect */}
      <span className="absolute inset-0 rounded-2xl bg-mehran-gold/30 blur-xl -z-10 group-hover:blur-2xl transition-all" />

      {/* Animated sparkle */}
      <Sparkles
        size={18}
        className="absolute -top-1 -right-1 text-mehran-gold-light animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"
      />

      <div className="relative">
        <ShoppingBag size={22} className="group-hover:scale-110 transition-transform duration-300" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-mehran-dark text-mehran-gold text-xs font-bold rounded-full animate-bounce">
            {itemCount}
          </span>
        )}
      </div>

      <span className="text-base">المحفوظات</span>

      {itemCount > 0 && (
        <span className="bg-mehran-dark/90 text-mehran-gold px-3 py-1 rounded-full text-sm font-bold">
          {itemCount} {itemCount === 1 ? "صنف" : "أصناف"}
        </span>
      )}

      {/* Shine effect */}
      <span className="absolute inset-0 rounded-2xl overflow-hidden">
        <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </span>
    </button>
  )
}
