"use client"

import type { Category, MenuItem, PriceOption } from "@/types/menu"
import { MenuItemCard } from "./menu-item-card"

interface CategorySectionProps {
  category: Category
  items: MenuItem[]
  onAddToSaved: (item: MenuItem, price: PriceOption) => void
  isSaved: (itemId: string, priceLabel: string) => boolean
}

export function CategorySection({ category, items, onAddToSaved, isSaved }: CategorySectionProps) {
  if (items.length === 0) return null

  return (
    <section id={`category-${category.id}`} className="py-10 px-4">
      {/* Premium Category Header */}
      <div className="relative mb-10 text-center">
        {/* Background decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-16 bg-mehran-gold/5 rounded-full blur-2xl" />
        </div>

        <div className="relative inline-block">
          {/* Top decorative line */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-mehran-gold/50" />
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-mehran-gold rounded-full" />
              <div className="w-1.5 h-1.5 bg-mehran-gold/60 rounded-full" />
              <div className="w-1.5 h-1.5 bg-mehran-gold/30 rounded-full" />
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-mehran-gold/50" />
          </div>

          {/* Main title with elegant styling */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-wide">{category.nameAr}</h2>

          {/* English subtitle */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-mehran-gold/30" />
            <p className="text-mehran-gold text-sm tracking-[0.25em] uppercase font-light">{category.nameEn}</p>
            <span className="h-px w-8 bg-mehran-gold/30" />
          </div>

          {/* Bottom decorative element */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-mehran-gold/30" />
            <div className="w-2 h-2 border border-mehran-gold/50 rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-mehran-gold/30" />
          </div>
        </div>
      </div>

      {/* Items Grid with staggered animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {items.map((item, index) => (
          <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <MenuItemCard item={item} onAddToSaved={onAddToSaved} isSaved={isSaved} />
          </div>
        ))}
      </div>
    </section>
  )
}
