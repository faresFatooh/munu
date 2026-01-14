"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useMenuData } from "@/hooks/use-menu-data"
import { useSavedItems } from "@/hooks/use-saved-items"
import { MenuHeader } from "@/components/menu/menu-header"
import { CategoryTabs } from "@/components/menu/category-tabs"
import { CategorySection } from "@/components/menu/category-section"
import { FloatingCartButton } from "@/components/menu/floating-cart-button"
import { SavedItemsSheet } from "@/components/menu/saved-items-sheet"
import type { MenuItem } from "@/types/menu"
import { Sparkles, UtensilsCrossed, Loader2 } from "lucide-react"

export default function MenuPage() {
  const [isMounted, setIsMounted] = useState(false)
  const { categories, menuItems, settings, loading } = useMenuData()
  
  // جلب بيانات السلة مع توفير قيم افتراضية فورية لمنع TypeError
  const cart = useSavedItems()
  const {
    savedItems = [],
    addItem = () => {},
    removeItem = () => {},
    updateQuantity = () => {},
    clearAll = () => {},
    totalPrice = 0,
    totalItems = 0
  } = cart || {}

  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // حساب الأقسام النشطة بشكل آمن
  const activeCategories = useMemo(() => 
    (categories || []).filter((cat) => cat.isActive), 
  [categories])

  useEffect(() => {
    if (isMounted && activeCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(activeCategories[0].id)
    }
  }, [isMounted, activeCategories, selectedCategory])

  const handleSaveItem = useCallback(
    (item: MenuItem, selectedPrice: { label: string; price: number }, quantity: number) => {
      if (typeof addItem === "function") {
        addItem(item, selectedPrice, quantity)
      }
    },
    [addItem],
  )

  const scrollToCategory = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  // شاشة التحميل
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-amber-500 animate-pulse">جاري تحضير قائمة الطعام...</p>
        </div>
      </div>
    )
  }

  // إذا لم توجد أقسام
  if (activeCategories.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
        <div className="text-center">
          <UtensilsCrossed className="w-16 h-16 text-amber-500/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">لا يوجد أصناف معروضة حالياً</h2>
          <p className="text-gray-400">يرجى العودة لاحقاً</p>
        </div>
      </div>
    )
  }

  const serviceCharge = settings?.serviceCharge || 0
  // تأكد أن الحسابات لا تعود بـ NaN
  const safeTotalPrice = typeof totalPrice === 'number' ? totalPrice : 0
  const finalTotal = safeTotalPrice + (safeTotalPrice * serviceCharge) / 100

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white" dir="rtl">
      <MenuHeader settings={settings} />

      <div className="sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-amber-500/10">
        <CategoryTabs
          categories={activeCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={scrollToCategory}
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
              onSaveItem={handleSaveItem}
            />
          )
        })}
      </main>

      {/* منع ظهور الأزرار حتى يتم التأكد من تحميل الـ Hook بالكامل في المتصفح */}
      {isMounted && totalItems > 0 && (
        <FloatingCartButton 
          totalItems={totalItems} 
          totalPrice={finalTotal} 
          onClick={() => setIsCartOpen(true)} 
        />
      )}

      {isMounted && (
        <SavedItemsSheet
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          savedItems={savedItems}
          onRemove={removeItem}
          onUpdateQuantity={updateQuantity}
          onClearAll={clearAll}
          serviceCharge={serviceCharge}
        />
      )}
    </div>
  )
}