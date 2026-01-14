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
  savedItems,
  totalPrice,
  serviceCharge = 10,
  onUpdateQuantity,
  onRemoveItem,
  onClearAll,
}: SavedItemsSheetProps) {
  const serviceAmount = (totalPrice * serviceCharge) / 100
  const finalTotal = totalPrice + serviceAmount

  return (
    <>
      {/* Overlay with blur */}
      <div
        className={cn(
          "fixed inset-0 bg-black/70 backdrop-blur-md z-40 transition-all duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Premium Sheet */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-full max-w-md z-50 transform transition-all duration-500 ease-out flex flex-col",
          "bg-gradient-to-b from-mehran-dark-light to-mehran-dark",
          "border-r border-mehran-gold/20",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Premium Header */}
        <div className="relative p-5 border-b border-mehran-gold/20">
          {/* Decorative gold line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mehran-gold to-transparent" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-mehran-gold/20 rounded-xl blur-lg" />
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-mehran-gold/20 to-mehran-gold/5 border border-mehran-gold/30">
                  <ShoppingBag className="text-mehran-gold" size={24} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">المحفوظات</h2>
                <p className="text-sm text-mehran-warm">
                  {savedItems.length} {savedItems.length === 1 ? "صنف" : "أصناف"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-mehran-dark-card/80 hover:bg-mehran-gold/20 transition-all duration-300 group"
            >
              <X className="text-gray-400 group-hover:text-mehran-gold transition-colors" size={22} />
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {savedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-mehran-gold/10 rounded-full blur-2xl" />
                <div className="relative p-6 rounded-full bg-mehran-dark-card border border-mehran-gold/20">
                  <ShoppingBag size={48} className="text-mehran-gold/40" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">لا توجد عناصر محفوظة</h3>
              <p className="text-gray-400 mb-6">تصفح المنيو واضغط + لإضافة الأصناف التي تريدها</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-mehran-gold/20 text-mehran-gold hover:bg-mehran-gold hover:text-mehran-dark transition-all duration-300 border border-mehran-gold/30"
              >
                تصفح المنيو
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedItems.map((saved, index) => (
                <div
                  key={`${saved.item.id}-${saved.selectedPrice.label}-${index}`}
                  className="group relative rounded-xl overflow-hidden bg-mehran-dark-card border border-mehran-gold/10 hover:border-mehran-gold/30 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-3 p-3">
                    {/* Item Image */}
                    {saved.item.image ? (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={saved.item.image || "/placeholder.svg"}
                          alt={saved.item.nameAr}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-mehran-dark-card/50 to-transparent" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-mehran-dark-light flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="text-mehran-gold/30" size={24} />
                      </div>
                    )}

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="min-w-0">
                          <h3 className="font-bold text-white truncate">{saved.item.nameAr}</h3>
                          <p className="text-sm text-mehran-gold">{saved.selectedPrice.label}</p>
                        </div>
                        <button
                          onClick={() => onRemoveItem(saved.item.id, saved.selectedPrice.label)}
                          className="p-1.5 text-gray-500 hover:text-mehran-red hover:bg-mehran-red/10 rounded-lg transition-all duration-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onUpdateQuantity(saved.item.id, saved.selectedPrice.label, saved.quantity - 1)
                            }
                            className="p-1.5 rounded-lg bg-mehran-dark-light text-mehran-gold hover:bg-mehran-gold hover:text-mehran-dark transition-all duration-300"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-white font-bold w-8 text-center">{saved.quantity}</span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(saved.item.id, saved.selectedPrice.label, saved.quantity + 1)
                            }
                            className="p-1.5 rounded-lg bg-mehran-dark-light text-mehran-gold hover:bg-mehran-gold hover:text-mehran-dark transition-all duration-300"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-mehran-gold font-bold text-lg">
                          {saved.selectedPrice.price * saved.quantity}₪
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mehran-gold/0 to-transparent group-hover:via-mehran-gold/30 transition-all" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Premium Footer */}
        {savedItems.length > 0 && (
          <div className="relative border-t border-mehran-gold/20 p-5 bg-mehran-dark-card/50 backdrop-blur-sm">
            {/* Decorative element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="px-4 py-1 rounded-full bg-mehran-dark border border-mehran-gold/30 flex items-center gap-2">
                <Receipt size={14} className="text-mehran-gold" />
                <span className="text-xs text-mehran-gold">الفاتورة</span>
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-3 mb-5 mt-2">
              <div className="flex justify-between text-gray-300">
                <span>المجموع الفرعي</span>
                <span className="font-medium">{totalPrice}₪</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span className="flex items-center gap-1">
                  <Sparkles size={12} className="text-mehran-gold" />
                  رسوم الخدمة ({serviceCharge}%)
                </span>
                <span>{serviceAmount.toFixed(0)}₪</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-mehran-gold/30 to-transparent" />
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-lg">الإجمالي</span>
                <span className="text-2xl font-bold text-gradient-gold">{finalTotal.toFixed(0)}₪</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClearAll}
                className="flex-1 py-3.5 rounded-xl bg-mehran-red/10 text-mehran-red hover:bg-mehran-red/20 transition-all duration-300 border border-mehran-red/20 font-medium"
              >
                مسح الكل
              </button>
              <button
                onClick={onClose}
                className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-mehran-gold to-mehran-gold-light text-mehran-dark font-bold hover:shadow-lg hover:shadow-mehran-gold/30 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                <span>تأكيد للنادل</span>
              </button>
            </div>

            <p className="text-center text-gray-500 text-xs mt-4">اعرض هذه الشاشة للنادل لتأكيد طلبك</p>
          </div>
        )}
      </div>
    </>
  )
}
