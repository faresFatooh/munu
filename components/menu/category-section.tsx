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
      <div className="relative mb-10 text-center">
        <div className="relative inline-block">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{category.nameAr}</h2>
          <p className="text-amber-500 text-sm tracking-widest uppercase">{category.nameEn}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {items.map((item, index) => (
          <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <MenuItemCard 
              item={item} 
              onAddToSaved={onAddToSaved} 
              isSaved={isSaved} 
            />
          </div>
        ))}
      </div>
    </section>
  )
}