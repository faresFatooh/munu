"use client"

import { useState, useEffect } from "react"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import type { Category, MenuItem, SiteSettings } from "@/types/menu"

export function useMenuData() {
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const categoriesRef = ref(database, "categories")
    const itemsRef = ref(database, "menuItems")
    const settingsRef = ref(database, "settings")

    const unsubCategories = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const categoriesArray = Object.entries(data).map(([id, cat]: [string, any]) => ({
          id,
          ...cat,
        }))
        setCategories(categoriesArray.sort((a, b) => a.order - b.order))
      }
    })

    const unsubItems = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const itemsArray = Object.entries(data).map(([id, item]: [string, any]) => ({
          id,
          ...item,
        }))
        setMenuItems(itemsArray.sort((a, b) => a.order - b.order))
      }
    })

    const unsubSettings = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setSettings(data)
      }
      setLoading(false)
    })

    return () => {
      unsubCategories()
      unsubItems()
      unsubSettings()
    }
  }, [])

  return { categories, menuItems, settings, loading }
}
