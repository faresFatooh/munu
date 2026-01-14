"use client"

import { useRef, useEffect } from "react"
import type { Category } from "@/types/menu"
import { cn } from "@/lib/utils"

interface CategoryTabsProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const activeTab = document.getElementById(`tab-${activeCategory}`)
    if (activeTab && scrollRef.current) {
      const container = scrollRef.current
      const scrollLeft = activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: "smooth" })
    }
  }, [activeCategory])

  return (
    <div className="sticky top-0 z-20 glass border-b border-mehran-gold/10">
      <div className="relative">
        {/* Decorative gold line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mehran-gold/50 to-transparent" />

        <div ref={scrollRef} className="flex overflow-x-auto scrollbar-hide py-4 px-4 gap-3">
          {categories
            .filter((c) => c.isActive)
            .map((category, index) => (
              <button
                key={category.id}
                id={`tab-${category.id}`}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "relative flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-500 group",
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-mehran-gold to-mehran-gold-light text-mehran-dark shadow-lg shadow-mehran-gold/25"
                    : "bg-mehran-dark-card/80 text-gray-400 hover:text-mehran-gold border border-mehran-gold/10 hover:border-mehran-gold/30",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Active indicator glow */}
                {activeCategory === category.id && (
                  <span className="absolute inset-0 rounded-full bg-mehran-gold/20 blur-md -z-10" />
                )}

                <span className="relative z-10 flex items-center gap-2">{category.nameAr}</span>

                {/* Hover shine effect */}
                <span className="absolute inset-0 rounded-full overflow-hidden">
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </span>
              </button>
            ))}
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mehran-gold/30 to-transparent" />
      </div>
    </div>
  )
}
