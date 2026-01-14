"use client"

import { useState, useEffect, useMemo } from "react"
import { useMenuData } from "@/hooks/use-menu-data"
import { useSavedItems } from "@/hooks/use-saved-items"
import { MenuHeader } from "@/components/menu/menu-header"
import { CategoryTabs } from "@/components/menu/category-tabs"
import { CategorySection } from "@/components/menu/category-section"
import { FloatingCartButton } from "@/components/menu/floating-cart-button"
import { SavedItemsSheet } from "@/components/menu/saved-items-sheet"
import { Loader2 } from "lucide-react"

export default function MenuPage() {
  const [isMounted, setIsMounted] = useState(false)
  const { categories, menuItems, settings, loading } = useMenuData()
  const cart = useSavedItems()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const activeCategories = useMemo(() => 
    (categories || []).filter((cat) => cat.isActive), 
  [categories])

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    )
  }

  const finalTotal = cart.totalPrice + (cart.totalPrice * (settings?.serviceCharge || 0)) / 100

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white" dir="rtl">
      <MenuHeader settings={settings} />

      <div className="sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-amber-500/10">
        <CategoryTabs
          categories={activeCategories}
          selectedCategory="" // يمكن إضافة logic التحديد هنا
          onSelectCategory={(id) => {
             document.getElementById(`category-${id}`)?.scrollIntoView({ behavior: "smooth" })
          }}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        {activeCategories.map((category) => {
          const categoryItems = (menuItems || []).filter(
            (item) => item.categoryId === category.id && item.isAvailable
          )
          if (categoryItems.length === 0) return null
          return (
            <CategorySection
              key={category.id}
              category={category}
              items={categoryItems}
              onAddToSaved={cart.addItem}
              isSaved={cart.isSaved}
            />
          )
        })}
      </main>

      {cart.totalItems > 0 && (
        <FloatingCartButton 
          totalItems={cart.totalItems} 
          totalPrice={finalTotal} 
          onClick={() => setIsCartOpen(true)} 
        />
      )}

      {/* تأكد من تعريف setIsCartOpen و isCartOpen في المكون أو استخدامهما مباشرة */}
      <SavedItemsSheet
        isOpen={false} // استبدلها بـ State
        onClose={() => {}} 
        savedItems={cart.savedItems}
        onRemove={cart.removeItem}
        onUpdateQuantity={cart.updateQuantity}
        onClearAll={cart.clearAll}
        serviceCharge={settings?.serviceCharge || 0}
      />
    </div>
  )
}