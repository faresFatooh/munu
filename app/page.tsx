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
import { Sparkles, UtensilsCrossed } from "lucide-react"

export default function MenuPage() {
  const { categories, menuItems, settings, loading } = useMenuData()
  const { savedItems, addItem, removeItem, updateQuantity, clearAll, totalPrice, totalItems } = useSavedItems()
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isCartOpen, setIsCartOpen] = useState(false)

  const activeCategories = categories.filter((cat) => cat.isActive)

  useEffect(() => {
    if (activeCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(activeCategories[0].id)
    }
  }, [activeCategories, selectedCategory])

  const handleSaveItem = useCallback(
    (item: MenuItem, selectedPrice: { label: string; price: number }, quantity: number) => {
      addItem(item, selectedPrice, quantity)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-500/20 rounded-full animate-spin border-t-amber-500" />
            <Sparkles className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-amber-500 mt-4 font-medium">جاري تحميل المنيو...</p>
        </div>
      </div>
    )
  }

  if (activeCategories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#1a1a1a] flex items-center justify-center">
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

  const serviceCharge = settings?.serviceCharge || 10
  const finalTotal = totalPrice + (totalPrice * serviceCharge) / 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#1a1a1a]" dir="rtl">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/3 rounded-full blur-3xl" />
      </div>

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
            const categoryItems = menuItems.filter((item) => item.categoryId === category.id && item.isAvailable)

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

        <div className="text-center py-6 border-t border-amber-500/10">
          <p className="text-gray-400 text-sm">ملاحظة: الأسعار لا تشمل قيمة الخدمة ({serviceCharge}%)</p>
        </div>

        <footer className="bg-[#0a0a0a] border-t border-amber-500/10 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {settings?.logo && (
                <img src={settings.logo || "/placeholder.svg"} alt="Logo" className="w-12 h-12 object-contain" />
              )}
              <h3 className="text-xl font-bold text-amber-500">{settings?.restaurantNameAr || "مطعم مهران"}</h3>
            </div>
            {settings?.phone && <p className="text-gray-400 text-sm mb-2">هاتف: {settings.phone}</p>}
            {settings?.address && <p className="text-gray-400 text-sm mb-2">{settings.address}</p>}
            {settings?.workingHours && <p className="text-gray-400 text-sm">{settings.workingHours}</p>}
            <p className="text-gray-500 text-xs mt-4">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>

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
  )
}
