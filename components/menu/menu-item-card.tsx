"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Check, ImageIcon, Sparkles } from "lucide-react"
import type { MenuItem, PriceOption } from "@/types/menu"
import { cn } from "@/lib/utils"

interface MenuItemCardProps {
  item: MenuItem
  onAddToSaved: (item: MenuItem, price: PriceOption) => void
  isSaved: (itemId: string, priceLabel: string) => boolean
}

export function MenuItemCard({ item, onAddToSaved, isSaved }: MenuItemCardProps) {
  const [selectedPrice, setSelectedPrice] = useState<PriceOption | null>(
    item.prices.length === 1 ? item.prices[0] : null,
  )
  const [showPriceSelector, setShowPriceSelector] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAddClick = () => {
    if (item.prices.length === 1) {
      handleAdd(item.prices[0])
    } else {
      setShowPriceSelector(true)
    }
  }

  const handleAdd = (price: PriceOption) => {
    onAddToSaved(item, price)
    setSelectedPrice(price)
    setShowPriceSelector(false)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  const itemIsSaved = selectedPrice ? isSaved(item.id, selectedPrice.label) : false
  const hasImage = item.image && !imageError

  return (
    <div className="group relative card-premium rounded-2xl overflow-hidden bg-mehran-dark-card border border-mehran-gold/10 hover:border-mehran-gold/30">
      {/* Image Section - Large and prominent */}
      <div className={cn("relative overflow-hidden", hasImage ? "h-48 md:h-56" : "h-32")}>
        {hasImage ? (
          <>
            <Image
              src={item.image! || "/placeholder.svg"}
              alt={item.nameAr}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
            {/* Premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-mehran-dark-card via-transparent to-transparent" />
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </>
        ) : (
          // Elegant placeholder for items without images
          <div className="absolute inset-0 bg-gradient-to-br from-mehran-dark-light to-mehran-dark-card flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-mehran-gold/10 rounded-full blur-xl" />
              <ImageIcon className="w-12 h-12 text-mehran-gold/30 relative" />
            </div>
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 w-8 h-8 border border-mehran-gold/50 rotate-45" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border border-mehran-gold/50 rotate-45" />
            </div>
          </div>
        )}

        {/* Availability badge */}
        {!item.isAvailable && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-mehran-red/90 text-white text-xs font-medium backdrop-blur-sm">
            غير متوفر
          </div>
        )}

        {/* Featured badge for items with images */}
        {hasImage && item.isAvailable && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-mehran-dark/60 backdrop-blur-sm border border-mehran-gold/20">
            <Sparkles className="w-3 h-3 text-mehran-gold" />
            <span className="text-xs text-mehran-gold">مميز</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Header with name and add button */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-1 truncate group-hover:text-mehran-gold transition-colors">
              {item.nameAr}
            </h3>
            <p className="text-sm text-mehran-warm truncate">{item.nameEn}</p>
          </div>

          {/* Premium Add Button */}
          <button
            onClick={handleAddClick}
            disabled={!item.isAvailable}
            className={cn(
              "relative p-3 rounded-xl transition-all duration-500 group/btn",
              justAdded || itemIsSaved
                ? "bg-mehran-green text-white shadow-lg shadow-mehran-green/30"
                : "bg-gradient-to-br from-mehran-gold/20 to-mehran-gold/5 text-mehran-gold hover:from-mehran-gold hover:to-mehran-gold-light hover:text-mehran-dark border border-mehran-gold/30 hover:border-transparent",
              !item.isAvailable && "opacity-40 cursor-not-allowed",
            )}
          >
            {justAdded || itemIsSaved ? (
              <Check size={22} className="animate-scale-in" />
            ) : (
              <Plus size={22} className="group-hover/btn:rotate-90 transition-transform duration-300" />
            )}
            {/* Button glow effect */}
            {!(justAdded || itemIsSaved) && item.isAvailable && (
              <span className="absolute inset-0 rounded-xl bg-mehran-gold/20 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity -z-10" />
            )}
          </button>
        </div>

        {/* Description if available */}
        {item.description && <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description}</p>}

        {/* Price Tags */}
        <div className="flex flex-wrap gap-2">
          {item.prices.slice(0, showPriceSelector ? item.prices.length : 3).map((price, index) => (
            <button
              key={index}
              onClick={() => showPriceSelector && handleAdd(price)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-all duration-300",
                showPriceSelector
                  ? "cursor-pointer bg-mehran-dark-light hover:bg-mehran-gold hover:text-mehran-dark border border-mehran-gold/30 hover:border-transparent hover:scale-105"
                  : "cursor-default bg-mehran-dark-light/50 border border-mehran-gold/10",
              )}
            >
              <span className="text-gray-400 ml-1.5">{price.label}</span>
              <span className="font-bold text-mehran-gold">{price.price}</span>
              <span className="text-mehran-gold text-xs mr-0.5">₪</span>
            </button>
          ))}
          {!showPriceSelector && item.prices.length > 3 && (
            <span className="px-3 py-1.5 text-sm text-mehran-gold/60">+{item.prices.length - 3} أحجام</span>
          )}
        </div>

        {/* Price Selector Modal */}
        {showPriceSelector && item.prices.length > 1 && (
          <div className="mt-4 p-4 rounded-xl glass-gold animate-fade-in-up">
            <p className="text-sm text-mehran-gold mb-3 text-center font-medium">اختر الحجم المطلوب:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {item.prices.map((price, index) => (
                <button
                  key={index}
                  onClick={() => handleAdd(price)}
                  className="px-4 py-2.5 rounded-xl bg-mehran-dark-card text-mehran-gold hover:bg-mehran-gold hover:text-mehran-dark transition-all duration-300 border border-mehran-gold/20 hover:border-transparent hover:scale-105 hover:shadow-lg hover:shadow-mehran-gold/20"
                >
                  <span className="font-medium">{price.label}</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="font-bold">{price.price}₪</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPriceSelector(false)}
              className="mt-3 w-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              إلغاء
            </button>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mehran-gold/0 to-transparent group-hover:via-mehran-gold/50 transition-all duration-500" />
    </div>
  )
}
