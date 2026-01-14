"use client"

import Image from "next/image"
import { X, Minus, Plus, Trash2, ShoppingBag, Sparkles, Receipt, CheckCircle2 } from "lucide-react"
import type { SavedItem } from "@/types/menu"
import { cn } from "@/lib/utils"

interface SavedItemsSheetProps {
  isOpen: boolean
  onClose: () => void
  savedItems: SavedItem[]
  totalPrice: number
  serviceCharge?: number
  onUpdateQuantity: (itemId: string, priceLabel: string, quantity: number) => void
  onRemoveItem: (itemId: string, priceLabel: string) => void
  onClearAll: () => void
}

export function SavedItemsSheet({
  isOpen,
  onClose,
  savedItems = [],
  totalPrice = 0,
  serviceCharge = 0,
  onUpdateQuantity,
  onRemoveItem,
  onClearAll,
}: SavedItemsSheetProps) {
  
  // تأمين الأرقام لمنع ظهور NaN
  const safeSubtotal = Number(totalPrice) || 0
  const safeServiceCharge = Number(serviceCharge) || 0
  const serviceAmount = (safeSubtotal * safeServiceCharge) / 100
  const finalTotal = safeSubtotal + serviceAmount

  return (
    <>
      {/* Overlay with blur */}
      <div
        className={cn(
          "fixed inset-0 bg-black/70 backdrop-blur-md z-[100] transition-all duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Premium Sheet */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-full max-w-md z-[101] transform transition-all duration-500 ease-out flex flex-col",
          "bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]",
          "border-r border-amber-500/20",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Premium Header */}
        <div className="relative p-5 border-b border-amber-500/20">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <ShoppingBag className="text-amber-500" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">المحفوظات</h2>
                <p className="text-sm text-gray-400">
                  {savedItems.length} {savedItems.length === 1 ? "صنف" : "أصناف"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/20 transition-all duration-300"
            >
              <X className="text-gray-400 hover:text-amber-500" size={22} />
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {savedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <ShoppingBag size={48} className="text-gray-700 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">السلة فارغة</h3>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 rounded-xl border border-amber-500/30 text-amber-500"
              >
                تصفح القائمة
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedItems.map((saved, index) => (
                <div
                  key={`${saved.item.id}-${saved.selectedPrice.label}-${index}`}
                  className="bg-white/5 rounded-xl p-3 border border-white/5"
                >
                  <div className="flex gap-3">
                    {saved.item.image && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={saved.item.image}
                          alt={saved.item.nameAr}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-sm truncate">{saved.item.nameAr}</h4>
                        <button 
                          onClick={() => onRemoveItem(saved.item.id, saved.selectedPrice.label)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-amber-500 mb-2">{saved.selectedPrice.label}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQuantity(saved.item.id, saved.selectedPrice.label, saved.quantity - 1)}
                            className="p-1 hover:text-amber-500"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{saved.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(saved.item.id, saved.selectedPrice.label, saved.quantity + 1)}
                            className="p-1 hover:text-amber-500"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-amber-500 font-bold">
                          {(Number(saved.selectedPrice.price) * saved.quantity).toFixed(0)}₪
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Premium Footer */}
        {savedItems.length > 0 && (
          <div className="p-5 bg-white/5 border-t border-amber-500/20 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>المجموع الفرعي</span>
                <span>{safeSubtotal.toFixed(0)}₪</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>رسوم الخدمة ({safeServiceCharge}%)</span>
                <span>{serviceAmount.toFixed(0)}₪</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                <span className="text-white font-bold">الإجمالي النهائي</span>
                <span className="text-2xl font-bold text-amber-500">{finalTotal.toFixed(0)}₪</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClearAll}
                className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium"
              >
                مسح الكل
              </button>
              <button
                onClick={onClose}
                className="flex-[2] py-3 rounded-xl bg-amber-500 text-black font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                <span>تأكيد الطلب</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}