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
import { Loader2, UtensilsCrossed } from "lucide-react"

export default function MenuPage() {
  // 1. حالة التركيب (Mounting) - أهم سطر لحل مشكلة s is not a function
  const [isMounted, setIsMounted] = useState(false)
  
  // 2. جلب البيانات
  const { categories = [], menuItems = [], settings = {}, loading } = useMenuData()
  
  // 3. جلب دوال السلة مع حماية كاملة
  const savedItemsHook = useSavedItems()
  const {
    savedItems = [],
    addItem = () => {},
    removeItem = () => {},
    updateQuantity = () => {},
    clearAll = () => {},
    totalPrice = 0,
    totalItems = 0
  } = savedItemsHook || {}

  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isCartOpen, setIsCartOpen] = useState(false)

  // تفعيل الصفحة فور جاهزية المتصفح
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // تحديد القسم الأول تلقائياً
  const activeCategories = categories.filter((cat) => cat.isActive)
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
    [addItem]
  )

  const scrollToCategory = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  // 4. شاشة التحميل (تمنع ظهور أي خطأ حتى يكتمل التركيب)
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-amber-500 font-medium tracking-widest">MEHRAN MENU</p>
      </div>
    )
  }

  // 5. حالة عدم وجود بيانات
  if (activeCategories.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6 text-center">
        <div>
          <UtensilsCrossed className="w-16 h-16 text-amber-500/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">المنيو غير متوفر حالياً</h2>
          <p className="text-gray-400">يرجى مراجعة الإدارة أو المحاولة لاحقاً</p>
        </div>
      </div>
    )
  }

  const serviceCharge = settings?.serviceCharge || 0
  const finalTotal = totalPrice + (totalPrice * serviceCharge) / 100

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-amber-500/30" dir="rtl">
      <MenuHeader settings={settings} />

      <div className="sticky top-0 z-40 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/5">
        <CategoryTabs
          categories={activeCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={scrollToCategory}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        {activeCategories.map((category) => {
          const categoryItems = menuItems.filter(
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

      {/* أزرار السلة تظهر فقط إذا كانت الدوال جاهزة */}
      {isMounted && (
        <>
          <FloatingCartButton 
            totalItems={totalItems} 
            totalPrice={finalTotal} 
            onClick={() => setIsCartOpen(true)} 
          />
          <SavedItemsSheet
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            savedItems={savedItems}
            onRemove={removeItem}
            onUpdateQuantity={updateQuantity}
            onClearAll={clearAll}
            serviceCharge={serviceCharge}
          />
        </>
      )}
    </div>
  )
}