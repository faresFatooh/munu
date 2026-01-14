"use client"

import { useState, useEffect, useCallback } from "react"
import type { SavedItem, MenuItem, PriceOption } from "@/types/menu"

const STORAGE_KEY = "mehran_saved_items"

export function useSavedItems() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setSavedItems(JSON.parse(stored))
    }
  }, [])

  const saveToStorage = useCallback((items: SavedItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    setSavedItems(items)
  }, [])

  const addItem = useCallback(
    (item: MenuItem, selectedPrice: PriceOption) => {
      setSavedItems((prev) => {
        const existingIndex = prev.findIndex(
          (s) => s.item.id === item.id && s.selectedPrice.label === selectedPrice.label,
        )

        let newItems
        if (existingIndex >= 0) {
          newItems = [...prev]
          newItems[existingIndex].quantity += 1
        } else {
          newItems = [...prev, { item, selectedPrice, quantity: 1 }]
        }

        saveToStorage(newItems)
        return newItems
      })
    },
    [saveToStorage],
  )

  const removeItem = useCallback(
    (itemId: string, priceLabel: string) => {
      setSavedItems((prev) => {
        const newItems = prev.filter((s) => !(s.item.id === itemId && s.selectedPrice.label === priceLabel))
        saveToStorage(newItems)
        return newItems
      })
    },
    [saveToStorage],
  )

  const updateQuantity = useCallback(
    (itemId: string, priceLabel: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId, priceLabel)
        return
      }

      setSavedItems((prev) => {
        const newItems = prev.map((s) =>
          s.item.id === itemId && s.selectedPrice.label === priceLabel ? { ...s, quantity } : s,
        )
        saveToStorage(newItems)
        return newItems
      })
    },
    [removeItem, saveToStorage],
  )

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSavedItems([])
  }, [])

  const totalPrice = savedItems.reduce((sum, item) => sum + item.selectedPrice.price * item.quantity, 0)

  const totalItems = savedItems.reduce((sum, item) => sum + item.quantity, 0)

  return {
    savedItems,
    addItem,
    removeItem,
    updateQuantity,
    clearAll,
    totalPrice,
    totalItems,
  }
}
