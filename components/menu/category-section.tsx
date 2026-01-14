"use client"

import type { Category, MenuItem, PriceOption } from "@/types/menu"
import { MenuItemCard } from "./menu-item-card"

interface CategorySectionProps {
  category: Category
  items: MenuItem[]
  // قمت بتغيير الاسم هنا ليتوافق مع ما ترسله من صفحة المنيو
  onSaveItem: (item: MenuItem, price: PriceOption, quantity: number) => void 
}

export function CategorySection({ category, items, onSaveItem }: CategorySectionProps) {
  if (items.length === 0) return null

  return (
    <section id={`category-${category.id}`} className="py-10 px-4">
      <div className="relative mb-10 text-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-16 bg-amber-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative inline-block">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              <div className="w-1.5 h-1.5 bg-amber-500/60 rounded-full" />
              <div className="w-1.5 h-1.5 bg-amber-500/30 rounded-full" />
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-wide">{category.nameAr}</h2>

          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-amber-500/30" />
            <p className="text-amber-500 text-sm tracking-[0.25em] uppercase font-light">{category.nameEn}</p>
            <span className="h-px w-8 bg-amber-500/30" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {items.map((item, index) => (
          <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <MenuItemCard 
              item={item} 
              // نمرر الدالة لـ MenuItemCard مع التأكد من إرسال الكمية 1 كقيمة افتراضية
              onAddToSaved={(item, price) => onSaveItem(item, price, 1)} 
            />
          </div>
        ))}
      </div>
    </section>
  )
}