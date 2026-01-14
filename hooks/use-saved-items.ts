"use client"

import { useState, useEffect, useCallback } from "react"
import type { SavedItem, MenuItem, PriceOption } from "@/types/menu"

const STORAGE_KEY = "mehran_saved_items"

export function useSavedItems() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setSavedItems(JSON.parse(stored))
        }
      } catch (error) {
        console.error("Cart error:", error)
      }
    }
  }, [])

  const saveToStorage = useCallback((items: SavedItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [])

  const addItem = useCallback(
    (item: MenuItem, selectedPrice: PriceOption, quantity: number = 1) => {
      if (!item || !selectedPrice) return;
      setSavedItems((prev) => {
        const existingIndex = prev.findIndex(
          (s) => s.item.id === item.id && s.selectedPrice.label === selectedPrice.label
        )
        let newItems
        if (existingIndex >= 0) {
          newItems = [...prev]
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: (newItems[existingIndex].quantity || 0) + (quantity || 1),
          }
        } else {
          newItems = [...prev, { item, selectedPrice, quantity: (quantity || 1) }]
        }
        saveToStorage(newItems)
        return newItems
      })
    },
    [saveToStorage]
  )

  const removeItem = useCallback(
    (itemId: string, priceLabel: string) => {
      setSavedItems((prev) => {
        const newItems = prev.filter((s) => !(s.item.id === itemId && s.selectedPrice.label === priceLabel))
        saveToStorage(newItems)
        return newItems
      })
    },
    [saveToStorage]
  )

  const updateQuantity = useCallback(
    (itemId: string, priceLabel: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId, priceLabel)
        return
      }
      setSavedItems((prev) => {
        const newItems = prev.map((s) =>
          s.item.id === itemId && s.selectedPrice.label === priceLabel ? { ...s, quantity } : s
        )
        saveToStorage(newItems)
        return newItems
      })
    },
    [removeItem, saveToStorage]
  )

  const clearAll = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
      setSavedItems([])
    }
  }, [])

  // دالة التحقق من وجود الصنف في السلة
  const isSaved = useCallback((itemId: string, priceLabel: string) => {
    return savedItems.some(s => s.item.id === itemId && s.selectedPrice.label === priceLabel)
  }, [savedItems])

  const totalPrice = (savedItems || []).reduce((sum, item) => sum + (item.selectedPrice?.price || 0) * (item.quantity || 0), 0)
  const totalItems = (savedItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0)

  return {
    savedItems,
    addItem,
    removeItem,
    updateQuantity,
    clearAll,
    isSaved, // أضفنا هذه الدالة هنا
    totalPrice,
    totalItems,
  }
}