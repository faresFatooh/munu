"use client"

import { useState, useEffect, useCallback } from "react"
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
  // 1. إضافة حالة التأكد من أن المكون تم تركيبه في المتصفح
  const [isMounted, setIsMounted] = useState(false)
  
  const { categories, menuItems, settings, loading } = useMenuData()
  const { savedItems, addItem, removeItem, updateQuantity, clearAll, totalPrice, totalItems } = useSavedItems()
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isCartOpen, setIsCartOpen] = useState(false)

  // 2. تفعيل الحالة عند التحميل (هذا يمنع خطأ Hydration)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 3. تأمين الفلترة (إضافة check للتأكد من وجود مصفوفة)
  const activeCategories = (categories || []).filter((cat) => cat.isActive)

  useEffect(() => {
    if (activeCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(activeCategories[0].id)
    }
  }, [activeCategories, selectedCategory])

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

  // 4. تعديل شرط التحميل ليشمل isMounted
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <div className="relative flex flex-col items-center">
             <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
             <p className="text-amber-500 font-medium">جاري تحميل المنيو الفاخر...</p>
          </div>
        </div>
      </div>
    )
  }

  if (activeCategories.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-500/10 flex items-center justify-center">
            <UtensilsCrossed className="w-12 h-12 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">لا يوجد منيو متاح حالياً</h2>
          <p className="text-gray-400 mb-6">يرجى إضافة الأقسام والأصناف من لوحة التحكم لعرض المنيو للزبائن</p>
          <a
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-full hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            الذهاب للوحة التحكم
          </a>
        </div>
      </div>
    )
  }

  const serviceCharge = settings?.serviceCharge || 0
  const finalTotal = totalPrice + (totalPrice * serviceCharge) / 100

  return (
    <div className="min-h-screen bg-[#0d0d0d]" dir="rtl">
      {/* ... باقي الكود التصميمي الخاص بك كما هو تماماً ... */}
      <div className="relative z-10">
        <MenuHeader settings={settings} />

        <div className="sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-amber-500/10">
          <CategoryTabs
            categories={activeCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={scrollToCategory}
          />
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {activeCategories.map((category) => {
            const categoryItems = (menuItems || []).filter((item) => item.categoryId === category.id && item.isAvailable)
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
        
        {/* ... بقية الـ Footer والـ Floating Button ... */}
        <FloatingCartButton totalItems={totalItems} totalPrice={finalTotal} onClick={() => setIsCartOpen(true)} />

        <SavedItemsSheet
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          savedItems={savedItems}
          onRemove={removeItem}
          onUpdateQuantity={updateQuantity}
          onClearAll={clearAll}
          serviceCharge={serviceCharge}
        />
      </div>
    </div>
  )
}